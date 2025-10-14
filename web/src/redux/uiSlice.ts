import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UiMessage = {
  type: "success" | "error" | "info" | "warning" | "loading";
  content: string;
  key?: string;
};

export type UiState = {
  messageQueue: UiMessage[];
  guestMode: boolean;
};

const initialState: UiState = {
  messageQueue: [],
  guestMode: false,
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
    enableGuestMode(state) {
      state.guestMode = true;
    },
    disableGuestMode(state) {
      state.guestMode = false;
    },
  },
});

export const { enqueueMessage, dequeueMessage, clearMessages, enableGuestMode, disableGuestMode } = uiSlice.actions;
export default uiSlice.reducer;
