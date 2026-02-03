import { Table, Button, Typography, Card, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ContentTableProps<T> {
  title: string;
  columns: ColumnsType<T>;
  dataSource: T[];
  onAdd?: () => void;
  loading?: boolean;
}

const ContentTable = <T extends { id: string }>({
  title,
  columns,
  dataSource,
  onAdd,
  loading,
}: ContentTableProps<T>) => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <Title level={4} className="stats-label" style={{ marginBottom: '4px' }}>Management</Title>
          <Title level={2} style={{ margin: 0, color: '#FFFFFF', fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Title>
        </div>
        {onAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={onAdd}
            style={{ height: '44px', borderRadius: '10px', fontWeight: 600, padding: '0 24px' }}
          >
            Create New
          </Button>
        )}
      </div>

      <Card
        styles={{ body: { padding: 0 } }}
        title={
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px' }}>
            <Input
              placeholder="Search record..."
              prefix={<SearchOutlined style={{ color: '#64748B' }} />}
              style={{ width: 320, borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF' }}
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
