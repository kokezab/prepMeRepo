export type Question = {
    id: string;
    categoryIds: string[];
    text: string;
    authorId: string;
    authorsAnswer: string | null;
}

export type CreateQuestionInput = Omit<Question, "id">;
