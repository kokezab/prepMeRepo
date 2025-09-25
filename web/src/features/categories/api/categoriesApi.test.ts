import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Firebase modules BEFORE importing the SUT
vi.mock('../../../firebase.ts', () => {
  return {
    db: {} as any,
  };
});

// Define spies in a hoisted scope so they are available when the mock factory runs
const hoisted = vi.hoisted(() => ({
  getDocsSpy: vi.fn(async () => ({
    docs: [
      { id: '1', data: () => ({ name: 'Cat A' }) },
      { id: '2', data: () => ({ name: 'Cat B' }) },
    ],
  })),
  addDocSpy: vi.fn(async () => ({ id: 'new-id' })),
  getDocSpy: vi.fn(async () => ({ exists: () => true, id: '1', data: () => ({ name: 'Cat A' }) })),
  updateDocSpy: vi.fn(async () => {}),
  deleteDocSpy: vi.fn(async () => {}),
}));

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => ({} as any)),
    doc: vi.fn(() => ({} as any)),
    getDocs: hoisted.getDocsSpy,
    addDoc: hoisted.addDocSpy,
    getDoc: hoisted.getDocSpy,
    updateDoc: hoisted.updateDocSpy,
    deleteDoc: hoisted.deleteDocSpy,
    // Provide initializeFirestore so if the real firebase.ts is ever imported by mistake, it won't crash
    initializeFirestore: vi.fn((_app: unknown, _opts?: unknown) => ({} as any)),
  };
});

// Import SUT after mocks are set up
import { listCategories, addCategory, getCategory, updateCategory, deleteCategory } from './categoriesApi.ts';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('categoriesApi (unit mocked)', () => {
  it('should list categories', async () => {
    const categories = await listCategories();
    expect(categories).toEqual([
      { id: '1', name: 'Cat A' },
      { id: '2', name: 'Cat B' },
    ]);
    expect(hoisted.getDocsSpy).toHaveBeenCalledTimes(1);
  });

  it('should add a category', async () => {
    const newCategory = { name: 'Test Category' };
    const addedCategory = await addCategory(newCategory);
    expect(addedCategory).toEqual({ id: 'new-id', name: 'Test Category' });
    expect(hoisted.addDocSpy).toHaveBeenCalledTimes(1);
  });

  it('should get a category', async () => {
    const cat = await getCategory('1');
    expect(cat).toEqual({ id: '1', name: 'Cat A' });
    expect(hoisted.getDocSpy).toHaveBeenCalledTimes(1);
  });

  it('should update a category', async () => {
    const res = await updateCategory('1', { name: 'Updated' });
    expect(hoisted.updateDocSpy).toHaveBeenCalledTimes(1);
    // Our stubbed getDoc returns Cat A; update path returns the fetched doc
    expect(res).toEqual({ id: '1', name: 'Cat A' });
  });

  it('should delete a category', async () => {
    await deleteCategory('1');
    expect(hoisted.deleteDocSpy).toHaveBeenCalledTimes(1);
  });
});
