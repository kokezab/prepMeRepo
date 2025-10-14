import {Button, Form, Input, Modal, Space} from "antd";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {hideUpdateCategory, selectCategoryToUpdate} from "@/features/categories/slice/categoriesSlice.ts";
import useUpdateCategory from "@/features/categories/hooks/useUpdateCategory";
import useResetFormOnSuccess from "@/hooks/useResetFormOnSuccess";

type UpdateCategoryFormData = {
    name: string;
}

const nameRules = [{required: true, message: 'Please input the category name!'}];


export default function UpdateCategoryModal() {
    const dispatch = useAppDispatch();
    const categoryToUpdate = useAppSelector(selectCategoryToUpdate);
    const open = !!categoryToUpdate;

    const [form] = Form.useForm<UpdateCategoryFormData>();
    const {mutate, isPending, isSuccess} = useUpdateCategory();

    useResetFormOnSuccess(form, isSuccess);

    useEffect(() => {
        if (categoryToUpdate) {
            form.setFieldsValue({name: categoryToUpdate.name});
        } else {
            form.resetFields();
        }
    }, [categoryToUpdate, form]);

    const handleCancel = () => dispatch(hideUpdateCategory());

    const onUpdate = async () => {
        if (!categoryToUpdate) return;

        const values = await form.validateFields();

        mutate(
            {id: categoryToUpdate.id, patch: {name: values.name}},
            {onSuccess: () => dispatch(hideUpdateCategory())}
        );
    };

    return (
        <>
            <Modal open={open} onCancel={handleCancel}
                   footer={<Space>
                       <Button onClick={handleCancel} disabled={isPending}>
                           Cancel
                       </Button>
                       <Button onClick={onUpdate} type="primary" loading={isPending}>
                           Update
                       </Button>
                   </Space>} destroyOnHidden title="Update Category">
                <Form<UpdateCategoryFormData>
                    form={form}
                    layout="vertical"
                    disabled={isPending}
                >
                    <Form.Item name="name" rules={nameRules}>
                        <Input placeholder="Enter category name" autoFocus/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
