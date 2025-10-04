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
      { id: '1', data: () => ({ categoryId: 'c1', text: 'Q1', authorId: 'u1', authorsAnswer: null }) },
      { id: '2', data: () => ({ categoryId: 'c2', text: 'Q2', authorId: 'u2', authorsAnswer: 'A2' }) },
    ],
  })),
  addDocSpy: vi.fn(async () => ({ id: 'new-id' })),
  getDocSpy: vi.fn(async () => ({ exists: () => true, id: '1', data: () => ({ categoryId: 'c1', text: 'Q1', authorId: 'u1', authorsAnswer: null }) })),
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
import { listQuestions, addQuestion, getQuestion, updateQuestion, deleteQuestion } from './questionsApi.ts';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('questionsApi (unit mocked)', () => {
  it('should list questions', async () => {
    const questions = await listQuestions();
    expect(questions).toEqual([
      { id: '1', categoryId: 'c1', text: 'Q1', authorId: 'u1', authorsAnswer: null },
      { id: '2', categoryId: 'c2', text: 'Q2', authorId: 'u2', authorsAnswer: 'A2' },
    ]);
    expect(hoisted.getDocsSpy).toHaveBeenCalledTimes(1);
  });

  it('should add a question', async () => {
    const newQuestion = { categoryId: 'c3', text: 'Q3', authorId: 'u3', authorsAnswer: null };
    const added = await addQuestion(newQuestion);
    expect(added).toEqual({ id: 'new-id', ...newQuestion });
    expect(hoisted.addDocSpy).toHaveBeenCalledTimes(1);
  });

  it('should get a question', async () => {
    const q = await getQuestion('1');
    expect(q).toEqual({ id: '1', categoryId: 'c1', text: 'Q1', authorId: 'u1', authorsAnswer: null });
    expect(hoisted.getDocSpy).toHaveBeenCalledTimes(1);
  });

  it('should update a question', async () => {
    const res = await updateQuestion('1', { text: 'Updated' });
    expect(hoisted.updateDocSpy).toHaveBeenCalledTimes(1);
    // Our stubbed getDoc returns the original object
    expect(res).toEqual({ id: '1', categoryId: 'c1', text: 'Q1', authorId: 'u1', authorsAnswer: null });
  });

  it('should delete a question', async () => {
    await deleteQuestion('1');
    expect(hoisted.deleteDocSpy).toHaveBeenCalledTimes(1);
  });
});
