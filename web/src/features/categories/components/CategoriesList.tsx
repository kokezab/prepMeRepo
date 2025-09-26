import useListCategories from "@/features/categories/hooks/useListCategories.ts";
import {List} from "antd";
import {Category} from "@/features/categories/types.ts";
import CategoryListItem from "@/features/categories/components/CategoryListItem.tsx";

const renderItem = (category: Category) => (
    <List.Item>
        <CategoryListItem category={category}/>
    </List.Item>
);

export default function CategoriesList() {
    const {data: categories} = useListCategories();

    return <List<Category>
        grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
        }}
        dataSource={categories}
        rowKey={item => item.id}
        renderItem={renderItem}
    />
}
