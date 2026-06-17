import React, { useState } from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { QuestionCard } from '@/components/Question/QuestionCard';
import { Button } from '@/components/UI/Button';
import { useApp } from '@/context/AppContext';
import { chapters } from '@/data/mockData';

export const WrongQuestions: React.FC = () => {
  const { wrongQuestions, markMastered, removeWrongQuestion, addWrongQuestion } = useApp();
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [groupBy, setGroupBy] = useState<'chapter' | 'knowledge'>('chapter');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const filteredQuestions = wrongQuestions.filter((q) => {
    if (filter === 'all') return true;
    if (filter === 'unmastered') return !q.mastered;
    if (filter === 'mastered') return q.mastered;
    return true;
  });

  const groupedByChapter = () => {
    const groups: Record<string, typeof filteredQuestions> = {};
    filteredQuestions.forEach((q) => {
      const chapter = chapters.find((c) => c.id === q.question.chapterId);
      const chapterName = chapter?.name || '未分类';
      if (!groups[chapterName]) {
        groups[chapterName] = [];
      }
      groups[chapterName].push(q);
    });
    return groups;
  };

  const groupedByKnowledge = () => {
    const groups: Record<string, typeof filteredQuestions> = {};
    filteredQuestions.forEach((q) => {
      const kpName = q.question.knowledgePointId || '未分类';
      if (!groups[kpName]) {
        groups[kpName] = [];
      }
      groups[kpName].push(q);
    });
    return groups;
  };

  const groups = groupBy === 'chapter' ? groupedByChapter() : groupedByKnowledge();

  const practiceQuestions = filteredQuestions.filter((q) => !q.mastered);
  const currentPracticeQuestion = practiceQuestions[currentIndex]?.question;

  const handleAnswer = (answer: string | string[]) => {
    if (!currentPracticeQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentPracticeQuestion.id]: answer }));
  };

  const handleSubmitAnswer = () => {
    if (!currentPracticeQuestion) return;
    setShowAnswers((prev) => ({ ...prev, [currentPracticeQuestion.id]: true }));

    const userAnswer = answers[currentPracticeQuestion.id];
    let isCorrect = false;

    if (currentPracticeQuestion.type === 'subjective') {
      isCorrect = false;
    } else if (Array.isArray(currentPracticeQuestion.answer)) {
      if (Array.isArray(userAnswer)) {
        isCorrect =
          currentPracticeQuestion.answer.length === userAnswer.length &&
          currentPracticeQuestion.answer.every((a) => userAnswer.includes(a));
      }
    } else {
      isCorrect = userAnswer === currentPracticeQuestion.answer;
    }

    if (isCorrect) {
      markMastered(currentPracticeQuestion.id);
    } else {
      addWrongQuestion(currentPracticeQuestion, userAnswer || '');
    }
  };

  const handleNext = () => {
    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPracticeMode(false);
    }
  };

  const handleStartPractice = () => {
    setPracticeMode(true);
    setCurrentIndex(0);
    setAnswers({});
    setShowAnswers({});
  };

  if (practiceMode && practiceQuestions.length > 0) {
    return (
      <PageLayout
        title="错题重做"
        onBack={() => setPracticeMode(false)}
        rightAction={
          <span className="text-sm text-text-secondary">
            {currentIndex + 1}/{practiceQuestions.length}
          </span>
        }
      >
        {currentPracticeQuestion && (
          <>
            <div className="w-full h-1 bg-bg-tertiary rounded-full mb-4">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / practiceQuestions.length) * 100}%` }}
              />
            </div>

            <div className="mb-2 text-xs text-warning">
              ⚠️ 错题重做 - 答对将自动移出错题本
            </div>

            <QuestionCard
              question={currentPracticeQuestion}
              index={currentIndex}
              showAnswer={showAnswers[currentPracticeQuestion.id]}
              userAnswer={answers[currentPracticeQuestion.id]}
              onAnswer={handleAnswer}
              onSubmit={handleSubmitAnswer}
              showSubmit={!showAnswers[currentPracticeQuestion.id]}
              mode="practice"
            />

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPracticeMode(false)}
              >
                退出练习
              </Button>
              <Button
                className="flex-1"
                onClick={handleNext}
                disabled={!showAnswers[currentPracticeQuestion.id]}
              >
                {currentIndex === practiceQuestions.length - 1 ? '完成' : '下一题'}
              </Button>
            </div>
          </>
        )}
      </PageLayout>
    );
  }

  return (
    <PageLayout title="错题本">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <span className="text-2xl">❌</span>
          <div>
            <h2 className="font-bold text-text-primary">错题本</h2>
            <p className="text-xs text-text-secondary">
              共 {wrongQuestions.length} 道，未掌握 {wrongQuestions.filter((q) => !q.mastered).length} 道
            </p>
          </div>
        </div>
      </div>

      {wrongQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">太棒了！</h2>
          <p className="text-text-secondary text-center mb-6">
            暂无错题，继续保持~
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }`}
            >
              全部 ({wrongQuestions.length})
            </button>
            <button
              onClick={() => setFilter('unmastered')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'unmastered'
                  ? 'bg-danger text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }`}
            >
              未掌握 ({wrongQuestions.filter((q) => !q.mastered).length})
            </button>
            <button
              onClick={() => setFilter('mastered')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'mastered'
                  ? 'bg-success text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }`}
            >
              已掌握 ({wrongQuestions.filter((q) => q.mastered).length})
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setGroupBy('chapter')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                groupBy === 'chapter'
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary'
              }`}
            >
              按章节
            </button>
            <button
              onClick={() => setGroupBy('knowledge')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                groupBy === 'knowledge'
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary'
              }`}
            >
              按知识点
            </button>
          </div>

          {filteredQuestions.filter((q) => !q.mastered).length > 0 && (
            <Button className="w-full mb-4" onClick={handleStartPractice}>
              🔄 开始错题重做
            </Button>
          )}

          <div className="space-y-4">
            {Object.entries(groups).map(([groupName, groupQuestions]) => (
              <div key={groupName}>
                <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                  <span>{groupName}</span>
                  <span className="text-xs">{groupQuestions.length} 题</span>
                </h3>
                <div className="space-y-2">
                  {groupQuestions.slice(0, 5).map((wrongQ) => (
                    <Card key={wrongQ.id}>
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() =>
                          setSelectedQuestion(
                            selectedQuestion === wrongQ.id ? null : wrongQ.id
                          )
                        }
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-text-primary flex-1 line-clamp-2">
                            {wrongQ.question.content}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                            wrongQ.mastered
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {wrongQ.mastered ? '已掌握' : '未掌握'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                          <span>错{wrongQ.wrongCount}次</span>
                          <span>{wrongQ.lastWrongDate}</span>
                        </div>

                        {selectedQuestion === wrongQ.id && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <QuestionCard
                              question={wrongQ.question}
                              showAnswer={true}
                              userAnswer={wrongQ.userAnswer}
                              mode="review"
                            />
                            <div className="flex gap-2 mt-3">
                              {!wrongQ.mastered && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markMastered(wrongQ.questionId);
                                  }}
                                >
                                  标记已掌握
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('确定要移除这道错题吗？')) {
                                    removeWrongQuestion(wrongQ.questionId);
                                  }
                                }}
                              >
                                移除
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                  {groupQuestions.length > 5 && (
                    <button className="text-sm text-primary w-full text-center py-2">
                      查看全部 {groupQuestions.length} 道 →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PageLayout>
  );
};
