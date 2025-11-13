import { useState, useMemo } from 'react';
import {
  Button,
  Card,
  Checkbox,
  InputNumber,
  Space,
  Typography,
  Spin,
  Alert,
  Collapse,
  Progress,
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import useListCategories from '@/features/categories/hooks/useListCategories';
import useListQuestions from '@/features/questions/hooks/useListQuestions';
import type { Question } from '@/features/questions/types';

const { Title, Text, Paragraph } = Typography;

type InterviewState = 'setup' | 'interview' | 'summary';

export default function MockInterviewPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useListCategories();
  const { data: questions = [], isLoading: questionsLoading } = useListQuestions();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [state, setState] = useState<InterviewState>('setup');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [expandedAnswers, setExpandedAnswers] = useState<string[]>([]);

  const isLoading = categoriesLoading || questionsLoading;

  // Filter questions by selected categories
  const availableQuestions = useMemo(() => {
    if (selectedCategoryIds.length === 0) return questions;
    return questions.filter((q) =>
      q.categoryIds.some((catId) => selectedCategoryIds.includes(catId))
    );
  }, [questions, selectedCategoryIds]);

  const handleGenerateInterview = () => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    // Randomly select questions
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (selected.length === 0) {
      return;
    }

    setSelectedQuestions(selected);
    setCurrentQuestionIndex(0);
    setState('interview');
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to summary
      setState('summary');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartOver = () => {
    setState('setup');
    setSelectedQuestions([]);
    setCurrentQuestionIndex(0);
    setExpandedAnswers([]);
  };

  const toggleAllAnswers = () => {
    if (expandedAnswers.length === selectedQuestions.length) {
      setExpandedAnswers([]);
    } else {
      setExpandedAnswers(selectedQuestions.map((q) => q.id));
    }
  };

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-400">
        <Spin size="large" />
      </div>
    );
  }

  // Setup View
  if (state === 'setup') {
    return (
      <div className="max-w-800 mx-auto">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>Mock Interview Setup</Title>
              <Paragraph>
                Select one or more categories and choose how many questions you'd like to practice.
              </Paragraph>
            </div>

            <div>
              <Title level={4}>Select Categories</Title>
              <Checkbox.Group
                value={selectedCategoryIds}
                onChange={(values) => setSelectedCategoryIds(values as string[])}
                style={{ width: '100%' }}
              >
                <Space direction="vertical">
                  {categories.map((category) => (
                    <Checkbox key={category.id} value={category.id}>
                      {category.name}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
              {categories.length === 0 && (
                <Alert
                  message="No categories available"
                  description="Please add some categories first."
                  type="info"
                  showIcon
                />
              )}
            </div>

            <div>
              <Title level={4}>Number of Questions</Title>
              <InputNumber
                min={1}
                max={availableQuestions.length || 100}
                value={questionCount}
                onChange={(value) => setQuestionCount(value || 1)}
                style={{ width: 200 }}
              />
              {selectedCategoryIds.length > 0 && (
                <Text type="secondary" style={{ marginLeft: 16 }}>
                  {availableQuestions.length} questions available in selected categories
                </Text>
              )}
            </div>

            {selectedCategoryIds.length === 0 && (
              <Alert
                message="Please select at least one category"
                type="warning"
                showIcon
              />
            )}

            {selectedCategoryIds.length > 0 && availableQuestions.length === 0 && (
              <Alert
                message="No questions available in selected categories"
                description="Please add questions to the selected categories first."
                type="warning"
                showIcon
              />
            )}

            <Button
              type="primary"
              size="large"
              onClick={handleGenerateInterview}
              disabled={
                selectedCategoryIds.length === 0 ||
                availableQuestions.length === 0
              }
              block
            >
              Generate Interview
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  // Interview View
  if (state === 'interview') {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

    return (
      <div className="max-w-800 mx-auto">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <div className="flex justify-between items-center mb-16">
                <Title level={4} style={{ margin: 0 }}>
                  Question {currentQuestionIndex + 1} of {selectedQuestions.length}
                </Title>
                <Button onClick={handleStartOver}>Start Over</Button>
              </div>
              <Progress percent={Math.round(progress)} showInfo={false} />
            </div>

            <Card>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text type="secondary">
                  Categories: {getCategoryNames(currentQuestion.categoryIds)}
                </Text>
                <Title level={3} style={{ margin: 0 }}>
                  {currentQuestion.text}
                </Title>
              </Space>
            </Card>

            <div className="flex justify-between">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                iconPosition="end"
              >
                {currentQuestionIndex === selectedQuestions.length - 1
                  ? 'Finish Interview'
                  : 'Next'}
              </Button>
            </div>
          </Space>
        </Card>
      </div>
    );
  }

  // Summary View
  if (state === 'summary') {
    return (
      <div className="max-w-1000 mx-auto">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>Interview Complete!</Title>
              <Paragraph>
                You've completed all {selectedQuestions.length} questions. Review the questions and
                author answers below.
              </Paragraph>
            </div>

            <div className="flex justify-between">
              <Button onClick={handleStartOver}>Start New Interview</Button>
              <Button type="primary" onClick={toggleAllAnswers}>
                {expandedAnswers.length === selectedQuestions.length
                  ? 'Collapse All Answers'
                  : 'Expand All Answers'}
              </Button>
            </div>

            <Collapse
              activeKey={expandedAnswers}
              onChange={(keys) => setExpandedAnswers(keys as string[])}
              accordion={false}
              items={selectedQuestions.map((question, index) => ({
                key: question.id,
                label: (
                  <div>
                    <Text strong>
                      Question {index + 1}: {question.text}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Categories: {getCategoryNames(question.categoryIds)}
                    </Text>
                  </div>
                ),
                children: (
                  <div>
                    <Title level={5}>Author's Answer:</Title>
                    {question.authorsAnswer ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: question.authorsAnswer }}
                        style={{
                          padding: '12px',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <Text type="secondary">No answer provided</Text>
                    )}
                  </div>
                ),
              }))}
            />
          </Space>
        </Card>
      </div>
    );
  }

  return null;
}
