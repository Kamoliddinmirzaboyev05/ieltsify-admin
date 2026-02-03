import React, { useState } from 'react';
import { Form, Input, Select, Modal, Upload, Space, Tag, Typography, Row, Col, Divider, Tooltip, Button } from 'antd';
import { InboxOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ContentTable from '../components/ContentTable';
import { mockWriting } from '../mock/data';
import type { WritingMaterial, Difficulty } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;

const WritingPage: React.FC = () => {
  const [data, setData] = useState<WritingMaterial[]>(mockWriting);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<WritingMaterial> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text style={{ color: '#64748b', fontSize: '12px' }}>#{id}</Text>,
    },
    {
      title: 'TASK TYPE',
      dataIndex: 'taskType',
      key: 'taskType',
      render: (type) => <Tag color="geekblue" style={{ borderRadius: '6px', border: 'none' }}>{type}</Tag>,
    },
    {
      title: 'PROMPT',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
      render: (prompt) => <Text strong style={{ color: '#f1f5f9' }}>{prompt}</Text>,
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
    const newItem: WritingMaterial = {
      id: (data.length + 1).toString(),
      ...values,
      imageFileName: values.imageFile?.[0]?.name,
    };
    setData([...data, newItem]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <ContentTable
        title="Writing Content"
        subtitle="Create and manage writing prompts for Task 1 and Task 2."
        columns={columns}
        dataSource={data}
        onAdd={() => setIsModalOpen(true)}
      />

      <Modal
        title={
          <div style={{ paddingBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>Create Writing Task</Title>
            <Text style={{ color: '#94a3b8' }}>Define a new writing prompt and requirements.</Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={750}
        okText="Create Task"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: '24px' }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="taskType" label={<Text strong style={{ color: '#e2e8f0' }}>Task Type</Text>} rules={[{ required: true }]}>
                <Select size="large" style={{ background: '#0f172a' }}>
                  <Select.Option value="Task 1">Task 1 (Academic)</Select.Option>
                  <Select.Option value="Task 2">Task 2 (Essay)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label={<Text strong style={{ color: '#e2e8f0' }}>Difficulty</Text>} rules={[{ required: true }]}>
                <Select size="large" style={{ background: '#0f172a' }}>
                  <Select.Option value="Easy">Easy</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="Hard">Hard</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="prompt" label={<Text strong style={{ color: '#e2e8f0' }}>Question Prompt</Text>} rules={[{ required: true }]}>
            <TextArea rows={8} placeholder="Enter the writing prompt here..." style={{ background: '#0f172a' }} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.taskType !== currentValues.taskType}
          >
            {({ getFieldValue }) =>
              getFieldValue('taskType') === 'Task 1' && (
                <>
                  <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '32px 0 16px' }}>
                    <Text strong style={{ color: '#8B5CF6' }}>Task 1 Visual Material</Text>
                  </Divider>
                  <Form.Item
                    name="imageFile"
                    valuePropName="fileList"
                    getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[{ required: true, message: 'Please upload an image' }]}
                  >
                    <Dragger
                      beforeUpload={() => false}
                      maxCount={1}
                      style={{ background: 'rgba(139, 92, 246, 0.02)', border: '1px dashed rgba(139, 92, 246, 0.3)', borderRadius: '12px' }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#8B5CF6' }} />
                      </p>
                      <p className="ant-upload-text" style={{ color: '#e2e8f0' }}>Upload diagram or chart</p>
                    </Dragger>
                  </Form.Item>
                </>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WritingPage;
