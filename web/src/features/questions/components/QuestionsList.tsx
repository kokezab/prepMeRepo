import { List } from "antd";
import QuestionListItem from "@/features/questions/components/QuestionListItem.tsx";
import type { Question } from "@/features/questions/types";

type Props = {
  questions: Question[] | undefined;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onView: (q: Question) => void;
  categoryById: Record<string, string>;
  authorDisplayById: Record<string, string>;
  currentUserId: string | null;
  guestMode?: boolean;
};

export default function QuestionsList({ questions, onEdit, onDelete, onView, categoryById, authorDisplayById, currentUserId, guestMode }: Props) {
  return (
    <List<Question>
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={questions}
      rowKey={(item) => item.id}
      renderItem={(q) => (
        <List.Item>
          <QuestionListItem
            question={q}
            onEdit={() => onEdit(q)}
            onDelete={() => onDelete(q.id)}
            onView={() => onView(q)}
            categoryById={categoryById}
            authorDisplayById={authorDisplayById}
            currentUserId={currentUserId}
            guestMode={guestMode}
          />
        </List.Item>
      )}
    />
  );
}
