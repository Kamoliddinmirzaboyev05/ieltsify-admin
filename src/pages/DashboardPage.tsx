import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Divider, List, Avatar, Tag, Button } from 'antd';
import {
  CustomerServiceOutlined,
  ReadOutlined,
  FormOutlined,
  AudioOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { mockListening, mockReading, mockWriting, mockSpeaking, mockUsers } from '../mock/data';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Listening', value: mockListening.length, icon: <CustomerServiceOutlined />, color: '#8B5CF6', trend: '+12%' },
    { title: 'Reading', value: mockReading.length, icon: <ReadOutlined />, color: '#10b981', trend: '+5%' },
    { title: 'Writing', value: mockWriting.length, icon: <FormOutlined />, color: '#f59e0b', trend: '+8%' },
    { title: 'Speaking', value: mockSpeaking.length, icon: <AudioOutlined />, color: '#ef4444', trend: '+20%' },
    { title: 'Users', value: mockUsers.length, icon: <UserOutlined />, color: '#3b82f6', trend: '+15%' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'completed Listening Test #1', time: '2 mins ago', type: 'listening' },
    { user: 'Jane Smith', action: 'submitted Writing Task #2', time: '15 mins ago', type: 'writing' },
    { user: 'Alex Johnson', action: 'registered as a new student', time: '1 hour ago', type: 'user' },
    { user: 'Maria Garcia', action: 'booked a Speaking session', time: '3 hours ago', type: 'speaking' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <Title level={2} style={{ margin: 0, color: '#f8fafc', fontWeight: '800', letterSpacing: '-0.025em' }}>Dashboard Overview</Title>
        <Text style={{ color: '#94a3b8', fontSize: '16px' }}>Welcome back! Here's what's happening today.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={4.8} key={stat.title}>
            <Card bordered={false} hoverable style={{ background: '#1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: 44, height: 44, background: `${stat.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, border: `1px solid ${stat.color}30` }}>
                  {React.cloneElement(stat.icon as any, { style: { fontSize: 22 } })}
                </div>
                <Tag color="#064e3b" style={{ border: 'none', borderRadius: '6px', color: '#10b981', display: 'flex', alignItems: 'center', height: '24px' }}>
                  <ArrowUpOutlined style={{ marginRight: '4px' }} /> {stat.trend}
                </Tag>
              </div>
              <Statistic
                title={<Text style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</Text>}
                value={stat.value}
                valueStyle={{ color: '#f1f5f9', fontWeight: '800', fontSize: '28px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col span={16}>
          <Card title={<Text strong style={{ fontSize: '16px', color: '#f8fafc' }}>Recent Activity</Text>} extra={<Button type="link" icon={<ArrowRightOutlined />} style={{ color: '#8B5CF6' }}>View All</Button>} styles={{ body: { padding: '8px 24px' } }}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#334155', color: '#94a3b8' }}>{item.user[0]}</Avatar>}
                    title={<Text strong style={{ color: '#e2e8f0' }}>{item.user}</Text>}
                    description={<Text style={{ color: '#94a3b8' }}>{item.action}</Text>}
                  />
                  <Text style={{ color: '#64748b', fontSize: '12px' }}>{item.time}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<Text strong style={{ fontSize: '16px', color: '#f8fafc' }}>Quick Actions</Text>}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button block type="primary" style={{ height: '48px', borderRadius: '10px', fontWeight: '600', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#a78bfa', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Create New Test <PlusOutlined />
              </Button>
              <Button block style={{ height: '48px', borderRadius: '10px', fontWeight: '600', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#cbd5e1', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Verify Users <UserOutlined />
              </Button>
            </Space>
            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Text strong style={{ color: 'white', display: 'block', marginBottom: '8px', fontSize: '16px' }}>Pro Tip!</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', lineHeight: '1.6' }}>
                  Efficiently manage your students by using the new "Advanced Filtering" in the users panel.
                </Text>
              </div>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '80px', color: 'rgba(255, 255, 255, 0.1)', transform: 'rotate(-15deg)' }}>
                🚀
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
