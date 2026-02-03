import React, { useState } from 'react';
import { Form, Input, Button, Modal, Space, Typography, Tooltip, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ContentTable from '../components/ContentTable';
import { mockSpeaking } from '../mock/data';
import type { SpeakingMaterial } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;

const SpeakingPage: React.FC = () => {
  const [data, setData] = useState<SpeakingMaterial[]>(mockSpeaking);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<SpeakingMaterial> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text style={{ color: '#64748b', fontSize: '12px' }}>#{id}</Text>,
    },
    {
      title: 'TOPIC / CUE CARD',
      dataIndex: 'topic',
      key: 'topic',
      render: (topic) => <Text strong style={{ color: '#f1f5f9' }}>{topic}</Text>,
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
    const newItem: SpeakingMaterial = {
      id: (data.length + 1).toString(),
      ...values,
    };
    setData([...data, newItem]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const DynamicQuestionList = ({ name, label, indexPrefix }: { name: string; label: string, indexPrefix: string }) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div>
          {fields.map((field, index) => (
            <Space key={field.key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
              <Text style={{ width: 80, color: '#64748b', fontSize: '12px' }}>{indexPrefix} Q{index + 1}:</Text>
              <Form.Item
                {...field}
                rules={[{ required: true, message: 'Missing question' }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Enter question" style={{ width: 450, background: '#0f172a' }} />
              </Form.Item>
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={() => add()}
            icon={<PlusOutlined />}
            size="small"
            style={{ marginLeft: 80, color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.05)', borderStyle: 'dashed' }}
          >
            Add {label}
          </Button>
        </div>
      )}
    </Form.List>
  );

  return (
    <>
      <ContentTable
        title="Speaking Topics"
        subtitle="Manage questions for Part 1, Part 2, and Part 3."
        columns={columns}
        dataSource={data}
        onAdd={() => setIsModalOpen(true)}
      />

      <Modal
        title={
          <div style={{ paddingBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>Create Speaking Topic</Title>
            <Text style={{ color: '#94a3b8' }}>Define a new topic and its associated questions.</Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={750}
        okText="Create Topic"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: '24px' }}>
          <Form.Item name="topic" label={<Text strong style={{ color: '#e2e8f0' }}>Topic / Cue Card Title</Text>} rules={[{ required: true }]}>
            <Input placeholder="e.g. Describe a beautiful city" size="large" style={{ background: '#0f172a' }} />
          </Form.Item>
          
          <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}><Text strong style={{ color: '#8B5CF6' }}>Part 1: Introduction</Text></Divider>
          <DynamicQuestionList name="part1Questions" label="Part 1 Question" indexPrefix="P1" />

          <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}><Text strong style={{ color: '#8B5CF6' }}>Part 2: Cue Card Details</Text></Divider>
          <DynamicQuestionList name="part2Questions" label="Part 2 Question" indexPrefix="P2" />

          <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}><Text strong style={{ color: '#8B5CF6' }}>Part 3: Discussion</Text></Divider>
          <DynamicQuestionList name="part3Questions" label="Part 3 Question" indexPrefix="P3" />
        </Form>
      </Modal>
    </>
  );
};

export default SpeakingPage;
