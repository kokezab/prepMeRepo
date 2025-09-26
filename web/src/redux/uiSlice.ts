import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UiMessage = {
  type: "success" | "error" | "info" | "warning" | "loading";
  content: string;
  key?: string;
};

export type UiState = {
  messageQueue: UiMessage[];
};

const initialState: UiState = {
  messageQueue: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    enqueueMessage(state, action: PayloadAction<UiMessage>) {
      state.messageQueue.push(action.payload);
    },
    dequeueMessage(state) {
      state.messageQueue.shift();
    },
    clearMessages(state) {
      state.messageQueue = [];
    },
  },
});

export const { enqueueMessage, dequeueMessage, clearMessages } = uiSlice.actions;
export default uiSlice.reducer;
