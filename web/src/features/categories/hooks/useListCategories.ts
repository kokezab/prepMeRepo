import {useQuery} from "@tanstack/react-query";
import {Collections} from "@/lib/collections.ts";
import {listCategories} from "@/features/categories/api/categoriesApi.ts";

export default function useListCategories() {
    return useQuery({
        queryKey: [Collections.categories],
        queryFn: listCategories,
    });
}
