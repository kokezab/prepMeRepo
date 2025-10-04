import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {HasId} from "@/lib/types.ts";

export function mapDoc<T extends HasId>(snap: any): T {
  const data = snap.data() || {};
  return {
    id: snap.id,
    ...data,
  } as T;
}

export async function listDocs<T>(collectionName: string): Promise<(T & HasId)[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => mapDoc<T & HasId>(d));
}

export async function getDocById<T>(collectionName: string, id: string): Promise<(T & HasId) | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return mapDoc<T & HasId>(snapshot);
}

export async function addDocTo<TInput extends object>(collectionName: string, input: TInput): Promise<HasId & TInput> {
  const colRef = collection(db, collectionName);
  const newDoc = await addDoc(colRef, input);
  return { id: newDoc.id, ...(input as TInput) } as HasId & TInput;
}

export type UpdateInput<T extends HasId> = Partial<Omit<T, "id">>;

export async function updateDocById<T extends HasId>(
  collectionName: string,
  id: string,
  patch: UpdateInput<T>
): Promise<T | null> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, patch as any);
  const updated = await getDoc(docRef);
  if (!updated.exists()) return null;
  return mapDoc<T>(updated);
}

export async function deleteDocById(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
