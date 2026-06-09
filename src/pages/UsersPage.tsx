import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminUsersApi } from '@/lib/admin-api';
import type { UserProfile } from '@/types';
import { 
  Users, Search, Plus, Minus, Crown, 
  Loader2, Award, Target, Calendar, Star,
  ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import './UsersPage.css';

function getUserDisplayName(user: UserProfile): string {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Noma\'lum';
}

function getUserAvatar(user: UserProfile): string {
  const name = getUserDisplayName(user);
  return name.charAt(0).toUpperCase();
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  
  // Coin modal
  const [coinModal, setCoinModal] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false, userId: '', userName: ''
  });
  const [coinAmount, setCoinAmount] = useState(0);
  const [coinDescription, setCoinDescription] = useState('');
  const [coinProcessing, setCoinProcessing] = useState(false);

  // Subscription modal
  const [subModal, setSubModal] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false, userId: '', userName: ''
  });
  const [planType, setPlanType] = useState('monthly');
  const [subAction, setSubAction] = useState<'activate' | 'cancel'>('activate');
  const [subProcessing, setSubProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page: page.toString(), limit: '20' };
      if (search) params.search = search;
      const response = await adminUsersApi.list(params);
      if (response.success) {
        setUsers(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages);
          setPage(response.pagination.page);
        }
      }
    } catch (err: any) {
      toast.error('Foydalanuvchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleUserClick = async (user: UserProfile) => {
    try {
      setUserDetailLoading(true);
      const response = await adminUsersApi.getById(user.id);
      if (response.success) {
        setSelectedUser(response.data);
      }
    } catch (err: any) {
      toast.error('Foydalanuvchi ma\'lumotlarini yuklashda xatolik');
    } finally {
      setUserDetailLoading(false);
    }
  };

  const handleOpenCoinModal = (user: UserProfile) => {
    setCoinModal({ open: true, userId: user.id, userName: getUserDisplayName(user) });
    setCoinAmount(0);
    setCoinDescription('');
  };

  const handleCoinSubmit = async () => {
    if (coinAmount === 0) {
      toast.error('Miqdorni kiriting');
      return;
    }

    try {
      setCoinProcessing(true);
      const response = await adminUsersApi.adjustCoins(coinModal.userId, coinAmount, coinDescription);
      if (response.success) {
        toast.success(`${coinAmount > 0 ? 'Qo\'shildi' : 'Ayirildi'}! Yangi balans: ${response.data.new_balance}`);
        setCoinModal({ open: false, userId: '', userName: '' });
        fetchUsers();
        if (selectedUser?.id === coinModal.userId) {
          handleUserClick(selectedUser);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setCoinProcessing(false);
    }
  };

  const handleOpenSubModal = (user: UserProfile, action: 'activate' | 'cancel') => {
    setSubModal({ open: true, userId: user.id, userName: getUserDisplayName(user) });
    setSubAction(action);
    setPlanType('monthly');
  };

  const handleSubSubmit = async () => {
    try {
      setSubProcessing(true);
      const status = subAction === 'activate' ? 'active' : 'cancelled';
      const response = await adminUsersApi.toggleSubscription(subModal.userId, planType, status);
      if (response.success) {
        toast.success(`Obuna ${subAction === 'activate' ? 'faollashtirildi' : 'bekor qilindi'}`);
        setSubModal({ open: false, userId: '', userName: '' });
        fetchUsers();
        if (selectedUser?.id === subModal.userId) {
          handleUserClick(selectedUser);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setSubProcessing(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getActiveSubscription = (user: UserProfile) => {
    return user.user_subscriptions?.find(s => s.status === 'active');
  };

  return (
    <div className="users-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <Users className="page-title-icon" />
          <div>
            <h1 className="page-title">Foydalanuvchilar</h1>
            <p className="page-subtitle">Barcha foydalanuvchilarni boshqarish</p>
          </div>
        </div>
      </div>

      <div className="users-layout">
        {/* Left: Users List */}
        <div className="users-list-section">
          {/* Search */}
          <div className="search-bar">
            <Search size={18} />
            <Input
              placeholder="Ism, username bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="default" size="sm" onClick={handleSearch}>
              Qidirish
            </Button>
          </div>

          <Card>
            {loading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" size={32} />
                <p>Yuklanmoqda...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>Foydalanuvchilar topilmadi</p>
              </div>
            ) : (
              <div className="users-table">
                <div className="users-header">
                  <span>Foydalanuvchi</span>
                  <span>Roli</span>
                  <span>Coinlar</span>
                  <span>Obuna</span>
                  <span>Sana</span>
                  <span>Amallar</span>
                </div>
                {users.map(user => (
                  <div key={user.id} className="user-row" onClick={() => handleUserClick(user)}>
                    <div className="user-info">
                      <div className="user-avatar">
                        {getUserAvatar(user)}
                      </div>
                      <div>
                        <strong>{getUserDisplayName(user)}</strong>
                        <span className="user-email">{user.username}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'super_admin' ? 'Super Admin' : 'User'}
                      </span>
                    </div>
                    <div>
                      <span className="coin-balance">{user.user_coins?.balance || 0}</span>
                    </div>
                    <div>
                      {getActiveSubscription(user) ? (
                        <span className="sub-badge active">Aktiv</span>
                      ) : (
                        <span className="sub-badge inactive">Yo'q</span>
                      )}
                    </div>
                    <div className="user-date">{formatDate(user.created_at)}</div>
                    <div className="user-actions" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenCoinModal(user)} title="Coin boshqarish">
                        <Award size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenSubModal(user, getActiveSubscription(user) ? 'cancel' : 'activate')}
                        title={getActiveSubscription(user) ? 'Obunani bekor qilish' : 'Obuna yoqish'}
                      >
                        <Crown size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleUserClick(user)} title="Batafsil">
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} /> Oldingi
              </Button>
              <span>{page} / {totalPages}</span>
              <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Keyingi <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Right: User Detail */}
        <div className="user-detail-section">
          <Card className="user-detail-card">
            {!selectedUser ? (
              <div className="detail-empty">
                <Users size={48} />
                <p>Foydalanuvchini tanlang</p>
                <span>Batafsil ma'lumot uchun ro'yxatdan birini tanlang</span>
              </div>
            ) : userDetailLoading ? (
              <div className="loading-state">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <>
                <div className="detail-header">
                  <div className="detail-avatar">
                    {getUserAvatar(selectedUser)}
                  </div>
                  <div>
                    <h3>{getUserDisplayName(selectedUser)}</h3>
                    <p>@{selectedUser.username}</p>
                    <span className={`role-badge role-${selectedUser.role}`}>
                      {selectedUser.role}
                    </span>
                    {selectedUser.is_vip && (
                      <span className="vip-badge">
                        <Star size={12} /> VIP
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-stats">
                  <div className="detail-stat">
                    <Award size={18} className="stat-icon" />
                    <div>
                      <span className="stat-label">Coin balansi</span>
                      <strong>{selectedUser.user_coins?.balance || 0}</strong>
                    </div>
                  </div>
                  <div className="detail-stat">
                    <Target size={18} className="stat-icon" />
                    <div>
                      <span className="stat-label">Target Score</span>
                      <strong>{selectedUser.target_score || '—'}</strong>
                    </div>
                  </div>
                  <div className="detail-stat">
                    <Calendar size={18} className="stat-icon" />
                    <div>
                      <span className="stat-label">Target sana</span>
                      <strong>{formatDate(selectedUser.target_date)}</strong>
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="detail-section">
                    <h4>Bio</h4>
                    <p className="user-bio">{selectedUser.bio}</p>
                  </div>
                )}

                {selectedUser.vip_expires_at && (
                  <div className="detail-section">
                    <h4>VIP ma'lumotlari</h4>
                    <p>VIP tugash sanasi: {formatDate(selectedUser.vip_expires_at)}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Amallar</h4>
                  <div className="detail-actions">
                    <Button onClick={() => handleOpenCoinModal(selectedUser)}>
                      <Plus size={16} /> Coin qo'shish
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenCoinModal(selectedUser)}>
                      <Minus size={16} /> Coin ayirish
                    </Button>
                    <Button 
                      variant={getActiveSubscription(selectedUser) ? 'destructive' : 'default'}
                      onClick={() => handleOpenSubModal(selectedUser, getActiveSubscription(selectedUser) ? 'cancel' : 'activate')}
                    >
                      <Crown size={16} /> 
                      {getActiveSubscription(selectedUser) ? 'Obunani bekor qilish' : 'Obuna yoqish'}
                    </Button>
                  </div>
                </div>

                {selectedUser.user_subscriptions && selectedUser.user_subscriptions.length > 0 && (
                  <div className="detail-section">
                    <h4>Obuna tarixi</h4>
                    {selectedUser.user_subscriptions.map(sub => (
                      <div key={sub.id} className="subscription-item">
                        <span className={`sub-status status-${sub.status}`}>{sub.status}</span>
                        <span className="plan-name">{sub.plan_type}</span>
                        <span className="sub-date">{formatDate(sub.started_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Coin Modal */}
      {coinModal.open && (
        <div className="modal-overlay" onClick={() => setCoinModal({ open: false, userId: '', userName: '' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Coin boshqarish</h3>
            <p>Foydalanuvchi: <strong>{coinModal.userName}</strong></p>
            
            <div className="form-field">
              <label>Miqdor (+ qo'shish, - ayirish)</label>
              <Input
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(parseInt(e.target.value) || 0)}
                placeholder="Masalan: 100 yoki -50"
              />
            </div>
            
            <div className="form-field">
              <label>Izoh (ixtiyoriy)</label>
              <textarea
                className="modal-textarea"
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}
                placeholder="Nima sababdan..."
                rows={2}
              />
            </div>

            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setCoinModal({ open: false, userId: '', userName: '' })}>
                Bekor qilish
              </Button>
              <Button onClick={handleCoinSubmit} disabled={coinProcessing}>
                {coinProcessing ? <Loader2 className="animate-spin" size={16} /> : null}
                {coinAmount > 0 ? 'Qo\'shish' : 'Ayirish'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {subModal.open && (
        <div className="modal-overlay" onClick={() => setSubModal({ open: false, userId: '', userName: '' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{subAction === 'activate' ? 'Obuna faollashtirish' : 'Obunani bekor qilish'}</h3>
            <p>Foydalanuvchi: <strong>{subModal.userName}</strong></p>
            
            {subAction === 'activate' && (
              <div className="form-field">
                <label>Plan turi</label>
                <select 
                  className="modal-select"
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
            )}

            {subAction === 'cancel' && (
              <p className="warning-text">Bu amalni qaytarib bo'lmaydi. Obuna bekor qilinadi.</p>
            )}

            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setSubModal({ open: false, userId: '', userName: '' })}>
                Bekor qilish
              </Button>
              <Button 
                variant={subAction === 'cancel' ? 'destructive' : 'default'}
                onClick={handleSubSubmit}
                disabled={subProcessing}
              >
                {subProcessing ? <Loader2 className="animate-spin" size={16} /> : null}
                {subAction === 'activate' ? 'Faollashtirish' : 'Bekor qilish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}