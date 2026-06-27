import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminLogsApi, adminReferralsApi } from '@/lib/admin-api';
import type { AdminLog, CoinTransaction, ReferralStats } from '@/types';
import { 
  Activity, DollarSign, Users, Loader2, 
  RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import './SystemLogsPage.css';

type LogTab = 'admin-logs' | 'coin-transactions' | 'referrals';

export default function SystemLogsPage() {
  const [activeTab, setActiveTab] = useState<LogTab>('admin-logs');
  
  // Admin Logs
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);

  // Coin Transactions
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);

  // Referrals
  const [referrals, setReferrals] = useState<ReferralStats[]>([]);
  const [refLoading, setRefLoading] = useState(false);

  const fetchAdminLogs = useCallback(async () => {
    try {
      setLogsLoading(true);
      const response = await adminLogsApi.getAdminLogs({ page: logsPage, limit: 30 });
      if (response.success) {
        setAdminLogs(response.data || []);
        if (response.pagination) setLogsTotalPages(response.pagination.total_pages);
      }
    } catch {
      toast.error('Loglarni yuklashda xatolik');
    } finally {
      setLogsLoading(false);
    }
  }, [logsPage]);

  const fetchCoinTransactions = useCallback(async () => {
    try {
      setTxLoading(true);
      const response = await adminLogsApi.getCoinTransactions({ page: txPage, limit: 30 });
      if (response.success) {
        setTransactions(response.data || []);
        if (response.pagination) setTxTotalPages(response.pagination.total_pages);
      }
    } catch {
      toast.error('Transaksiyalarni yuklashda xatolik');
    } finally {
      setTxLoading(false);
    }
  }, [txPage]);

  const fetchTopReferrers = useCallback(async () => {
    try {
      setRefLoading(true);
      const response = await adminReferralsApi.getTopReferrers();
      if (response.success) {
        setReferrals(response.data || []);
      }
    } catch {
      toast.error('Referallarni yuklashda xatolik');
    } finally {
      setRefLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'admin-logs') fetchAdminLogs();
    else if (activeTab === 'coin-transactions') fetchCoinTransactions();
    else if (activeTab === 'referrals') fetchTopReferrers();
  }, [activeTab, fetchAdminLogs, fetchCoinTransactions, fetchTopReferrers]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'view_dashboard': 'Dashboard ko\'rildi',
      'list_users': 'Foydalanuvchilar ro\'yxati',
      'adjust_coins': 'Coin boshqaruvi',
      'toggle_subscription': 'Obuna boshqaruvi',
      'approve_payment': 'To\'lov tasdiqlandi',
      'reject_payment': 'To\'lov rad etildi',
    };
    return labels[action] || action;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'amount-positive';
    if (amount < 0) return 'amount-negative';
    return '';
  };

  const tabs = [
    { key: 'admin-logs' as LogTab, label: 'Admin Loglari', icon: Activity },
    { key: 'coin-transactions' as LogTab, label: 'Coin Transaksiyalari', icon: DollarSign },
    { key: 'referrals' as LogTab, label: 'Top Referrallar', icon: Users },
  ];

  return (
    <div className="system-logs-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <Activity className="page-title-icon" />
          <div>
            <h1 className="page-title">Tizim Loglari</h1>
            <p className="page-subtitle">Barcha admin harakatlari va transaksiyalar</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="logs-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`logs-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
        <Button variant="ghost" size="icon" className="refresh-btn" onClick={() => {
          if (activeTab === 'admin-logs') fetchAdminLogs();
          else if (activeTab === 'coin-transactions') fetchCoinTransactions();
          else fetchTopReferrers();
        }}>
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* Admin Logs */}
      {activeTab === 'admin-logs' && (
        <Card>
          {logsLoading ? (
            <div className="loading-state"><Loader2 className="animate-spin" size={32} /><p>Yuklanmoqda...</p></div>
          ) : adminLogs.length === 0 ? (
            <div className="empty-state"><Activity size={48} /><p>Loglar topilmadi</p></div>
          ) : (
            <div className="logs-list">
              {adminLogs.map(log => (
                <div key={log.id} className="log-item">
                  <div className="log-icon">
                    <Activity size={16} />
                  </div>
                  <div className="log-content">
                    <div className="log-header">
                      <strong>{log.profiles?.full_name || 'Admin'}</strong>
                      <span className="log-action">{getActionLabel(log.action)}</span>
                    </div>
                    <div className="log-meta">
                      <span>Target: {log.target_type} / {log.target_id?.substring(0, 8)}...</span>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <span className="log-metadata">{JSON.stringify(log.metadata).substring(0, 60)}</span>
                      )}
                    </div>
                  </div>
                  <div className="log-time">{formatDate(log.created_at)}</div>
                </div>
              ))}
            </div>
          )}
          {logsTotalPages > 1 && (
            <div className="logs-pagination">
              <Button variant="ghost" onClick={() => setLogsPage(p => Math.max(1, p - 1))} disabled={logsPage === 1}>
                <ChevronLeft size={16} />
              </Button>
              <span>{logsPage} / {logsTotalPages}</span>
              <Button variant="ghost" onClick={() => setLogsPage(p => Math.min(logsTotalPages, p + 1))} disabled={logsPage === logsTotalPages}>
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Coin Transactions */}
      {activeTab === 'coin-transactions' && (
        <Card>
          {txLoading ? (
            <div className="loading-state"><Loader2 className="animate-spin" size={32} /><p>Yuklanmoqda...</p></div>
          ) : transactions.length === 0 ? (
            <div className="empty-state"><DollarSign size={48} /><p>Transaksiyalar topilmadi</p></div>
          ) : (
            <div className="logs-list">
              <div className="tx-header">
                <span>Foydalanuvchi</span>
                <span>Miqdor</span>
                <span>Turi</span>
                <span>Izoh</span>
                <span>Sana</span>
              </div>
              {transactions.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-user">
                    <strong>{tx.profiles?.full_name || 'Noma\'lum'}</strong>
                    <span className="tx-email">{tx.profiles?.email}</span>
                  </div>
                  <div className={`tx-amount ${getAmountColor(tx.amount)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </div>
                  <div>
                    <span className="tx-type-badge">{tx.transaction_type}</span>
                  </div>
                  <div className="tx-desc">{tx.description || '—'}</div>
                  <div className="tx-date">{formatDate(tx.created_at)}</div>
                </div>
              ))}
            </div>
          )}
          {txTotalPages > 1 && (
            <div className="logs-pagination">
              <Button variant="ghost" onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}>
                <ChevronLeft size={16} />
              </Button>
              <span>{txPage} / {txTotalPages}</span>
              <Button variant="ghost" onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages}>
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Referrals */}
      {activeTab === 'referrals' && (
        <Card>
          {refLoading ? (
            <div className="loading-state"><Loader2 className="animate-spin" size={32} /><p>Yuklanmoqda...</p></div>
          ) : referrals.length === 0 ? (
            <div className="empty-state"><Users size={48} /><p>Referallar topilmadi</p></div>
          ) : (
            <div className="referrals-list">
              <div className="referral-header">
                <span>#</span>
                <span>Foydalanuvchi</span>
                <span>Referallar soni</span>
                <span>Progress</span>
              </div>
              {referrals.map((ref, idx) => (
                <div key={ref.referrer_id} className="referral-item">
                  <div className="referral-rank">{idx + 1}</div>
                  <div className="ref-user">
                    <div className="ref-avatar">{ref.users?.full_name?.charAt(0) || 'U'}</div>
                    <div>
                      <strong>{ref.users?.full_name || 'Noma\'lum'}</strong>
                      <span className="ref-email">{ref.users?.email}</span>
                    </div>
                  </div>
                  <div className="ref-count">{ref.count} ta</div>
                  <div className="ref-progress">
                    <div className="progress-bar" style={{ width: `${Math.min(100, (ref.count / (referrals[0]?.count || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}