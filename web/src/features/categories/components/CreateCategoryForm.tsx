import {Button, Form, Input} from "antd";
import useCreateCategory from "@/features/categories/hooks/useCreateCategory.ts";
import useResetFormOnSuccess from "@/hooks/useResetFormOnSuccess";

type CreateCategoryFormData = {
    name: string;
}

const nameRules = [{required: true, message: 'Please input the category name!'}];

export default function CreateCategoryForm() {
    const [form] = Form.useForm<CreateCategoryFormData>();
    const {mutate, isPending, isSuccess} = useCreateCategory();
    useResetFormOnSuccess(form, isSuccess);

    return <>
        <Form<CreateCategoryFormData> form={form} layout="inline" onFinish={mutate} disabled={isPending}>
            <Form.Item name="name" rules={nameRules}>
                <Input placeholder="Enter category name" autoFocus />
            </Form.Item>
            <Form.Item>
                <Button loading={isPending} type="primary" htmlType='submit'>Create Category</Button>
            </Form.Item>
        </Form>
    </>;
}
