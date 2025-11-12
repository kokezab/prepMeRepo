import { Drawer, Typography, Space, Tag } from "antd";
import type { Question } from "@/features/questions/types";
import { getColorFromString } from "@/lib/colors";

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
      title={
        <span style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '18px',
          fontWeight: 600
        }}>
          Author's Answer
        </span>
      }
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
              background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: '16px',
              lineHeight: '1.8',
              fontWeight: 500,
              borderLeft: '4px solid #6366f1'
            }}
          >
            {question.text}
          </Typography.Paragraph>

          <Space size={[6, 6]} wrap style={{ marginBottom: 24 }}>
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
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${color.border}`,
                      fontSize: '14px'
                    }}
                  >
                    {c.name}
                  </Tag>
                );
              })}
          </Space>

          {question.authorsAnswer ? (
            <>
              <div
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 20,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  marginBottom: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                dangerouslySetInnerHTML={{ __html: question.authorsAnswer }}
              />
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: '#6366f1'
                }}
              >
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
