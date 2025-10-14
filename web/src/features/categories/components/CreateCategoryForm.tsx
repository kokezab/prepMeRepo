import {Button, Form, Grid, Input} from "antd";
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
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    return <>
        <Form<CreateCategoryFormData> form={form} layout={isMobile ? "vertical" : "inline"} onFinish={mutate} disabled={isPending}>
            <Form.Item name="name" rules={nameRules} style={{ flex: isMobile ? undefined : 1 }}>
                <Input placeholder="Enter category name" autoFocus style={{ width: isMobile ? '100%' : 280 }} />
            </Form.Item>
            <Form.Item>
                <Button loading={isPending} type="primary" htmlType='submit' block={isMobile}>Create Category</Button>
            </Form.Item>
        </Form>
    </>;
}
