import { useEffect, useMemo, useState } from "react";
import { Button, Grid, Input, Select, Space, Typography } from "antd";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useListQuestions from "@/features/questions/hooks/useListQuestions";
import useDeleteQuestion from "@/features/questions/hooks/useDeleteQuestion";
import useUpdateQuestion from "@/features/questions/hooks/useUpdateQuestion";
import QuestionsList from "@/features/questions/components/QuestionsList";
import CreateQuestionModal from "@/features/questions/components/CreateQuestionModal";
import UpdateQuestionModal from "@/features/questions/components/UpdateQuestionModal";
import ViewQuestionModal from "@/features/questions/components/ViewQuestionModal";
import AuthorsAnswerDrawer from "@/features/questions/components/AuthorsAnswerDrawer";
import type { Question } from "@/features/questions/types";
import {useAppDispatch} from "@/redux/hooks";
import {showAddQuestion, showUpdateQuestion, showViewQuestion} from "@/features/questions/slice/questionsSlice";
import useListUsers from "@/features/users/hooks/useListUsers";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useAppSelector } from "@/redux/hooks";

export default function QuestionsManagementPage() {
  const dispatch = useAppDispatch();
  const { user } = useFirebaseUser();
  const guestMode = useAppSelector((s) => s.ui.guestMode);
  const currentUserId = user?.uid ?? null;
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
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
  const [filterCompleted, setFilterCompleted] = useState<string>(""); // "all", "completed", "not-completed"

  // Drawer state
  const [drawerQuestion, setDrawerQuestion] = useState<Question | null>(null);

  // Keyboard shortcut: '+' to open Create Question
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = !!target && (target.isContentEditable || !!target.closest('.ant-select'));
      const isTypingContext = tag === 'input' || tag === 'textarea' || isEditable;
      if (isTypingContext) return;
      if (!guestMode && (e.key === '+' || (e.key === '=' && e.shiftKey))) {
        e.preventDefault();
        dispatch(showAddQuestion());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, guestMode]);

  const deleteMutation = useDeleteQuestion();
  const updateMutation = useUpdateQuestion();
  const { data: questions, isLoading: loadingQuestions } = useListQuestions();

  const openEdit = (q: { id: string; text: string; categoryIds: string[]; authorsAnswer: string | null }) => {
    if (guestMode) return;
    dispatch(showUpdateQuestion(q as Question));
  };

  const handleDelete = (id: string) => {
    if (guestMode) return;
    deleteMutation.mutate(id);
  };

  const handleToggleCompleted = (q: Question) => {
    if (guestMode || !currentUserId) return;
    const completedBy = q.completedBy || [];
    const isCompleted = completedBy.includes(currentUserId);
    const updatedCompletedBy = isCompleted
      ? completedBy.filter(id => id !== currentUserId)
      : [...completedBy, currentUserId];
    updateMutation.mutate({ id: q.id, patch: { completedBy: updatedCompletedBy } });
  };

  const handleQuickViewAnswer = (q: Question) => {
    setDrawerQuestion(q);
  };

  return (
    <div>
      <Space
        style={{ marginBottom: 16, display: "flex" }}
        align={isMobile ? 'start' : 'center'}
        direction={isMobile ? 'vertical' : 'horizontal'}
        wrap
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Questions Management
        </Typography.Title>
        {!guestMode && (
          <Button type="primary" onClick={() => dispatch(showAddQuestion())}>Create Question</Button>
        )}
        <CreateQuestionModal />
      </Space>

      <div>
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%' }} wrap direction={isMobile ? 'vertical' : 'horizontal'}>
          <Select
            mode="multiple"
            allowClear
            style={{ minWidth: isMobile ? undefined : 260, width: isMobile ? '100%' : undefined }}
            placeholder="Filter by categories"
            options={categoryOptions}
            value={filterCategoryIds}
            onChange={(vals) => setFilterCategoryIds(vals)}
          />
          <Input.Search
            allowClear
            placeholder="Filter by question text"
            style={{ minWidth: isMobile ? undefined : 260, width: isMobile ? '100%' : undefined }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Input.Search
            allowClear
            placeholder="Filter by author name/email"
            style={{ minWidth: isMobile ? undefined : 260, width: isMobile ? '100%' : undefined }}
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          />
          <Select
            allowClear
            style={{ minWidth: isMobile ? undefined : 200, width: isMobile ? '100%' : undefined }}
            placeholder="Filter by completion status"
            options={[
              { label: "All", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "Not Completed", value: "not-completed" },
            ]}
            value={filterCompleted || undefined}
            onChange={(val) => setFilterCompleted(val || "")}
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
              const matchesCompleted = filterCompleted
                ? (() => {
                    const isCompleted = currentUserId ? q.completedBy?.includes(currentUserId) : false;
                    if (filterCompleted === "completed") return isCompleted;
                    if (filterCompleted === "not-completed") return !isCompleted;
                    return true; // "all"
                  })()
                : true;
              return matchesText && matchesCategories && matchesAuthor && matchesCompleted;
            })}
            onEdit={(q) => openEdit(q)}
            onDelete={(id) => handleDelete(id)}
            onView={(q) => dispatch(showViewQuestion(q))}
            onToggleCompleted={(q) => handleToggleCompleted(q)}
            onQuickViewAnswer={(q) => handleQuickViewAnswer(q)}
            categoryById={categoryById}
            authorDisplayById={authorDisplayById}
            currentUserId={currentUserId}
            guestMode={guestMode}
          />
        )}
      </div>
      <UpdateQuestionModal />
      <ViewQuestionModal />
      <AuthorsAnswerDrawer 
        question={drawerQuestion}
        open={!!drawerQuestion}
        onClose={() => setDrawerQuestion(null)}
        categoryById={categoryById}
        authorDisplayById={authorDisplayById}
      />
    </div>
  );
}
