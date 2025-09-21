import reducer from "./categoriesSlice";

describe('categories reducer', () => {
    it('should handle initial state', () => {
        const initialState = reducer(undefined, { type: 'unknown' });
        expect(initialState).toEqual({
            isAddCategoryOpen: false,
        });
    });
});
