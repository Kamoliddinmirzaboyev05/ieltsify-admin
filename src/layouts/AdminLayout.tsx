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
    <Layout style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          background: '#0f172a',
        }}
      >
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, background: '#8B5CF6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}>I</div>
          {!collapsed && <Text strong style={{ fontSize: '20px', color: '#f8fafc', letterSpacing: '0.025em' }}>IELTSIFY</Text>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', background: 'transparent', padding: '0 12px' }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s', background: '#0f172a' }}>
        <Header
          style={{
            padding: '0 32px',
            background: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '100%',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Breadcrumb items={breadcrumbItems} />
          <Space size={24}>
            <BellOutlined style={{ fontSize: 18, color: '#94a3b8', cursor: 'pointer' }} />
            <Dropdown menu={userMenuItems} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#8B5CF6', boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>A</Avatar>
                {!collapsed && <Text strong style={{ color: '#e2e8f0' }}>Admin User</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ padding: '32px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
