import React, { useState } from 'react';
import { Layout, Menu, theme, Typography, Breadcrumb, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  CustomerServiceOutlined,
  ReadOutlined,
  FormOutlined,
  AudioOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: {},
  } = theme.useToken();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/listening', icon: <CustomerServiceOutlined />, label: 'Listening' },
    { key: '/reading', icon: <ReadOutlined />, label: 'Reading' },
    { key: '/writing', icon: <FormOutlined />, label: 'Writing' },
    { key: '/speaking', icon: <AudioOutlined />, label: 'Speaking' },
    { key: '/users', icon: <UserOutlined />, label: 'Users' },
  ];

  const userMenuItems = {
    items: [
      { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
      { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
    ],
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    { title: <Link to="/">Admin</Link>, key: 'admin' },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        key: url,
        title: <Link to={url}>{snippet.charAt(0).toUpperCase() + snippet.slice(1)}</Link>,
      };
    }),
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0F172A' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          background: '#0F172A',
        }}
      >
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>I</div>
          {!collapsed && <Text strong style={{ fontSize: '16px', color: '#F8FAFC', letterSpacing: '0.05em', fontWeight: 700 }}>IELTSIFY</Text>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', background: 'transparent' }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s', background: '#0F172A' }}>
        <Header
          style={{
            padding: '0 32px',
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Breadcrumb items={breadcrumbItems} />
          <Space size={24}>
            <BellOutlined style={{ fontSize: 18, color: '#64748B', cursor: 'pointer' }} />
            <Dropdown menu={userMenuItems} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" style={{ backgroundColor: '#7C3AED' }}>A</Avatar>
                {!collapsed && <Text style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: 500 }}>Admin</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ padding: '40px', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
