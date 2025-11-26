import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UiMessage = {
  type: "success" | "error" | "info" | "warning" | "loading";
  content: string;
  key?: string;
};

export type UiState = {
  messageQueue: UiMessage[];
  guestMode: boolean;
  darkMode: boolean;
};

// Load dark mode preference from localStorage
const loadDarkModePreference = (): boolean => {
  try {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

const initialState: UiState = {
  messageQueue: [],
  guestMode: false,
  darkMode: loadDarkModePreference(),
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
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      // Persist to localStorage
      try {
        localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
      } catch (error) {
        console.error('Failed to save dark mode preference:', error);
      }
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      // Persist to localStorage
      try {
        localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
      } catch (error) {
        console.error('Failed to save dark mode preference:', error);
      }
    },
  },
});

export const { enqueueMessage, dequeueMessage, clearMessages, enableGuestMode, disableGuestMode, toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
