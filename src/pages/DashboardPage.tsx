import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminDashboardApi } from '@/lib/admin-api';
import { getErrorMessage } from '@/types';
import type { AdminDashboardOverview } from '@/types';
import {
  Users, Crown, DollarSign, Clock, Activity,
  TrendingUp, ArrowUpRight, LayoutGrid, AlertCircle, RefreshCw,
  BookOpen, Headphones, PenTool, FileText, BookMarked
} from 'lucide-react';
import { toast } from 'sonner';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminDashboardApi.getStats();
      if (response.success && response.data) {
        setOverview(response.data.overview);
      } else {
        setError(response.error || 'Dashboard ma\'lumotlarini yuklashda xatolik');
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Dashboard ma\'lumotlarini yuklashda xatolik');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const mainStats = [
    {
      title: 'FOYDALANUVCHILAR',
      value: overview?.total_users?.toLocaleString() || '0',
      change: overview?.today_active_users ? `${overview.today_active_users} bugun` : '0',
      trend: 'up' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'AKTIV OBUNALAR',
      value: overview?.active_subscriptions?.toLocaleString() || '0',
      icon: Crown,
      color: 'yellow'
    },
    {
      title: 'TARQATILGAN COINLAR',
      value: overview?.total_coins_distributed?.toLocaleString() || '0',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'KUTILAYOTGAN TO\'LOVLAR',
      value: overview?.pending_payments?.toString() || '0',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'BUGUNGI FAOLLAR',
      value: overview?.today_active_users?.toLocaleString() || '0',
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'COINLAR (muomalada)',
      value: overview?.total_coins_in_circulation?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

  const resourceStats = [
    { key: 'reading', title: 'READING TESTLAR', icon: BookOpen, color: 'purple' },
    { key: 'listening', title: 'LISTENING TESTLAR', icon: Headphones, color: 'indigo' },
    { key: 'writing', title: 'WRITING TASKLAR', icon: PenTool, color: 'orange' },
    { key: 'articles', title: 'MAQOLALAR', icon: FileText, color: 'pink' },
    { key: 'vocabulary', title: 'VOCABULARY', icon: BookMarked, color: 'green' },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>IELTSIFY platformasi statistikasi yuklanmoqda...</p>
        </div>
        <div className="stats-grid main-stats">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="stat-card loading">
              <CardHeader className="stat-card-header">
                <div className="skeleton">Yuklanmoqda...</div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="dashboard">
        <div className="page-error-state">
          <AlertCircle size={40} />
          <h2>Ma'lumotlarni yuklab bo'lmadi</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchDashboardStats}>
            <RefreshCw size={16} /> Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>IELTSIFY platformasi holati va statistikasi</p>
        </div>
        <div className="date-badge">
          <span>{new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="section-container">
        <div className="section-title">
          <TrendingUp size={20} />
          <h2>Asosiy Ko'rsatkichlar</h2>
        </div>
        <div className="stats-grid main-stats">
          {mainStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`stat-card border-${stat.color}`}>
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-main-value">{stat.value}</div>
                    {stat.change && (
                      <div className="stat-change up">
                        <ArrowUpRight size={16} />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className={`stat-icon-wrapper bg-${stat.color}`}>
                    <Icon className={`stat-icon text-${stat.color}`} />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="section-container">
        <div className="section-title">
          <LayoutGrid size={20} />
          <h2>O'quv Resurslari</h2>
        </div>
        <div className="stats-grid resources-stats">
          {resourceStats.map((meta) => {
            const Icon = meta.icon;
            return (
              <Card key={meta.key} className={`stat-card border-${meta.color}`}>
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">{meta.title}</div>
                    <div className="stat-main-value">--</div>
                  </div>
                  <div className={`stat-icon-wrapper bg-${meta.color}`}>
                    <Icon className={`stat-icon text-${meta.color}`} />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="content-grid">
        <Card className="revenue-card">
          <CardHeader>
            <CardTitle>Platforma Holati</CardTitle>
            <p className="card-subtitle">Umumiy statistika</p>
          </CardHeader>
          <CardContent>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon bg-blue">
                  <Users size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Jami foydalanuvchilar</p>
                  <span className="activity-time">{overview?.total_users || 0} ta</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-yellow">
                  <Crown size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Aktiv obunalar</p>
                  <span className="activity-time">{overview?.active_subscriptions || 0} ta</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-green">
                  <DollarSign size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Kutilayotgan to'lovlar</p>
                  <span className="activity-time">{overview?.pending_payments || 0} ta</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-purple">
                  <Activity size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Bugungi faollar</p>
                  <span className="activity-time">{overview?.today_active_users || 0} ta</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="revenue-card">
          <CardHeader>
            <CardTitle>Tezkor Amallar</CardTitle>
            <p className="card-subtitle">Eng ko'p ishlatiladigan</p>
          </CardHeader>
          <CardContent>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => navigate('/payments')}>
                <Clock size={20} />
                <span>To'lovlarni tekshirish</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/users')}>
                <Users size={20} />
                <span>Foydalanuvchilar</span>
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/system-logs')}>
                <Activity size={20} />
                <span>Tizim loglari</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}