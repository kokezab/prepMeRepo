import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuestion } from "@/features/questions/api/questionsApi";
import { Collections } from "@/lib/collections";
import { enqueueMessage } from "@/redux/uiSlice";
import { useAppDispatch } from "@/redux/hooks.ts";
import { QUESTIONS_MESSAGES } from "@/features/questions/messages";

export default function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: async () => {
      dispatch(enqueueMessage({ type: "success", content: QUESTIONS_MESSAGES.delete.success }));
      await queryClient.invalidateQueries({ queryKey: [Collections.questions] });
    },
    onError: () => {
      dispatch(enqueueMessage({ type: "error", content: QUESTIONS_MESSAGES.delete.error }));
    },
  });
}
