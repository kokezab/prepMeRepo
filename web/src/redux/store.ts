import { configureStore } from '@reduxjs/toolkit'
import categories from "../features/categories/slice/categoriesSlice.ts";
import ui from "./uiSlice";

export const store = configureStore({
    reducer: {
        categories,
        ui,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
