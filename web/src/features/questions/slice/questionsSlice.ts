import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Question } from "@/features/questions/types";
import type { RootState } from "@/redux/store";

export type QuestionsSliceState = {
  isAddQuestionOpen: boolean;
  questionToUpdate: Question | null;
  questionToView: Question | null;
};

const initialState: QuestionsSliceState = {
  isAddQuestionOpen: false,
  questionToUpdate: null,
  questionToView: null,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    showAddQuestion(state) {
      state.isAddQuestionOpen = true;
    },
    hideAddQuestion(state) {
      state.isAddQuestionOpen = false;
    },
    showUpdateQuestion(state, action: PayloadAction<Question>) {
      state.questionToUpdate = action.payload;
    },
    hideUpdateQuestion(state) {
      state.questionToUpdate = null;
    },
    showViewQuestion(state, action: PayloadAction<Question>) {
      state.questionToView = action.payload;
    },
    hideViewQuestion(state) {
      state.questionToView = null;
    },
  },
});

export const {
  showAddQuestion,
  hideAddQuestion,
  showUpdateQuestion,
  hideUpdateQuestion,
  showViewQuestion,
  hideViewQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;

export const selectIsAddQuestionOpen = (state: RootState) => state.questions.isAddQuestionOpen;
export const selectQuestionToUpdate = (state: RootState) => state.questions.questionToUpdate;
export const selectQuestionToView = (state: RootState) => state.questions.questionToView;
