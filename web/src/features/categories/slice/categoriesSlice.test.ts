import reducer, {
    CategoriesSliceState,
    hideAddCategory,
    hideUpdateCategory,
    showAddCategory,
    showUpdateCategory
} from "./categoriesSlice.ts";

const baseState: CategoriesSliceState = {
    isAddCategoryOpen: false,
    categoryToUpdate: null,
}

function extendBaseState(override: Partial<CategoriesSliceState>): CategoriesSliceState {
    return { ...baseState, ...override };
}

describe('categories reducer', () => {
    it('should handle initial state', () => {
        const initialState = reducer(undefined, { type: 'unknown' });
        expect(initialState).toEqual(baseState);
    });

    it('should handle showAddCategory', () => {
        const initialState = extendBaseState({ isAddCategoryOpen: false });
        const nextState = reducer(initialState, showAddCategory());
        expect(nextState).toEqual(extendBaseState({ isAddCategoryOpen: true }));
    });

    it('should handle hideAddCategory', () => {
        const initialState = extendBaseState({ isAddCategoryOpen: true });
        const nextState = reducer(initialState, hideAddCategory());
        expect(nextState).toEqual(extendBaseState({ isAddCategoryOpen: false }));
    });

    it('should handle showUpdateCategory', () => {
        const initialState = extendBaseState({ categoryToUpdate: null });
        const nextState = reducer(initialState, showUpdateCategory({ id: '1', name: 'Category 1' }));
        expect(nextState).toEqual(extendBaseState({ categoryToUpdate: { id: '1', name: 'Category 1' } }));
    });

    it('should handle hideUpdateCategory', () => {
        const initialState = extendBaseState({ categoryToUpdate: { id: '1', name: 'Category 1' } });
        const nextState = reducer(initialState, hideUpdateCategory());
        expect(nextState).toEqual(extendBaseState({ categoryToUpdate: null }));
    })
});
