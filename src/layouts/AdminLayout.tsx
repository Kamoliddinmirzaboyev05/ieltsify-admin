import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  FileStack,
  User,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import './AdminLayout.css';

const menuItems = [
  { key: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { key: '/reading', icon: BookOpen, label: 'Reading' },
  { key: '/listening', icon: Headphones, label: 'Listening' },
  { key: '/resources', icon: FileStack, label: 'Resource Manager' },
  { key: '/profile', icon: User, label: 'Profile' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${!mobileOpen ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-content">
            <div className="sidebar-logo-icon">I</div>
            {!collapsed && <span className="sidebar-logo-text">IELTSIFY</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    navigate(item.key);
                    setMobileOpen(false);
                  }}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="sidebar-nav-icon" />
                  {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        {/* Header */}
        <header className="header">
          <Button
            variant="ghost"
            size="icon"
            className="show-on-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hide-on-mobile"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu />
          </Button>

          <div className="header-actions">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>

            <Button variant="ghost" size="icon">
              <Bell />
            </Button>

            <div className="header-user">
              <div className="header-user-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="header-user-name">
                {user?.name || 'Admin'}
              </span>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}
