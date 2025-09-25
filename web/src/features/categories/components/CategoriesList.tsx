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

    return <div>Categories List

        <List<Category>
            pagination
            dataSource={categories}
            rowKey={item => item.id}
            renderItem={renderItem}
        />
    </div>
}
