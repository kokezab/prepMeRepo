import { Modal, Space, Tag, Typography } from "antd";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hideViewQuestion, selectQuestionToView } from "@/features/questions/slice/questionsSlice";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useListUsers from "@/features/users/hooks/useListUsers";
import { getColorFromString } from "@/lib/colors";

export default function ViewQuestionModal() {
  const dispatch = useAppDispatch();
  const question = useAppSelector(selectQuestionToView);
  const open = !!question;

  const { data: categoriesData } = useListCategories();
  const categoryById = useMemo(
    () => Object.fromEntries((categoriesData || []).map((c) => [c.id, c.name])),
    [categoriesData]
  );

  const { data: usersData } = useListUsers();
  const authorDisplayById = useMemo(
    () => Object.fromEntries((usersData || []).map((u) => [u.id, u.name || u.email || "Unknown author"])),
    [usersData]
  );

  return (
    <Modal
      open={open}
      onCancel={() => dispatch(hideViewQuestion())}
      title={
        <span style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '20px',
          fontWeight: 600
        }}>
          Question Details
        </span>
      }
      footer={null}
      width="100%"
      style={{ top: 0, paddingBottom: 0 }}
      styles={{ body: { height: "calc(100vh - 110px)", overflow: "auto" } }}
      destroyOnHidden
    >
      {question && (
        <div>
          <Typography.Title level={5} style={{ marginTop: 0, color: '#6366f1' }}>Question</Typography.Title>
          <Typography.Paragraph
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
              padding: 16,
              borderRadius: 8,
              fontSize: '15px',
              fontWeight: 500,
              borderLeft: '4px solid #6366f1'
            }}
          >
            {question.text}
          </Typography.Paragraph>

          <Typography.Title level={5} style={{ color: '#8b5cf6' }}>Categories</Typography.Title>
          <Space size={[6, 6]} wrap style={{ marginBottom: 16 }}>
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

          <Typography.Title level={5} style={{ marginTop: 16, color: '#3b82f6' }}>Author</Typography.Title>
          <Typography.Text style={{ fontStyle: 'italic', color: '#6366f1' }}>
            {authorDisplayById[question.authorId] || 'Unknown author'}
          </Typography.Text>

          <Typography.Title level={5} style={{ marginTop: 16, color: '#10b981' }}>Author's Answer</Typography.Title>
          {question.authorsAnswer ? (
            <div
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                padding: 16,
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              dangerouslySetInnerHTML={{ __html: question.authorsAnswer }}
            />
          ) : (
            <Typography.Text type="secondary">No author's answer provided.</Typography.Text>
          )}
        </div>
      )}
    </Modal>
  );
}
