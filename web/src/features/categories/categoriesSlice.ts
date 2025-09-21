import {createSlice} from "@reduxjs/toolkit";

export type CategoriesSliceState = {
    isAddCategoryOpen: boolean;
}

const initialState: CategoriesSliceState = {
    isAddCategoryOpen: false,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
    },
});

export default categoriesSlice.reducer;
