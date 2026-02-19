import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Crown, 
  DollarSign, 
  BookOpen, 
  Headphones, 
  FileText,
  PenTool,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  LayoutGrid,
  FileStack,
  BookMarked
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { QuickStatsResponse, DashboardStatisticsResponse } from '@/types';
import './DashboardPage.css';

const mainStats = [
  {
    title: 'FOYDALANUVCHILAR SONI',
    value: '12,345',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'PREMIUM FOYDALANUVCHILAR',
    value: '845',
    change: '+5.2%',
    trend: 'up',
    icon: Crown,
    color: 'yellow'
  },
  {
    title: 'OYLIK DAROMAD',
    value: '$12,450',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
    color: 'green'
  }
];

const revenueData = [
  { month: 'Yan', value: 4500 },
  { month: 'Fev', value: 5200 },
  { month: 'Mar', value: 4800 },
  { month: 'Apr', value: 6100 },
  { month: 'May', value: 5900 },
  { month: 'Iyun', value: 7200 },
  { month: 'Iyul', value: 8400 },
];

export default function DashboardPage() {
  const [quickStats, setQuickStats] = useState<QuickStatsResponse['data'] | null>(null);
  const [statistics, setStatistics] = useState<DashboardStatisticsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [quickRes, statsRes] = await Promise.all([
          apiClient.get<QuickStatsResponse>('/dashboard/quick-stats/'),
          apiClient.get<DashboardStatisticsResponse>('/dashboard/statistics/'),
        ]);

        if (quickRes && quickRes.success && quickRes.data) {
          setQuickStats(quickRes.data);
        } else {
          setQuickStats(null);
        }

        if (statsRes && statsRes.success && statsRes.data) {
          setStatistics(statsRes.data);
        } else {
          setStatistics(null);
        }
      } catch {
        setQuickStats(null);
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const resourceMeta = [
    { key: 'reading', title: 'READING TESTLAR SONI', icon: BookOpen, color: 'purple' },
    { key: 'listening', title: 'LISTENING TESTLAR SONI', icon: Headphones, color: 'indigo' },
    { key: 'writing', title: 'WRITING TESTLAR SONI', icon: PenTool, color: 'orange' },
    { key: 'articles', title: 'MAQOLALAR SONI', icon: FileText, color: 'pink' },
    { key: 'materials', title: 'MATERIALLAR SONI', icon: FileStack, color: 'blue' },
    { key: 'vocabulary', title: 'VOCABULARY SONI', icon: BookMarked, color: 'green' },
  ] as const;

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
                    <div className={`stat-change ${stat.trend}`}>
                      {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stat.change}
                      <span className="stat-period">o'tgan oyga nisbatan</span>
                    </div>
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
          {loading && (
            <Card className="stat-card border-blue">
              <CardHeader className="stat-card-header">
                <div>
                  <div className="stat-title">Ma'lumotlar yuklanmoqda</div>
                  <div className="stat-main-value">...</div>
                </div>
              </CardHeader>
            </Card>
          )}
          {!loading && quickStats && resourceMeta.map((meta) => {
            const Icon = meta.icon;
            const total = quickStats.total_items[meta.key as keyof typeof quickStats.total_items] ?? 0;
            const active = quickStats.active_items[meta.key as keyof typeof quickStats.active_items] ?? 0;
            const today = quickStats.recent_count.today[meta.key as keyof typeof quickStats.recent_count.today] ?? 0;
            return (
              <Card key={meta.key} className={`stat-card border-${meta.color}`}>
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">{meta.title}</div>
                    <div className="stat-main-value">{total}</div>
                    <div className={`stat-change up`}>
                      <ArrowUpRight size={16} />
                      Active: {active}
                      <span className="stat-period"> • Bugun: {today}</span>
                    </div>
                  </div>
                  <div className={`stat-icon-wrapper bg-${meta.color}`}>
                    <Icon className={`stat-icon text-${meta.color}`} />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
          {!loading && !quickStats && (
            <Card className="stat-card border-orange">
              <CardHeader className="stat-card-header">
                <div>
                  <div className="stat-title">Ma'lumotlar topilmadi</div>
                  <div className="stat-main-value">0</div>
                  <div className={`stat-change up`}>
                    <ArrowUpRight size={16} />
                    Active: 0
                    <span className="stat-period"> • Bugun: 0</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      <div className="section-container">
        <div className="section-title">
          <LayoutGrid size={20} />
          <h2>Qiyinchilik va So‘nggi Qo‘shilganlar</h2>
        </div>
        <div className="stats-grid resources-stats">
          {statistics && (
            <>
              <Card className="stat-card border-green">
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">Oxirgi 7 kunda qo'shilganlar</div>
                    <div className="stat-main-value">
                      {statistics.recent_additions.last_7_days.listening_tests +
                        statistics.recent_additions.last_7_days.reading_passages +
                        statistics.recent_additions.last_7_days.writing_tasks +
                        statistics.recent_additions.last_7_days.smart_articles +
                        statistics.recent_additions.last_7_days.listening_materials +
                        statistics.recent_additions.last_7_days.vocabulary_words}
                    </div>
                    <div className="stat-change up">
                      <ArrowUpRight size={16} />
                      Listening: {statistics.recent_additions.last_7_days.listening_tests} • Reading: {statistics.recent_additions.last_7_days.reading_passages}
                      <span className="stat-period">
                        {' '}• Writing: {statistics.recent_additions.last_7_days.writing_tasks} • Articles: {statistics.recent_additions.last_7_days.smart_articles}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="stat-card border-purple">
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">Qiyinchilik bo‘yicha taqsimot (Listening)</div>
                    <div className="stat-main-value">
                      {statistics.difficulty_distribution.listening_tests.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="stat-change up">
                      <ArrowUpRight size={16} />
                      {statistics.difficulty_distribution.listening_tests.map((item) => (
                        <span key={item.difficulty} className="stat-period">
                          {item.difficulty}: {item.count}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="stat-card border-indigo">
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">Qiyinchilik bo‘yicha taqsimot (Reading)</div>
                    <div className="stat-main-value">
                      {statistics.difficulty_distribution.reading_passages.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="stat-change up">
                      <ArrowUpRight size={16} />
                      {statistics.difficulty_distribution.reading_passages.map((item) => (
                        <span key={item.difficulty} className="stat-period">
                          {item.difficulty}: {item.count}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="stat-card border-blue">
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">Maqolalar bo‘yicha darajalar</div>
                    <div className="stat-main-value">
                      {statistics.articles_by_level.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="stat-change up">
                      <ArrowUpRight size={16} />
                      {statistics.articles_by_level.map((item) => (
                        <span key={item.level} className="stat-period">
                          {item.level}: {item.count}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="stat-card border-orange">
                <CardHeader className="stat-card-header">
                  <div>
                    <div className="stat-title">Tizim holati</div>
                    <div className="stat-main-value">{statistics.system_info.total_modules}</div>
                    <div className="stat-change up">
                      <ArrowUpRight size={16} />
                      Modullar soni
                      <span className="stat-period">
                        {' '}• Yangilangan vaqti: {new Date(statistics.system_info.last_updated).toLocaleString('uz-UZ')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
      </div>

      <div className="content-grid">
        <Card className="revenue-card">
          <CardHeader>
            <CardTitle>Oylik Daromad Statistikasi</CardTitle>
            <p className="card-subtitle">So'nggi 7 oy</p>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              {revenueData.map((item, index) => (
                <div key={index} className="chart-column">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${(item.value / 10000) * 100}%` }}
                    >
                      <div className="chart-tooltip">${item.value}</div>
                    </div>
                  </div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="activity-card">
          <CardHeader>
            <CardTitle>So'nggi Faolliklar</CardTitle>
            <p className="card-subtitle">Bugun</p>
          </CardHeader>
          <CardContent>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon bg-blue">
                  <Users size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Yangi foydalanuvchi ro'yxatdan o'tdi</p>
                  <span className="activity-time">5 daqiqa oldin</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-yellow">
                  <Crown size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Premium obuna sotib olindi</p>
                  <span className="activity-time">12 daqiqa oldin</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-purple">
                  <BookOpen size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Reading Test #45 yakunlandi</p>
                  <span className="activity-time">24 daqiqa oldin</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-orange">
                  <PenTool size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Yangi Writing Test qo'shildi</p>
                  <span className="activity-time">45 daqiqa oldin</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-green">
                  <DollarSign size={16} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">To'lov qabul qilindi ($15)</p>
                  <span className="activity-time">1 soat oldin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
