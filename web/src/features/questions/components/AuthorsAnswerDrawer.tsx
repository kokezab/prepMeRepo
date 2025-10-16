import { Drawer, Typography, Space, Tag } from "antd";
import type { Question } from "@/features/questions/types";

type Props = {
  question: Question | null;
  open: boolean;
  onClose: () => void;
  categoryById: Record<string, string>;
  authorDisplayById: Record<string, string>;
};

export default function AuthorsAnswerDrawer({ question, open, onClose, categoryById, authorDisplayById }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Author's Answer"
      placement="right"
      width={600}
      styles={{ body: { paddingTop: 16, fontSize: '16px', lineHeight: '1.8' } }}
    >
      {question && (
        <div>
          <Typography.Paragraph 
            style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              background: '#f5f5f5',
              padding: 16,
              borderRadius: 6,
              marginBottom: 12,
              fontSize: '16px',
              lineHeight: '1.8'
            }}
          >
            {question.text}
          </Typography.Paragraph>

          <Space size={[4, 4]} wrap style={{ marginBottom: 24 }}>
            {(question.categoryIds || [])
              .map((id) => ({ id, name: categoryById[id] }))
              .filter((c) => !!c.name)
              .map((c) => (
                <Tag key={c.id}>{c.name}</Tag>
              ))}
          </Space>

          {question.authorsAnswer ? (
            <>
              <div
                style={{ 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 6, 
                  padding: 16,
                  background: '#fff',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: 16
                }}
                dangerouslySetInnerHTML={{ __html: question.authorsAnswer }}
              />
              <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
                — {authorDisplayById[question.authorId] || 'Unknown author'}
              </Typography.Text>
            </>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: '16px' }}>No author's answer provided.</Typography.Text>
          )}
        </div>
      )}
    </Drawer>
  );
}
