import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateCategory, type UpdateCategoryInput} from "@/features/categories/api/categoriesApi";
import type {Category} from "@/features/categories/types";
import {Collections} from "@/lib/collections.ts";
import {enqueueMessage} from "@/redux/uiSlice";
import {useAppDispatch} from "@/redux/hooks.ts";
import {CATEGORY_MESSAGES} from "@/features/categories/messages";

export type UpdateCategoryParams = {
  id: string;
  patch: UpdateCategoryInput;
};

export default function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<Category | null, Error, UpdateCategoryParams>({
    mutationFn: ({ id, patch }) => updateCategory(id, patch),
    onSuccess: async () => {
      dispatch(enqueueMessage({ type: 'success', content: CATEGORY_MESSAGES.update.success }));
      await queryClient.invalidateQueries({ queryKey: [Collections.categories] });
    },
    onError: () => {
      dispatch(enqueueMessage({ type: 'error', content: CATEGORY_MESSAGES.update.error }));
    },
  });
}
