import { Table, Button, Typography, Card, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface ContentTableProps<T> {
  title: string;
  subtitle?: string;
  columns: ColumnsType<T>;
  dataSource: T[];
  onAdd?: () => void;
  loading?: boolean;
}

const ContentTable = <T extends { id: string }>({
  title,
  subtitle,
  columns,
  dataSource,
  onAdd,
  loading,
}: ContentTableProps<T>) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#f8fafc', fontWeight: '800' }}>{title}</Title>
          {subtitle && <Text style={{ color: '#64748b' }}>{subtitle}</Text>}
        </div>
        {onAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={onAdd}
            style={{ height: '48px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
          >
            Add New
          </Button>
        )}
      </div>

      <Card
        styles={{ body: { padding: 0 } }}
        title={
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: '#64748b' }} />}
              style={{ width: 320, borderRadius: '10px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
            <Select
              defaultValue="All"
              style={{ width: 180 }}
              options={[{ value: 'All', label: 'All Items' }]}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="clean-table"
        />
      </Card>
    </div>
  );
};

export default ContentTable;
