import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Category} from "@/features/categories/types.ts";
import {addCategory} from "@/features/categories/api/categoriesApi.ts";
import {enqueueMessage } from "@/redux/uiSlice";
import { useAppDispatch } from "@/redux/hooks.ts";
import { CATEGORY_MESSAGES } from "@/features/categories/messages";
import { Collections } from "@/lib/collections.ts";

type CreateCategoryParams = Omit<Category, "id">;

export default function useCreateCategory() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation<Category, Error, CreateCategoryParams>({
        mutationFn: addCategory,
        onSuccess: async () => {
            dispatch(enqueueMessage({ type: 'success', content: CATEGORY_MESSAGES.create.success }));
            await queryClient.invalidateQueries({ queryKey: [Collections.categories] });
        },
        onError: () => {
            dispatch(enqueueMessage({ type: 'error', content: CATEGORY_MESSAGES.create.error }));
        }
    })
}
