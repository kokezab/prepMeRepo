import {createSlice} from "@reduxjs/toolkit";
import type { Category } from "../types";
import {RootState} from "@/redux/store.ts";

export type CategoriesSliceState = {
    isAddCategoryOpen: boolean;
    categoryToUpdate: Category | null
}

const initialState: CategoriesSliceState = {
    isAddCategoryOpen: false,
    categoryToUpdate: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        showAddCategory(state) {
            state.isAddCategoryOpen = true;
        },
        hideAddCategory(state) {
            state.isAddCategoryOpen = false;
        },
        showUpdateCategory(state, action) {
            state.categoryToUpdate = action.payload;
        },
        hideUpdateCategory(state) {
            state.categoryToUpdate = null;
        }
    },
});

export const {showAddCategory, hideAddCategory, showUpdateCategory, hideUpdateCategory} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectCategoryToUpdate = (state: RootState) => state.categories.categoryToUpdate;
