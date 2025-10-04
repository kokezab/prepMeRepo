import {HasId} from "@/lib/types.ts";

export type Question = HasId & {
    categoryId: string;
    text: string;
    authorId: string;
    authorsAnswer: string | null;
}

export type CreateQuestionInput = Omit<Question, "id">;
