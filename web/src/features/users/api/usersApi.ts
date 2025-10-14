import { Collections } from "@/lib/collections.ts";
import { listDocs, setDocById } from "@/lib/firestoreCrud";
import type { AppUser, CreateUserInput } from "@/features/users/types";

const COLLECTION = Collections.users;

export async function listUsers(): Promise<AppUser[]> {
  return listDocs<AppUser>(COLLECTION);
}

export async function upsertUser(id: string, input: CreateUserInput): Promise<AppUser> {
  return setDocById<CreateUserInput>(COLLECTION, id, input);
}
