import React from 'react';
import { Row, Col, Card, Typography, Space, List, Avatar, Tag, Button } from 'antd';
import {
  CustomerServiceOutlined,
  ReadOutlined,
  FormOutlined,
  AudioOutlined,
  UserOutlined,
  ArrowUpOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { mockListening, mockReading, mockWriting, mockSpeaking, mockUsers } from '../mock/data';

const { Title, Text } = Typography;

const Sparkline: React.FC<{ color: string }> = ({ color }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ marginTop: '12px' }}>
    <path
      d="M0 35 Q 25 35, 50 20 T 100 5"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ opacity: 0.6 }}
    />
    <path
      d="M0 35 Q 25 35, 50 20 T 100 5 V 40 H 0 Z"
      fill={`url(#gradient-${color})`}
      style={{ opacity: 0.1 }}
    />
    <defs>
      <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Listening', value: mockListening.length, icon: <CustomerServiceOutlined />, color: '#7C3AED' },
    { title: 'Reading', value: mockReading.length, icon: <ReadOutlined />, color: '#10B981' },
    { title: 'Writing', value: mockWriting.length, icon: <FormOutlined />, color: '#F59E0B' },
    { title: 'Speaking', value: mockSpeaking.length, icon: <AudioOutlined />, color: '#EF4444' },
    { title: 'Users', value: mockUsers.length, icon: <UserOutlined />, color: '#3B82F6' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'completed Listening Test #1', time: '2m ago' },
    { user: 'Jane Smith', action: 'submitted Writing Task #2', time: '15m ago' },
    { user: 'Alex Johnson', action: 'registered as student', time: '1h ago' },
    { user: 'Maria Garcia', action: 'booked Speaking session', time: '3h ago' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <Title level={4} className="stats-label" style={{ marginBottom: '8px' }}>Platform Analytics</Title>
        <Title level={1} style={{ margin: 0, color: '#FFFFFF', fontWeight: 700, letterSpacing: '-0.03em' }}>Dashboard Overview</Title>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={4.8} key={stat.title}>
            <Card bordered={false} styles={{ body: { padding: '24px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Text className="stats-label">{stat.title}</Text>
                <div style={{ color: stat.color, background: `${stat.color}15`, padding: '6px', borderRadius: '8px', display: 'flex' }}>
                   {React.cloneElement(stat.icon as any, { style: { fontSize: 16 } })}
                </div>
              </div>
              <div className="stats-value">{stat.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Tag color="#064E3B" style={{ border: 'none', borderRadius: '4px', color: '#10B981', fontSize: '10px', height: '18px', display: 'inline-flex', alignItems: 'center', fontWeight: 700, padding: '0 4px' }}>
                  <ArrowUpOutlined style={{ marginRight: '2px' }} /> 12%
                </Tag>
                <Text style={{ color: '#475569', fontSize: '11px', fontWeight: 500 }}>vs last month</Text>
              </div>
              <Sparkline color={stat.color} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col span={16}>
          <Card 
            title={<Text className="stats-label">Live Activity Feed</Text>} 
            extra={<Button type="text" size="small" style={{ color: '#7C3AED', fontSize: '12px', fontWeight: 600 }}>REFRESH</Button>}
            styles={{ body: { padding: '0 24px' } }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', padding: '20px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar size={40} style={{ backgroundColor: '#334155', color: '#94A3B8', fontWeight: 600 }}>{item.user[0]}</Avatar>}
                    title={<Text style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '14px' }}>{item.user}</Text>}
                    description={<Text style={{ color: '#64748B', fontSize: '13px' }}>{item.action}</Text>}
                  />
                  <Text style={{ color: '#475569', fontSize: '12px', fontWeight: 500 }}>{item.time}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<Text className="stats-label">Quick Management</Text>}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button block style={{ height: '52px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', color: '#CBD5E1', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>CREATE NEW TEST</span> 
                <PlusOutlined style={{ fontSize: 14, color: '#7C3AED' }} />
              </Button>
              <Button block style={{ height: '52px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', color: '#CBD5E1', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>AUDIT USER LOGS</span>
                <UserOutlined style={{ fontSize: 14, color: '#7C3AED' }} />
              </Button>
            </Space>
            
            <div style={{ marginTop: '32px', padding: '24px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />
                <Text style={{ color: '#A78BFA', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>SYSTEM TIP</Text>
              </div>
              <Text style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.6', display: 'block' }}>
                Data export for Q1 reports is now available in the audit section. Ensure all Speaking grades are finalized.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
