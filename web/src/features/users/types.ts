export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
};

export type CreateUserInput = Omit<AppUser, "id">;
