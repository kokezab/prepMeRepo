import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm.tsx";
import CategoriesList from "@/features/categories/components/CategoriesList.tsx";
import UpdateCategoryModal from "@/features/categories/components/UpdateCategoryModal.tsx";

export default function CategoriesManagementPage() {
    return <div>Categories Management Page
        <CreateCategoryForm />
        <CategoriesList />
        <UpdateCategoryModal />
    </div>
}
