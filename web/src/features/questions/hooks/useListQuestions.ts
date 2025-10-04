import { useQuery } from "@tanstack/react-query";
import { Collections } from "@/lib/collections.ts";
import { listQuestions } from "@/features/questions/api/questionsApi.ts";

export default function useListQuestions() {
  return useQuery({
    queryKey: [Collections.questions],
    queryFn: listQuestions,
  });
}
