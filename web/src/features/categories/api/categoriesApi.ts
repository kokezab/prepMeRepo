import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {Category, CreateCategoryInput} from "../types";

const COLLECTION = "categories" as const;

function mapDoc<T extends { id: string }>(snap: any): T {
  const data = snap.data() || {};
  return {
    id: snap.id,
    ...data,
  } as T;
}

export async function listCategories(): Promise<Category[]> {
  const colRef = collection(db, COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => mapDoc<Category>(d));
}

export async function getCategory(id: string): Promise<Category | null> {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return mapDoc<Category>(snapshot);
}

export async function addCategory(input: CreateCategoryInput): Promise<Category> {
  const colRef = collection(db, COLLECTION);
  const newDoc = await addDoc(colRef, input);
  return { id: newDoc.id, ...input };
}

export type UpdateCategoryInput = Partial<Omit<Category, "id">>;

export async function updateCategory(
  id: string,
  patch: UpdateCategoryInput
): Promise<Category | null> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, patch as any);
  const updated = await getDoc(docRef);
  if (!updated.exists()) return null;
  return mapDoc<Category>(updated);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
