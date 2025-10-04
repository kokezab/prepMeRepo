import { Button, Card, Flex, Popconfirm, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Question } from "@/features/questions/types";

type Props = {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
};

export default function QuestionListItem({ question, onEdit, onDelete }: Props) {
  return (
    <Card size="small">
      <Flex justify="space-between" align="center">
        <Typography.Text>{question.text}</Typography.Text>
        <Space>
          <Button onClick={onEdit} icon={<EditOutlined />} type="text" />
          <Popconfirm
            title="Delete question"
            description={`Are you sure you want to delete this question?`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={onDelete}
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      </Flex>
    </Card>
  );
}
