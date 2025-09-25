import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteCategory} from "@/features/categories/api/categoriesApi";
import {Collections} from "@/lib/collections";
import {enqueueMessage} from "@/redux/uiSlice";
import {useAppDispatch} from "@/redux/hooks.ts";
import {CATEGORY_MESSAGES} from "@/features/categories/messages";

export default function useDeleteCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      dispatch(enqueueMessage({ type: 'success', content: CATEGORY_MESSAGES.delete.success }));
      await queryClient.invalidateQueries({ queryKey: [Collections.categories] });
    },
    onError: () => {
      dispatch(enqueueMessage({ type: 'error', content: CATEGORY_MESSAGES.delete.error }));
    }
  });
}
