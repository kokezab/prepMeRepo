import {Form, Input, Modal, Select} from "antd";
import {useEffect, useMemo} from "react";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useUpdateQuestion from "@/features/questions/hooks/useUpdateQuestion";
import RichTextEditor from "@/components/RichTextEditor";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {hideUpdateQuestion, selectQuestionToUpdate} from "@/features/questions/slice/questionsSlice";

export default function UpdateQuestionModal() {
  const dispatch = useAppDispatch();
  const question = useAppSelector(selectQuestionToUpdate);
  const open = !!question;
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useUpdateQuestion();
  const { data: categoriesData } = useListCategories();
  const categoryOptions = useMemo(
    () => (categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData]
  );

  useEffect(() => {
    if (open && question) {
      form.setFieldsValue({
        categoryIds: question.categoryIds,
        text: (question.text ?? '').replace(/\\n/g, "\n"),
        authorsAnswer: question.authorsAnswer ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [open, question, form]);

  const onUpdate = async () => {
    if (!question) return;
    const values = await form.validateFields();
    await mutateAsync({
      id: question.id,
      patch: {
        categoryIds: (values.categoryIds as string[]) ?? [],
        text: values.text as string,
        authorsAnswer: (values.authorsAnswer as string) ?? "",
      },
    });
    dispatch(hideUpdateQuestion());
  };

  return (
    <Modal
      open={open}
      onCancel={() => dispatch(hideUpdateQuestion())}
      title="Edit Question"
      onOk={onUpdate}
      confirmLoading={isPending}
      width="100%"
      style={{ top: 0, paddingBottom: 0 }}
      bodyStyle={{ height: "calc(100vh - 110px)", overflow: "auto" }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" disabled={isPending}>
        <Form.Item label="Question Text" name="text" rules={[{ required: true, message: "Please enter the question" }]}>
          <Input.TextArea rows={3} placeholder="Type the question here" />
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
  );
}
