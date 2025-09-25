import { addCategory, listCategories } from "./features/categories/api/categoriesApi.ts";

export default function App() {

    const onClick = () => {
        listCategories()
            .then((categories) => {
                console.log("Categories:", categories);
            })
            .catch((err) => {
                console.error("Failed to list categories:", err);
            });

        addCategory({ name: "New Category" })
            .then((category) => {
                console.log("Added category:", category);
            })
            .catch((err) => {
                console.error("Failed to add category:", err);
            });

    }

    return <div>Hello
    <button onClick={onClick}>ASda</button>
    </div>
}
