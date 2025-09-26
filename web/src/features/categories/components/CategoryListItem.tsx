import {Category} from "@/features/categories/types.ts";
import {Button, Card, Flex, Popconfirm, Space} from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useAppDispatch} from "@/redux/hooks.ts";
import {showUpdateCategory} from "@/features/categories/slice/categoriesSlice.ts";
import useDeleteCategory from "@/features/categories/hooks/useDeleteCategory";

export default function CategoryListItem({category}: { category: Category }) {

    const dispatch = useAppDispatch();
    const {mutate: deleteCategory, isPending} = useDeleteCategory();

    const onEdit = () => {
        dispatch(showUpdateCategory(category));
    }

    const onConfirmDelete = () => {
        deleteCategory(category.id);
    }

    return <Card size='small'><Flex justify='space-between' align='center'>
        <span>{category.name}</span>

        <Space>
            <Button onClick={onEdit} icon={<EditOutlined/>} type="text" disabled={isPending}/>
            <Popconfirm
                title="Delete category"
                description={`Are you sure you want to delete "${category.name}"?`}
                okText="Delete"
                okButtonProps={{danger: true, loading: isPending}}
                cancelText="Cancel"
                onConfirm={onConfirmDelete}
                disabled={isPending}
            >
                <Button icon={<DeleteOutlined/>} type="text" danger disabled={isPending}/>
            </Popconfirm>
        </Space>
    </Flex>
    </Card>;
}
