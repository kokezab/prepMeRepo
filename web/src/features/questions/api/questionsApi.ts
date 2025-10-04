import { Collections } from "@/lib/collections.ts";
import {
  addDocTo,
  deleteDocById,
  getDocById,
  listDocs,
  updateDocById,
} from "@/lib/firestoreCrud";
import type { CreateQuestionInput, Question } from "../types";

const COLLECTION = Collections.questions;

export async function listQuestions(): Promise<Question[]> {
  return listDocs<Question>(COLLECTION);
}

export async function getQuestion(id: string): Promise<Question | null> {
  return getDocById<Question>(COLLECTION, id);
}

export async function addQuestion(input: CreateQuestionInput): Promise<Question> {
  return addDocTo<CreateQuestionInput>(COLLECTION, input);
}

export type UpdateQuestionInput = Partial<Omit<Question, "id">>;

export async function updateQuestion(
  id: string,
  patch: UpdateQuestionInput
): Promise<Question | null> {
  return updateDocById<Question>(COLLECTION, id, patch as any);
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDocById(COLLECTION, id);
}

