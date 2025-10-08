 import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Space, Typography } from "antd";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useListQuestions from "@/features/questions/hooks/useListQuestions";
import useDeleteQuestion from "@/features/questions/hooks/useDeleteQuestion";
import QuestionsList from "@/features/questions/components/QuestionsList";
import CreateQuestionModal from "@/features/questions/components/CreateQuestionModal";
import UpdateQuestionModal from "@/features/questions/components/UpdateQuestionModal";
import ViewQuestionModal from "@/features/questions/components/ViewQuestionModal";
import type { Question } from "@/features/questions/types";
import {useAppDispatch} from "@/redux/hooks";
import {showAddQuestion, showUpdateQuestion, showViewQuestion} from "@/features/questions/slice/questionsSlice";
import useListUsers from "@/features/users/hooks/useListUsers";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

export default function QuestionsManagementPage() {
  const dispatch = useAppDispatch();
  const { user } = useFirebaseUser();
  const currentUserId = user?.uid ?? null;
  const { data: categoriesData } = useListCategories();
  const categoryOptions = useMemo(
    () => (categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData]
  );
  const categoryById = useMemo(
    () => Object.fromEntries((categoriesData || []).map((c) => [c.id, c.name])),
    [categoriesData]
  );
  const { data: usersData } = useListUsers();
  const authorById = useMemo(
    () => Object.fromEntries((usersData || []).map((u) => [u.id, { name: u.name ?? '', email: u.email ?? '' }])),
    [usersData]
  );
  const authorDisplayById = useMemo(
    () => Object.fromEntries(
      Object.entries(authorById).map(([id, a]) => [id, a.name || a.email || 'Unknown author'])
    ),
    [authorById]
  );

  // Filters
  const [filterCategoryIds, setFilterCategoryIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [filterAuthor, setFilterAuthor] = useState<string>("");

  // Keyboard shortcut: '+' to open Create Question
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = !!target && (target.isContentEditable || !!target.closest('.ant-select'));
      const isTypingContext = tag === 'input' || tag === 'textarea' || isEditable;
      if (isTypingContext) return;
      if (e.key === '+' || (e.key === '=' && e.shiftKey)) {
        e.preventDefault();
        dispatch(showAddQuestion());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);

  const deleteMutation = useDeleteQuestion();
  const { data: questions, isLoading: loadingQuestions } = useListQuestions();

  const openEdit = (q: { id: string; text: string; categoryIds: string[]; authorsAnswer: string | null }) => {
    dispatch(showUpdateQuestion(q as Question));
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Questions Management
        </Typography.Title>
        <Button type="primary" onClick={() => dispatch(showAddQuestion())}>Create Question</Button>
        <CreateQuestionModal />
      </Space>

      <div>
        {/* Filters */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            mode="multiple"
            allowClear
            style={{ minWidth: 260 }}
            placeholder="Filter by categories"
            options={categoryOptions}
            value={filterCategoryIds}
            onChange={(vals) => setFilterCategoryIds(vals)}
          />
          <Input.Search
            allowClear
            placeholder="Filter by question text"
            style={{ minWidth: 260 }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Input.Search
            allowClear
            placeholder="Filter by author name/email"
            style={{ minWidth: 260 }}
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          />
        </Space>

        {loadingQuestions ? (
          <Typography.Text>Loading questions...</Typography.Text>
        ) : (
          <QuestionsList
            questions={(questions || []).filter((q) => {
              const matchesText = filterText
                ? q.text.toLowerCase().includes(filterText.toLowerCase())
                : true;
              const matchesCategories = filterCategoryIds.length
                ? q.categoryIds?.some((id) => filterCategoryIds.includes(id))
                : true;
              const matchesAuthor = filterAuthor
                ? (() => {
                    const a = authorById[q.authorId];
                    const term = filterAuthor.toLowerCase();
                    return a ? (a.name?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term)) : false;
                  })()
                : true;
              return matchesText && matchesCategories && matchesAuthor;
            })}
            onEdit={(q) => openEdit(q)}
            onDelete={(id) => handleDelete(id)}
            onView={(q) => dispatch(showViewQuestion(q))}
            categoryById={categoryById}
            authorDisplayById={authorDisplayById}
            currentUserId={currentUserId}
          />
        )}
      </div>
      <UpdateQuestionModal />
      <ViewQuestionModal />
    </div>
  );
}
