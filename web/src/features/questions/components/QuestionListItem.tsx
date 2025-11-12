import { Button, Card, Flex, Popconfirm, Space, Typography, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CheckCircleFilled, FileTextOutlined } from "@ant-design/icons";
import type { Question } from "@/features/questions/types";
import { getColorFromString } from "@/lib/colors";

type Props = {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onToggleCompleted: () => void;
  onQuickViewAnswer: () => void;
  categoryById: Record<string, string>;
  authorDisplayById: Record<string, string>;
  currentUserId: string | null;
  guestMode?: boolean;
};

export default function QuestionListItem({ question, onEdit, onDelete, onView, onToggleCompleted, onQuickViewAnswer, categoryById, authorDisplayById, currentUserId, guestMode }: Props) {
  const canModify = !guestMode && currentUserId != null && currentUserId === question.authorId;
  const isCompleted = currentUserId ? question.completedBy?.includes(currentUserId) : false;
  
  // Open drawer on card click if answer exists, otherwise open modal
  const handleCardClick = () => {
    if (question.authorsAnswer) {
      onQuickViewAnswer();
    } else {
      onView();
    }
  };
  
  return (
    <Card
      size="small"
      onClick={handleCardClick}
      className="card-hover fade-in"
      style={{
        borderLeft: isCompleted ? '4px solid #10b981' : '4px solid #6366f1',
        background: isCompleted
          ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
      }}
    >
      <Flex justify="space-between" align="center" wrap gap={8}>
        <div style={{ flex: 1 }}>
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 8, fontSize: '15px', fontWeight: 500 }}>
            {question.text}
          </Typography.Paragraph>
          <Space size={[6, 6]} wrap>
            {(question.categoryIds || [])
              .map((id) => ({ id, name: categoryById[id] }))
              .filter((c) => !!c.name)
              .map((c) => {
                const color = getColorFromString(c.name);
                return (
                  <Tag
                    key={c.id}
                    style={{
                      background: color.bg,
                      borderColor: color.border,
                      color: color.text,
                      fontWeight: 500,
                      padding: '2px 10px',
                      borderRadius: '6px',
                      border: `1.5px solid ${color.border}`,
                    }}
                  >
                    {c.name}
                  </Tag>
                );
              })}
          </Space>
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: '13px' }}>
            {authorDisplayById[question.authorId] || 'Unknown author'}
          </Typography.Text>
        </div>
        <Space onClick={(e) => e.stopPropagation()}>
          {question.authorsAnswer && (
            <Button
              onClick={(e) => { e.stopPropagation(); onQuickViewAnswer(); }}
              icon={<FileTextOutlined />}
              type="text"
              title="Quick view author's answer"
              style={{ color: '#3b82f6' }}
            />
          )}
          {!guestMode && currentUserId && (
            <Button
              onClick={(e) => { e.stopPropagation(); onToggleCompleted(); }}
              icon={isCompleted ? <CheckCircleFilled /> : <CheckCircleOutlined />}
              type={isCompleted ? "primary" : "text"}
              title={isCompleted ? "Mark as not completed" : "Mark as completed"}
              style={
                isCompleted
                  ? { background: '#10b981', borderColor: '#10b981' }
                  : { color: '#9ca3af' }
              }
            />
          )}
          {canModify && (
            <>
              <Button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                icon={<EditOutlined />}
                type="text"
                style={{ color: '#8b5cf6' }}
              />
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
            </>
          )}
        </Space>
      </Flex>
    </Card>
  );
}
