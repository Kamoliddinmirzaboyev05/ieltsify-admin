import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  Space,
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Table } from 'antd';
import { mockListening } from '../mock/data';
import type { ListeningMaterial, Difficulty } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;

const ListeningPage: React.FC = () => {
  const [data, setData] = useState<ListeningMaterial[]>(mockListening);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const columns: ColumnsType<ListeningMaterial> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <Text style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>#{id}</Text>,
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong style={{ color: '#f1f5f9' }}>{title}</Text>,
    },
    {
      title: 'AUDIO FILE',
      dataIndex: 'audioFileName',
      key: 'audioFileName',
      render: (fileName: string) => <Text style={{ color: '#94a3b8' }}>{fileName}</Text>,
    },
    {
      title: 'DIFFICULTY',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: Difficulty) => {
        let color: string = '';
        if (difficulty === 'Easy') color = 'success';
        else if (difficulty === 'Medium') color = 'warning';
        else color = 'error';
        return <Tag color={color} style={{ borderRadius: '6px', border: 'none', background: `${color === 'success' ? '#064e3b' : color === 'warning' ? '#78350f' : '#7f1d1d'}`, color: `${color === 'success' ? '#10b981' : color === 'warning' ? '#fbbf24' : '#f87171'}` }}>{difficulty}</Tag>;
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_, record: ListeningMaterial) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#8B5CF6' }} />}
              onClick={() => console.log('Edit', record.id)}
            />
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
    const newItem: ListeningMaterial = {
      id: (data.length + 1).toString(),
      ...values,
      audioFileName: values.audioFile?.[0]?.name || 'uploaded_audio.mp3',
      questions: values.questions || [],
    };
    setData([...data, newItem]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#f8fafc', fontWeight: '800' }}>Listening Tests</Title>
          <Text style={{ color: '#64748b' }}>Manage your audio materials and question sets.</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          style={{ height: '48px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
        >
          Add New Test
        </Button>
      </div>

      <Card
        styles={{ body: { padding: 0 } }}
        style={{ overflow: 'hidden' }}
        title={
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Input
              placeholder="Search by title..."
              prefix={<SearchOutlined style={{ color: '#64748b' }} />}
              style={{ width: 320, borderRadius: '10px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            />
            <Select
              defaultValue="All"
              style={{ width: 180 }}
              options={[
                { value: 'All', label: 'All Difficulties' },
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ]}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={
          <div style={{ paddingBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#f1f5f9' }}>Create New Listening Content</Title>
            <Text style={{ color: '#94a3b8' }}>Provide test details, audio and questions.</Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={850}
        okText="Save Content"
        okButtonProps={{ style: { height: '44px', borderRadius: '10px', fontWeight: '600' } }}
        cancelButtonProps={{ style: { height: '44px', borderRadius: '10px' } }}
        style={{ top: 40 }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: '24px' }}>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item name="title" label={<Text strong style={{ color: '#e2e8f0' }}>Test Title</Text>} rules={[{ required: true }]}>
                <Input placeholder="e.g. Conversation about Travel" size="large" style={{ background: '#0f172a' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="difficulty" label={<Text strong style={{ color: '#e2e8f0' }}>Difficulty</Text>} rules={[{ required: true }]}>
                <Select size="large" style={{ background: '#0f172a' }}>
                  <Select.Option value="Easy">Easy</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="Hard">Hard</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={<Text strong style={{ color: '#e2e8f0' }}>Description</Text>}>
            <TextArea rows={3} placeholder="Optional test context..." style={{ background: '#0f172a' }} />
          </Form.Item>

          <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Text strong style={{ color: '#8B5CF6' }}>Audio Resource</Text>
          </Divider>

          <Form.Item
            name="audioFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: 'Please upload audio' }]}
          >
            <Dragger
              beforeUpload={() => false}
              maxCount={1}
              style={{ background: 'rgba(139, 92, 246, 0.02)', border: '1px dashed rgba(139, 92, 246, 0.3)', borderRadius: '14px' }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#8B5CF6' }} />
              </p>
              <p className="ant-upload-text" style={{ color: '#e2e8f0', fontWeight: '600' }}>Drop audio file here</p>
              <p className="ant-upload-hint" style={{ color: '#64748b' }}>MP3 or WAV files are supported.</p>
            </Dragger>
          </Form.Item>

          <Divider orientation={"left" as any} style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '40px 0 24px' }}>
            <Text strong style={{ color: '#8B5CF6' }}>Questions Configuration</Text>
          </Divider>

          <Form.List name="questions">
            {(fields: any[], { add, remove }: any) => (
              <>
                {fields.map(({ key, name, ...restField }: any, index: number) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 20, background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    title={<Text style={{ color: '#f1f5f9', fontWeight: '600' }}>Question {index + 1}</Text>}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'text']}
                      label={<Text style={{ color: '#94a3b8', fontSize: '13px' }}>Question Label</Text>}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter question..." style={{ background: '#1e293b' }} />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={18}>
                        <Form.List name={[name, 'options']}>
                          {(optFields: any[], { add: addOpt, remove: removeOpt }: any) => (
                            <div style={{ marginBottom: 16 }}>
                              <Text style={{ color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Options</Text>
                              {optFields.map((optField: any) => (
                                <Form.Item key={optField.key} required={false} style={{ marginBottom: 8 }}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <Form.Item
                                      {...optField}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[{ required: true, whitespace: true, message: "Required" }]}
                                      noStyle
                                    >
                                      <Input placeholder="Option text" style={{ background: '#1e293b' }} />
                                    </Form.Item>
                                    <Button
                                      type="text"
                                      icon={<DeleteOutlined style={{ fontSize: 13 }} />}
                                      onClick={() => removeOpt(optField.name)}
                                    />
                                  </div>
                                </Form.Item>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() => addOpt()}
                                icon={<PlusOutlined />}
                                size="small"
                                style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.05)', borderStyle: 'dashed', borderColor: '#8B5CF640' }}
                              >
                                Add Option
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'correctAnswer']}
                          label={<Text style={{ color: '#94a3b8', fontSize: '13px' }}>Correct Key</Text>}
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="e.g. A" style={{ background: '#1e293b' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ height: '48px', borderRadius: '12px', color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.02)', borderStyle: 'dashed', borderColor: '#8B5CF650' }}
                >
                  Add Question
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ListeningPage;
