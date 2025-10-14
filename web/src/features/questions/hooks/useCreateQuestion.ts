import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Question } from "@/features/questions/types.ts";
import { addQuestion } from "@/features/questions/api/questionsApi.ts";
import { enqueueMessage } from "@/redux/uiSlice";
import { useAppDispatch } from "@/redux/hooks.ts";
import { QUESTIONS_MESSAGES } from "@/features/questions/messages";
import { Collections } from "@/lib/collections.ts";

export type CreateQuestionParams = Omit<Question, "id">;

export default function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<Question, Error, CreateQuestionParams>({
    mutationFn: addQuestion,
    onSuccess: async () => {
      dispatch(enqueueMessage({ type: "success", content: QUESTIONS_MESSAGES.create.success }));
      await queryClient.invalidateQueries({ queryKey: [Collections.questions] });
    },
    onError: () => {
      dispatch(enqueueMessage({ type: "error", content: QUESTIONS_MESSAGES.create.error }));
    },
  });
}
