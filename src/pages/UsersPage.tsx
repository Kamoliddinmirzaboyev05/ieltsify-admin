import React, { useState } from 'react';
import { Space, Tag, Button, Typography, Avatar, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ContentTable from '../components/ContentTable';
import { mockUsers } from '../mock/data';
import type { User } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const UsersPage: React.FC = () => {
  const [data, setData] = useState<User[]>(mockUsers);

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text style={{ color: '#64748b', fontSize: '12px' }}>#{id}</Text>,
    },
    {
      title: 'USER',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>{record.name[0]}</Avatar>
          <div>
            <Text strong style={{ display: 'block', color: '#f1f5f9' }}>{record.name}</Text>
            <Text style={{ fontSize: '12px', color: '#94a3b8' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Admin' ? 'gold' : 'blue'} style={{ borderRadius: '6px', border: 'none' }}>{role}</Tag>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined style={{ color: '#8B5CF6' }} />} />
          </Tooltip>
          <Tooltip title="Deactivate">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setData(data.filter((item) => item.id !== record.id))}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ContentTable
      title="User Management"
      subtitle="Overview of all registered students and administrators."
      columns={columns}
      dataSource={data}
    />
  );
};

export default UsersPage;
