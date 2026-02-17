import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Crown, 
  DollarSign, 
  BookOpen, 
  Headphones, 
  FileText,
  PenTool,
  Mic,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
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

const resourceStats = [
  {
    title: 'READING TESTLAR SONI',
    value: '145',
    change: '+3',
    trend: 'up',
    icon: BookOpen,
    color: 'purple'
  },
  {
    title: 'LISTENING TESTLAR SONI',
    value: '128',
    change: '+2',
    trend: 'up',
    icon: Headphones,
    color: 'indigo'
  },
  {
    title: 'WRITING TESTLAR SONI',
    value: '86',
    change: '+5',
    trend: 'up',
    icon: PenTool,
    color: 'orange'
  },
  {
    title: 'SPEAKING TESTLAR SONI',
    value: '54',
    change: '+4',
    trend: 'up',
    icon: Mic,
    color: 'cyan'
  },
  {
    title: 'MAQOLALAR SONI',
    value: '64',
    change: '+4',
    trend: 'up',
    icon: FileText,
    color: 'pink'
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
          {resourceStats.map((stat) => {
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
