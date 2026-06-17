import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { QuestionCard } from '@/components/Question/QuestionCard';
import { useApp } from '@/context/AppContext';
import { getRealExamQuestions } from '@/data/mockData';
import type { Question } from '@/types';

export const RealExam: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, addWrongQuestion } = useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<'practice' | 'result'>('practice');

  const years = [2023, 2022, 2021, 2020];

  const handleStart = (year: number) => {
    const realQuestions = getRealExamQuestions(userProfile.targetCertificateId || 'cert-1');
    const yearQuestions = realQuestions.filter((q) => q.year === year);
    if (yearQuestions.length === 0) {
      setQuestions(realQuestions.slice(0, 30));
    } else {
      setQuestions(yearQuestions);
    }
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setShowAnswers({});
    setMode('practice');
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string | string[]) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    setShowAnswers((prev) => ({ ...prev, [currentQuestion.id]: true }));

    const userAnswer = answers[currentQuestion.id];
    let isCorrect = false;

    if (currentQuestion.type === 'subjective') {
      isCorrect = false;
    } else if (Array.isArray(currentQuestion.answer)) {
      if (Array.isArray(userAnswer)) {
        isCorrect =
          currentQuestion.answer.length === userAnswer.length &&
          currentQuestion.answer.every((a) => userAnswer.includes(a));
      }
    } else {
      isCorrect = userAnswer === currentQuestion.answer;
    }

    if (!isCorrect && currentQuestion.type !== 'subjective') {
      addWrongQuestion(currentQuestion, userAnswer || '');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('result');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getCorrectCount = (): number => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      if (q.type === 'subjective') return;
      
      if (Array.isArray(q.answer)) {
        if (
          Array.isArray(userAnswer) &&
          q.answer.length === userAnswer.length &&
          q.answer.every((a) => userAnswer.includes(a))
        ) {
          correct++;
        }
      } else {
        if (userAnswer === q.answer) {
          correct++;
        }
      }
    });
    return correct;
  };

  if (!started) {
    return (
      <PageLayout title="历年真题" onBack={() => navigate('/practice')}>
        <div className="flex gap-2 mb-4">
          <Link
            to="/practice"
            className="flex-1 py-2 rounded-lg font-medium text-center bg-bg-tertiary text-text-secondary"
          >
            📚 章节练习
          </Link>
          <Link
            to="/practice/real-exam"
            className="flex-1 py-2 rounded-lg font-medium text-center bg-primary text-white"
          >
            📄 历年真题
          </Link>
        </div>

        <p className="text-text-secondary text-sm mb-4">
          选择年份开始练习历年真题
        </p>

        <div className="space-y-3">
          {years.map((year) => (
            <Card key={year} onClick={() => handleStart(year)}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{year}年真题</h3>
                    <p className="text-sm text-text-secondary">
                      共 {Math.floor(Math.random() * 20) + 30} 道题
                    </p>
                  </div>
                </div>
                <span className="text-primary">开始 →</span>
              </div>
            </Card>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (mode === 'result') {
    const correctCount = getCorrectCount();
    const objectiveQuestions = questions.filter((q) => q.type !== 'subjective');
    const accuracy = objectiveQuestions.length > 0
      ? Math.round((correctCount / objectiveQuestions.length) * 100)
      : 0;

    return (
      <PageLayout title="真题练习结果" onBack={() => setStarted(false)}>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {accuracy >= 80 ? '太棒了！' : accuracy >= 60 ? '还不错！' : '继续加油！'}
          </h2>
          <p className="text-text-secondary mb-6">真题练习完成</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
              <p className="text-3xl font-bold text-primary">{questions.length}</p>
              <p className="text-sm text-text-secondary">总题数</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
              <p className="text-3xl font-bold text-success">{correctCount}</p>
              <p className="text-sm text-text-secondary">正确数</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
              <p className="text-3xl font-bold text-warning">{accuracy}%</p>
              <p className="text-sm text-text-secondary">正确率</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStarted(false)}
              className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-medium"
            >
              返回列表
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setShowAnswers({});
                setMode('practice');
              }}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium"
            >
              再练一次
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="历年真题"
      onBack={() => setStarted(false)}
      rightAction={
        <span className="text-sm text-text-secondary">
          {currentIndex + 1}/{questions.length}
        </span>
      }
    >
      {currentQuestion && (
        <>
          <div className="w-full h-1 bg-bg-tertiary rounded-full mb-4">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            showAnswer={showAnswers[currentQuestion.id]}
            userAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onSubmit={handleSubmitAnswer}
            showSubmit={!showAnswers[currentQuestion.id]}
            mode="practice"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-medium disabled:opacity-50"
            >
              上一题
            </button>
            <button
              onClick={handleNext}
              disabled={!showAnswers[currentQuestion.id]}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
            >
              {currentIndex === questions.length - 1 ? '完成练习' : '下一题'}
            </button>
          </div>
        </>
      )}
    </PageLayout>
  );
};
