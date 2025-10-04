import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Space, Typography } from "antd";
import useCreateQuestion from "@/features/questions/hooks/useCreateQuestion";
import useListCategories from "@/features/categories/hooks/useListCategories";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import RichTextEditor from "@/components/RichTextEditor";
import useListQuestions from "@/features/questions/hooks/useListQuestions";
import useUpdateQuestion from "@/features/questions/hooks/useUpdateQuestion";
import useDeleteQuestion from "@/features/questions/hooks/useDeleteQuestion";
import QuestionsList from "@/features/questions/components/QuestionsList";

export default function QuestionsManagementPage() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { user } = useFirebaseUser();
  const authorId = user?.uid || "";

  const { data: categoriesData } = useListCategories();
  const categoryOptions = useMemo(
    () => (categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData]
  );

  // Filters
  const [filterCategoryIds, setFilterCategoryIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState<string>("");

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();
  const { data: questions, isLoading: loadingQuestions } = useListQuestions();

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const payload = {
        categoryIds: (values.categoryIds as string[]) ?? [],
        text: values.text as string,
        authorId: authorId,
        authorsAnswer: (values.authorsAnswer as string) ?? null,
      };
      await createMutation.mutateAsync(payload);
      form.resetFields();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (q: { id: string; text: string; categoryIds: string[]; authorsAnswer: string | null }) => {
    setEditingId(q.id);
    editForm.setFieldsValue({
      categoryIds: q.categoryIds,
      text: q.text,
      authorsAnswer: q.authorsAnswer ?? "",
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      setEditSubmitting(true);
      const values = await editForm.validateFields();
      await updateMutation.mutateAsync({
        id: editingId,
        patch: {
          categoryIds: (values.categoryIds as string[]) ?? [],
          text: values.text as string,
          authorsAnswer: (values.authorsAnswer as string) ?? null,
        },
      });
      setEditOpen(false);
      setEditingId(null);
      editForm.resetFields();
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Questions Management
        </Typography.Title>
        <Button type="primary" onClick={() => setOpen(true)}>Create Question</Button>
      </Space>

      <div>
        {/* Filters */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            mode="multiple"
            allowClear
            style={{ minWidth: 260 }}
            placeholder="Filter by categories"
            options={categoryOptions}
            value={filterCategoryIds}
            onChange={(vals) => setFilterCategoryIds(vals)}
          />
          <Input.Search
            allowClear
            placeholder="Filter by question text"
            style={{ minWidth: 260 }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Space>

        {loadingQuestions ? (
          <Typography.Text>Loading questions...</Typography.Text>
        ) : (
          <QuestionsList
            questions={(questions || []).filter((q) => {
              const matchesText = filterText
                ? q.text.toLowerCase().includes(filterText.toLowerCase())
                : true;
              const matchesCategories = filterCategoryIds.length
                ? q.categoryIds?.some((id) => filterCategoryIds.includes(id))
                : true;
              return matchesText && matchesCategories;
            })}
            onEdit={(q) => openEdit(q)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Create Question"
        onOk={handleCreate}
        confirmLoading={submitting}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: "calc(100vh - 110px)", overflow: "auto" }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ authorsAnswer: "" }}
        >
          <Form.Item label="Categories" name="categoryIds" rules={[{ required: true, message: "Please select at least one category" }]}>
            <Select
              mode="multiple"
              options={categoryOptions}
              placeholder="Select categories"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item label="Question Text" name="text" rules={[{ required: true, message: "Please enter the question" }]}>
            <Input.TextArea rows={3} placeholder="Type the question here" />
          </Form.Item>

          {/* authorId is captured from auth and not shown */}

          <Form.Item label="Author's Answer" name="authorsAnswer">
            <Form.Item noStyle name="authorsAnswer" getValueProps={(value) => ({ value })} getValueFromEvent={(_e) => _e}>
              <RichTextEditor
                value={form.getFieldValue("authorsAnswer")}
                onChange={(html) => form.setFieldsValue({ authorsAnswer: html })}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        title="Edit Question"
        onOk={handleUpdate}
        confirmLoading={editSubmitting}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: "calc(100vh - 110px)", overflow: "auto" }}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Categories" name="categoryIds" rules={[{ required: true, message: "Please select at least one category" }]}>
            <Select
              mode="multiple"
              options={categoryOptions}
              placeholder="Select categories"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item label="Question Text" name="text" rules={[{ required: true, message: "Please enter the question" }]}>
            <Input.TextArea rows={3} placeholder="Type the question here" />
          </Form.Item>

          <Form.Item label="Author's Answer" name="authorsAnswer">
            <RichTextEditor
              value={editForm.getFieldValue("authorsAnswer")}
              onChange={(html) => editForm.setFieldsValue({ authorsAnswer: html })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
