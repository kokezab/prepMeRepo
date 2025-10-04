import { Collections } from "@/lib/collections.ts";
import type {Category, CreateCategoryInput} from "../types";

const COLLECTION = Collections.categories;

import {
  listDocs,
  getDocById,
  addDocTo,
  updateDocById,
  deleteDocById,
} from "@/lib/firestoreCrud";

export async function listCategories(): Promise<Category[]> {
  return listDocs<Category>(COLLECTION);
}

export async function getCategory(id: string): Promise<Category | null> {
  return getDocById<Category>(COLLECTION, id);
}

export async function addCategory(input: CreateCategoryInput): Promise<Category> {
  return addDocTo<CreateCategoryInput>(COLLECTION, input);
}

export type UpdateCategoryInput = Partial<Omit<Category, "id">>;

export async function updateCategory(
  id: string,
  patch: UpdateCategoryInput
): Promise<Category | null> {
  return updateDocById<Category>(COLLECTION, id, patch as any);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDocById(COLLECTION, id);
}

