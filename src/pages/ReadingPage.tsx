import React, { useState } from 'react';
import { Form, Input, Select, Modal, Space, Tag, Typography, Tooltip, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ContentTable from '../components/ContentTable';
import { mockReading } from '../mock/data';
import type { ReadingMaterial, Difficulty } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Text, Title } = Typography;

const ReadingPage: React.FC = () => {
  const [data, setData] = useState<ReadingMaterial[]>(mockReading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<ReadingMaterial> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text style={{ color: '#64748b', fontSize: '12px' }}>#{id}</Text>,
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong style={{ color: '#f1f5f9' }}>{title}</Text>,
    },
    {
      title: 'DIFFICULTY',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: Difficulty) => {
        let color = difficulty === 'Easy' ? '#064e3b' : difficulty === 'Medium' ? '#78350f' : '#7f1d1d';
        let text = difficulty === 'Easy' ? '#10b981' : difficulty === 'Medium' ? '#fbbf24' : '#f87171';
        return <Tag style={{ borderRadius: '6px', border: 'none', background: color, color: text }}>{difficulty}</Tag>;
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined style={{ color: '#8B5CF6' }} />} />
          </Tooltip>
          <Tooltip title="Delete">
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

  const handleAdd = (values: any) => {
    const newItem: ReadingMaterial = {
      id: (data.length + 1).toString(),
      ...values,
      questions: values.questions || [],
    };
    setData([...data, newItem]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <ContentTable
        title="Reading Content"
        subtitle="Manage academic reading passages and configurations."
        columns={columns}
        dataSource={data}
        onAdd={() => setIsModalOpen(true)}
      />

      <Modal
        title={
          <div style={{ paddingBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>Create Reading Material</Title>
            <Text style={{ color: '#94a3b8' }}>Include a new passage and its metadata.</Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={800}
        okText="Create Material"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: '24px' }}>
          <Form.Item name="title" label={<Text strong style={{ color: '#e2e8f0' }}>Passage Title</Text>} rules={[{ required: true }]}>
            <Input placeholder="Enter title" size="large" style={{ background: '#0f172a' }} />
          </Form.Item>
          <Form.Item name="passage" label={<Text strong style={{ color: '#e2e8f0' }}>Passage Content</Text>} rules={[{ required: true }]}>
            <TextArea rows={12} placeholder="Paste text here..." style={{ background: '#0f172a' }} />
          </Form.Item>
          <Form.Item name="difficulty" label={<Text strong style={{ color: '#e2e8f0' }}>Difficulty</Text>} rules={[{ required: true }]}>
            <Select size="large" style={{ width: '220px', background: '#0f172a' }}>
              <Select.Option value="Easy">Easy</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Hard">Hard</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReadingPage;
