import {Category} from "@/features/categories/types.ts";
import {Button, Card, Flex, Popconfirm, Space, Typography} from "antd";
import {EditOutlined, DeleteOutlined, TagOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.ts";
import {showUpdateCategory} from "@/features/categories/slice/categoriesSlice.ts";
import useDeleteCategory from "@/features/categories/hooks/useDeleteCategory";
import { getColorFromString } from "@/lib/colors";

export default function CategoryListItem({category}: { category: Category }) {

    const dispatch = useAppDispatch();
    const darkMode = useAppSelector((s) => s.ui.darkMode);
    const {mutate: deleteCategory, isPending} = useDeleteCategory();
    const color = getColorFromString(category.name, darkMode);

    const onEdit = () => {
        dispatch(showUpdateCategory(category));
    }

    const onConfirmDelete = () => {
        deleteCategory(category.id);
    }

    // Dark mode aware background with better contrast
    const bgGradient = darkMode
        ? `linear-gradient(135deg, ${color.bg} 0%, #1e293b 100%)`
        : `linear-gradient(135deg, ${color.bg} 0%, #ffffff 100%)`;

    return (
        <Card
            size='small'
            className="card-hover fade-in"
            style={{
                borderLeft: `4px solid ${color.border}`,
                background: bgGradient,
            }}
        >
            <Flex justify='space-between' align='center'>
                <Space>
                    <TagOutlined style={{ color: color.border, fontSize: '18px' }} />
                    <Typography.Text strong style={{ fontSize: '15px', color: color.text }}>
                        {category.name}
                    </Typography.Text>
                </Space>

                <Space>
                    <Button
                        onClick={onEdit}
                        icon={<EditOutlined/>}
                        type="text"
                        disabled={isPending}
                        style={{ color: '#8b5cf6' }}
                    />
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
        </Card>
    );
}
