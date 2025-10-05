import { useMemo, useState } from "react";
import { Button, Input, Select, Space, Typography } from "antd";
import useListCategories from "@/features/categories/hooks/useListCategories";
import useListQuestions from "@/features/questions/hooks/useListQuestions";
import useDeleteQuestion from "@/features/questions/hooks/useDeleteQuestion";
import QuestionsList from "@/features/questions/components/QuestionsList";
import CreateQuestionModal from "@/features/questions/components/CreateQuestionModal";
import UpdateQuestionModal from "@/features/questions/components/UpdateQuestionModal";
import type { Question } from "@/features/questions/types";
import {useAppDispatch} from "@/redux/hooks";
import {showAddQuestion, showUpdateQuestion} from "@/features/questions/slice/questionsSlice";

export default function QuestionsManagementPage() {
  const dispatch = useAppDispatch();
  const { data: categoriesData } = useListCategories();
  const categoryOptions = useMemo(
    () => (categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData]
  );

  // Filters
  const [filterCategoryIds, setFilterCategoryIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState<string>("");

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
              return matchesText && matchesCategories;
            })}
            onEdit={(q) => openEdit(q)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </div>
      <UpdateQuestionModal />
    </div>
  );
}
