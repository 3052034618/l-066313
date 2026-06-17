import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { QuestionCard } from '@/components/Question/QuestionCard';
import { Button } from '@/components/UI/Button';
import { useApp } from '@/context/AppContext';
import { getQuestionsByChapter, chapters } from '@/data/mockData';
import type { Question } from '@/types';

export const ChapterPractice: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { addWrongQuestion, studyPlan, updateDailyTask, addLearningTrend } = useApp();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<'practice' | 'result'>('practice');

  const chapter = chapters.find((c) => c.id === chapterId);

  useEffect(() => {
    if (chapterId) {
      const chapterQuestions = getQuestionsByChapter(chapterId);
      setQuestions(chapterQuestions);
    }
  }, [chapterId]);

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
      
      if (studyPlan && chapterId) {
        const today = new Date().toISOString().split('T')[0];
        const todayTask = studyPlan.dailyTasks.find(
          (t) => t.date === today && t.chapterId === chapterId
        );
        if (todayTask) {
          updateDailyTask(todayTask.id, true, todayTask.questionCount);
        }
      }

      const today = new Date().toISOString().split('T')[0];
      const kpStats: Record<string, { total: number; correct: number; name: string }> = {};
      
      questions.forEach((q) => {
        if (q.type === 'subjective') return;
        if (!kpStats[q.knowledgePointId]) {
          kpStats[q.knowledgePointId] = { total: 0, correct: 0, name: '' };
          const kp = chapter?.knowledgePoints.find((k) => k.id === q.knowledgePointId);
          if (kp) kpStats[q.knowledgePointId].name = kp.name;
        }
        kpStats[q.knowledgePointId].total++;
        
        const userAnswer = answers[q.id];
        if (userAnswer) {
          let isCorrect = false;
          if (Array.isArray(q.answer)) {
            if (Array.isArray(userAnswer)) {
              isCorrect = q.answer.length === userAnswer.length &&
                q.answer.every((a) => userAnswer.includes(a));
            }
          } else {
            isCorrect = userAnswer === q.answer;
          }
          if (isCorrect) kpStats[q.knowledgePointId].correct++;
        }
      });
      
      const correctCount = getCorrectCount();
      const objectiveQuestions = questions.filter((q) => q.type !== 'subjective');
      const overallAccuracy = objectiveQuestions.length > 0
        ? Math.round((correctCount / objectiveQuestions.length) * 100)
        : 0;
      
      const knowledgePointRates = Object.entries(kpStats).map(([id, stats]) => ({
        knowledgePointId: id,
        knowledgePointName: stats.name,
        correctRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }));
      
      addLearningTrend({
        date: today,
        correctRate: overallAccuracy,
        totalQuestions: objectiveQuestions.length,
        knowledgePointRates,
      });
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

  if (!chapter) {
    return (
      <PageLayout title="章节练习" onBack={() => navigate('/practice')}>
        <p>章节不存在</p>
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
      <PageLayout title="练习结果" onBack={() => navigate('/practice')}>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {accuracy >= 80 ? '太棒了！' : accuracy >= 60 ? '还不错！' : '继续加油！'}
          </h2>
          <p className="text-text-secondary mb-6">{chapter.name} 练习完成</p>

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
            <Button variant="outline" className="flex-1" onClick={() => navigate('/practice')}>
              返回列表
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setShowAnswers({});
                setMode('practice');
              }}
            >
              再练一次
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={chapter.name}
      onBack={() => navigate('/practice')}
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              上一题
            </Button>
            <Button
              className="flex-1"
              onClick={handleNext}
              disabled={!showAnswers[currentQuestion.id]}
            >
              {currentIndex === questions.length - 1 ? '完成练习' : '下一题'}
            </Button>
          </div>
        </>
      )}
    </PageLayout>
  );
};
