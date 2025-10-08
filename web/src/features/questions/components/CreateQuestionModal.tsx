 import {useMemo, useRef} from "react";
 import {Button, Form, Input, Modal, Select} from "antd";
import type { TextAreaRef } from "antd/es/input/TextArea";
import useCreateQuestion from "@/features/questions/hooks/useCreateQuestion";
import useListCategories from "@/features/categories/hooks/useListCategories";
import {useFirebaseUser} from "@/hooks/useFirebaseUser";
import RichTextEditor from "@/components/RichTextEditor";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {hideAddQuestion, selectIsAddQuestionOpen} from "@/features/questions/slice/questionsSlice";

export default function CreateQuestionModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectIsAddQuestionOpen);
  const [form] = Form.useForm();

  const { user } = useFirebaseUser();
  const authorId = user?.uid || "";

  const { data: categoriesData } = useListCategories();
  const categoryOptions = useMemo(
    () => (categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData]
  );

  const createMutation = useCreateQuestion();
  const createTextRef = useRef<TextAreaRef>(null);

  const handleCreate = async (opts?: { keepOpen?: boolean; keepCategories?: boolean }) => {
    try {
      const values = await form.validateFields();
      const normalizeParBreaks = (html: string): string => {
        const h = html || "";
        // Only normalize if the ENTIRE content is made of paragraphs only (no other block tags)
        const hasOtherBlocks = /<(ol|ul|li|h[1-6]|blockquote|pre|code|table)\b/i.test(h);
        const isOnlyParagraphs = /^\s*(?:<p>[\s\S]*?<\/p>\s*)+$/i.test(h);
        if (hasOtherBlocks || !isOnlyParagraphs) return h;
        // Join adjacent paragraphs with <br/>
        return h.replace(/<\/p>\s*<p>/gi, "<br/>").replace(/^\s*<p>|<\/p>\s*$/gi, "");
      };

      const authorsAnswerHtml = normalizeParBreaks((values.authorsAnswer as string) ?? "");
      const payload = {
        categoryIds: (values.categoryIds as string[]) ?? [],
        text: values.text as string,
        authorId: authorId,
        authorsAnswer: authorsAnswerHtml,
      };

      await createMutation.mutateAsync(payload as any);
      if (opts?.keepOpen) {
        const keepCats = opts.keepCategories ? (values.categoryIds as string[]) ?? [] : [];
        form.setFieldsValue({ text: "", authorsAnswer: "", categoryIds: keepCats });
        // Refocus textarea for quick entry
        setTimeout(() => createTextRef.current?.focus?.(), 0);
      } else {
        form.resetFields();
        dispatch(hideAddQuestion());
      }
    } finally {
      // no-op
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={() => dispatch(hideAddQuestion())}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        destroyOnClose
        afterOpenChange={(opened) => {
          if (opened) createTextRef.current?.focus?.();
        }}
        footer={[
          <Button key="cancel" onClick={() => dispatch(hideAddQuestion())}>Cancel</Button>,
          <Button
            key="save-new"
            type="primary"
            loading={createMutation.isPending}
            onClick={() => handleCreate({ keepOpen: true, keepCategories: true })}
          >
            Save and create a new one
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={createMutation.isPending}
            onClick={() => handleCreate()}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{ authorsAnswer: "" }}>
          <Form.Item label="Question Text" name="text" rules={[{ required: true, message: "Please enter the question" }]}>
            <Input.TextArea rows={3} placeholder="Type the question here" ref={createTextRef} />
          </Form.Item>

          <Form.Item label="Categories" name="categoryIds" rules={[{ required: true, message: "Please select at least one category" }]}>
            <Select
              mode="multiple"
              options={categoryOptions}
              placeholder="Select categories"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item label="Author's Answer">
            <Form.Item noStyle name="authorsAnswer" getValueProps={(value) => ({ value })} getValueFromEvent={(val) => val}>
              <RichTextEditor />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
