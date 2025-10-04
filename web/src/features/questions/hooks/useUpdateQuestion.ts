import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestion, type UpdateQuestionInput } from "@/features/questions/api/questionsApi";
import type { Question } from "@/features/questions/types";
import { Collections } from "@/lib/collections.ts";
import { enqueueMessage } from "@/redux/uiSlice";
import { useAppDispatch } from "@/redux/hooks.ts";
import { QUESTIONS_MESSAGES } from "@/features/questions/messages";

export type UpdateQuestionParams = {
  id: string;
  patch: UpdateQuestionInput;
};

export default function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<Question | null, Error, UpdateQuestionParams>({
    mutationFn: ({ id, patch }) => updateQuestion(id, patch),
    onSuccess: async () => {
      dispatch(enqueueMessage({ type: "success", content: QUESTIONS_MESSAGES.update.success }));
      await queryClient.invalidateQueries({ queryKey: [Collections.questions] });
    },
    onError: () => {
      dispatch(enqueueMessage({ type: "error", content: QUESTIONS_MESSAGES.update.error }));
    },
  });
}
