import { Modal, Space, Tag, Typography } from "antd";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hideViewQuestion, selectQuestionToView } from "@/features/questions/slice/questionsSlice";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useListUsers from "@/features/users/hooks/useListUsers";

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
      title="Question Details"
      footer={null}
      width="100%"
      style={{ top: 0, paddingBottom: 0 }}
      bodyStyle={{ height: "calc(100vh - 110px)", overflow: "auto" }}
      destroyOnClose
    >
      {question && (
        <div>
          <Typography.Title level={5} style={{ marginTop: 0 }}>Question</Typography.Title>
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {question.text}
          </Typography.Paragraph>

          <Typography.Title level={5}>Categories</Typography.Title>
          <Space size={[4, 4]} wrap>
            {(question.categoryIds || [])
              .map((id) => ({ id, name: categoryById[id] }))
              .filter((c) => !!c.name)
              .map((c) => (
                <Tag key={c.id}>{c.name}</Tag>
              ))}
          </Space>

          <Typography.Title level={5} style={{ marginTop: 16 }}>Author</Typography.Title>
          <Typography.Text>{authorDisplayById[question.authorId] || 'Unknown author'}</Typography.Text>

          <Typography.Title level={5} style={{ marginTop: 16 }}>Author's Answer</Typography.Title>
          {question.authorsAnswer ? (
            <div
              style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12 }}
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
