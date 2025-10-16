export type Question = {
    id: string;
    categoryIds: string[];
    text: string;
    authorId: string;
    authorsAnswer: string | null;
    completedBy?: string[]; // Array of user IDs who marked this as completed
}

export type CreateQuestionInput = Omit<Question, "id">;
