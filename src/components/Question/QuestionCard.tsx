import React, { useState } from 'react';
import type { Question, QuestionType } from '@/types';

interface QuestionCardProps {
  question: Question;
  index?: number;
  showAnswer?: boolean;
  userAnswer?: string | string[];
  onAnswer?: (answer: string | string[]) => void;
  onSubmit?: () => void;
  showSubmit?: boolean;
  mode?: 'practice' | 'exam' | 'review';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  showAnswer = false,
  userAnswer,
  onAnswer,
  onSubmit,
  showSubmit = false,
  mode = 'practice',
}) => {
  const [selected, setSelected] = useState<string[]>(() => {
    if (userAnswer) {
      return Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    }
    return [];
  });
  const [subjectiveAnswer, setSubjectiveAnswer] = useState<string>(
    typeof userAnswer === 'string' && !Array.isArray(userAnswer) ? userAnswer : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(showAnswer);

  const handleSelect = (option: string) => {
    if (isSubmitted || mode === 'review') return;

    let newSelected: string[];
    if (question.type === 'multiple') {
      if (selected.includes(option)) {
        newSelected = selected.filter((s) => s !== option);
      } else {
        newSelected = [...selected, option];
      }
    } else {
      newSelected = [option];
    }

    setSelected(newSelected);
    if (onAnswer) {
      if (question.type === 'multiple') {
        onAnswer(newSelected);
      } else {
        onAnswer(option);
      }
    }
  };

  const handleJudge = (value: string) => {
    if (isSubmitted || mode === 'review') return;
    setSelected([value]);
    if (onAnswer) {
      onAnswer(value);
    }
  };

  const handleSubmit = () => {
    if (question.type === 'subjective') {
      if (onAnswer) {
        onAnswer(subjectiveAnswer);
      }
    }
    setIsSubmitted(true);
    if (onSubmit) {
      onSubmit();
    }
  };

  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const isOptionCorrect = (option: string): boolean => {
    if (!isSubmitted) return false;
    if (Array.isArray(question.answer)) {
      return question.answer.includes(option);
    }
    return question.answer === option;
  };

  const isOptionSelected = (option: string): boolean => {
    return selected.includes(option);
  };

  const getOptionClass = (option: string): string => {
    const base =
      'w-full p-3 text-left border-2 rounded-lg transition-all duration-200 ';
    
    if (isSubmitted) {
      if (isOptionCorrect(option)) {
        return base + 'border-success bg-green-50 text-success';
      }
      if (isOptionSelected(option) && !isOptionCorrect(option)) {
        return base + 'border-danger bg-red-50 text-danger';
      }
      return base + 'border-border bg-white text-text-secondary';
    }

    if (isOptionSelected(option)) {
      return base + 'border-primary bg-primary/5 text-primary';
    }

    return base + 'border-border bg-white text-text-primary hover:border-primary/50';
  };

  const renderQuestionType = (type: QuestionType): string => {
    const typeMap: Record<QuestionType, string> = {
      single: '单选题',
      multiple: '多选题',
      judge: '判断题',
      subjective: '主观题',
    };
    return typeMap[type];
  };

  const getDifficultyColor = (): string => {
    const map = {
      easy: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      hard: 'text-red-600 bg-red-50',
    };
    return map[question.difficulty];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          {index !== undefined && (
            <span className="text-sm font-medium text-text-secondary">
              第{index + 1}题
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor()}`}>
            {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary">
            {renderQuestionType(question.type)}
          </span>
          <span className="text-xs text-text-tertiary ml-auto">
            {question.score}分
          </span>
        </div>
        <p className="text-text-primary leading-relaxed">{question.content}</p>
      </div>

      <div className="p-4 space-y-3">
        {question.type === 'single' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(getOptionLabel(idx))}
                disabled={isSubmitted || mode === 'review'}
                className={getOptionClass(getOptionLabel(idx))}
              >
                <span className="font-medium mr-2">{getOptionLabel(idx)}.</span>
                {option.replace(/^[A-D]\.\s*/, '').replace(/^选项[A-D]：/, '')}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(getOptionLabel(idx))}
                disabled={isSubmitted || mode === 'review'}
                className={getOptionClass(getOptionLabel(idx))}
              >
                <span className="font-medium mr-2">{getOptionLabel(idx)}.</span>
                {option.replace(/^[A-D]\.\s*/, '').replace(/^选项[A-D]：/, '')}
              </button>
            ))}
          </div>
        )}

        {question.type === 'judge' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleJudge('正确')}
              disabled={isSubmitted || mode === 'review'}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                isSubmitted
                  ? question.answer === '正确'
                    ? 'border-success bg-green-50 text-success'
                    : 'border-border text-text-secondary'
                  : selected.includes('正确')
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              ✓ 正确
            </button>
            <button
              onClick={() => handleJudge('错误')}
              disabled={isSubmitted || mode === 'review'}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                isSubmitted
                  ? question.answer === '错误'
                    ? 'border-success bg-green-50 text-success'
                    : 'border-border text-text-secondary'
                  : selected.includes('错误')
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              ✗ 错误
            </button>
          </div>
        )}

        {question.type === 'subjective' && (
          <div>
            {mode === 'review' || isSubmitted ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">你的答案：</p>
                  <div className="p-3 bg-bg-tertiary rounded-lg text-text-primary whitespace-pre-wrap">
                    {subjectiveAnswer || '未作答'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-success mb-2">参考答案：</p>
                  <div className="p-3 bg-green-50 rounded-lg text-text-primary whitespace-pre-wrap border border-green-200">
                    {question.answer}
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                value={subjectiveAnswer}
                onChange={(e) => setSubjectiveAnswer(e.target.value)}
                placeholder="请输入你的答案..."
                className="w-full h-40 p-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none resize-none"
              />
            )}
          </div>
        )}

        {isSubmitted && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">📖 答案解析</p>
            <p className="text-sm text-blue-700 leading-relaxed">{question.analysis}</p>
          </div>
        )}

        {showSubmit && !isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={
              (question.type !== 'subjective' && selected.length === 0) ||
              (question.type === 'subjective' && !subjectiveAnswer.trim())
            }
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            提交答案
          </button>
        )}
      </div>
    </div>
  );
};
