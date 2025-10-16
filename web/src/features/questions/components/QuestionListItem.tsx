import { Button, Card, Flex, Popconfirm, Space, Typography, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CheckCircleFilled, FileTextOutlined } from "@ant-design/icons";
import type { Question } from "@/features/questions/types";

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
    <Card size="small" onClick={handleCardClick} hoverable>
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
        <Space onClick={(e) => e.stopPropagation()}>
          {question.authorsAnswer && (
            <Button 
              onClick={(e) => { e.stopPropagation(); onQuickViewAnswer(); }} 
              icon={<FileTextOutlined />} 
              type="text"
              title="Quick view author's answer"
            />
          )}
          {!guestMode && currentUserId && (
            <Button 
              onClick={(e) => { e.stopPropagation(); onToggleCompleted(); }} 
              icon={isCompleted ? <CheckCircleFilled /> : <CheckCircleOutlined />} 
              type={isCompleted ? "primary" : "text"}
              title={isCompleted ? "Mark as not completed" : "Mark as completed"}
            />
          )}
          {canModify && (
            <>
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
            </>
          )}
        </Space>
      </Flex>
    </Card>
  );
}
