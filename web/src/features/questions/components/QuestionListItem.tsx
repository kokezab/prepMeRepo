import { Button, Card, Flex, Popconfirm, Space, Typography, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Question } from "@/features/questions/types";

type Props = {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  categoryById: Record<string, string>;
  authorDisplayById: Record<string, string>;
  currentUserId: string | null;
};

export default function QuestionListItem({ question, onEdit, onDelete, onView, categoryById, authorDisplayById, currentUserId }: Props) {
  const canModify = currentUserId != null && currentUserId === question.authorId;
  return (
    <Card size="small" onClick={onView} hoverable>
      <Flex justify="space-between" align="center" wrap gap={8}>
        <div style={{ flex: 1 }}>
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 8 }}>
            {question.text}
          </Typography.Paragraph>
          <Space size={[4, 4]} wrap>
            {(question.categoryIds || [])
              .map((id) => ({ id, name: categoryById[id] }))
              .filter((c) => !!c.name)
              .map((c) => (
                <Tag key={c.id}>{c.name}</Tag>
              ))}
          </Space>
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            {authorDisplayById[question.authorId] || 'Unknown author'}
          </Typography.Text>
        </div>
        {canModify && (
          <Space onClick={(e) => e.stopPropagation()}>
            <Button onClick={(e) => { e.stopPropagation(); onEdit(); }} icon={<EditOutlined />} type="text" />
            <Popconfirm
              title="Delete question"
              description={`Are you sure you want to delete this question?`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={onDelete}
            >
              <Button onClick={(e) => e.stopPropagation()} icon={<DeleteOutlined />} type="text" danger />
            </Popconfirm>
          </Space>
        )}
      </Flex>
    </Card>
  );
}
