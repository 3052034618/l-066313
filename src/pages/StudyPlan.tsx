import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { ProgressBar } from '@/components/UI/ProgressBar';
import { useApp } from '@/context/AppContext';
import { formatTime, formatDate, getOverallProgress } from '@/utils/studyPlan';
import { chapters } from '@/data/mockData';

export const StudyPlan: React.FC = () => {
  const { studyPlan } = useApp();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  const overallProgress = getOverallProgress(studyPlan);

  if (!studyPlan) {
    return (
      <PageLayout title="学习计划">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">还没有学习计划</h2>
          <p className="text-text-secondary text-center mb-6">
            先设置目标证书和考试日期
          </p>
          <Link
            to="/settings"
            className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            去设置
          </Link>
        </div>
      </PageLayout>
    );
  }

  const tasksByDate = studyPlan.dailyTasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
    return acc;
  }, {} as Record<string, typeof studyPlan.dailyTasks>);

  const dates = Object.keys(tasksByDate).sort();

  const chapterProgress = () => {
    const result: { chapterId: string; chapterName: string; total: number; completed: number }[] = [];
    const certChapters = chapters.filter((c) => c.certificateId === studyPlan.certificateId);

    certChapters.forEach((chapter) => {
      const chapterTasks = studyPlan.dailyTasks.filter((t) => t.chapterId === chapter.id);
      const total = chapterTasks.reduce((sum, t) => sum + t.questionCount, 0);
      const completed = chapterTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + t.completedQuestions, 0);
      result.push({
        chapterId: chapter.id,
        chapterName: chapter.name,
        total,
        completed,
      });
    });

    return result;
  };

  const progressData = chapterProgress();

  return (
    <PageLayout title="学习计划">
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">总体进度</h3>
            <span className="text-primary font-bold">{overallProgress}%</span>
          </div>
          <ProgressBar progress={overallProgress} color="primary" height="md" />
          <div className="flex justify-between text-xs text-text-tertiary mt-2">
            <span>开始：{formatDate(studyPlan.startDate)}</span>
            <span>考试：{formatDate(studyPlan.examDate)}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-primary text-white'
              : 'bg-bg-tertiary text-text-secondary'
          }`}
        >
          📅 按日期
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'calendar'
              ? 'bg-primary text-white'
              : 'bg-bg-tertiary text-text-secondary'
          }`}
        >
          📚 按章节
        </button>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-4">
          {dates.map((date) => {
            const dayTasks = tasksByDate[date];
            const allCompleted = dayTasks.every((t) => t.completed);
            const totalQuestions = dayTasks.reduce((sum, t) => sum + t.questionCount, 0);
            const totalTime = dayTasks.reduce((sum, t) => sum + t.estimatedTime, 0);

            const dateObj = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = dateObj.toDateString() === today.toDateString();
            const isPast = dateObj < today;

            return (
              <Card key={date}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${
                        isToday ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {formatDate(date)}
                      </h4>
                      {isToday && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          今天
                        </span>
                      )}
                      {isPast && allCompleted && (
                        <span className="text-xs text-success">✓ 已完成</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      allCompleted ? 'text-success' : 'text-text-secondary'
                    }`}>
                      {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/practice/chapter/${task.chapterId}`}
                        className="block"
                      >
                        <div className={`p-3 rounded-lg border transition-all ${
                          task.completed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-bg-tertiary border-border hover:border-primary/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                task.completed
                                  ? 'bg-success text-white'
                                  : 'bg-bg-secondary border border-border'
                              }`}>
                                {task.completed ? '✓' : ''}
                              </span>
                              <span className={`font-medium ${
                                task.completed ? 'text-green-700' : 'text-text-primary'
                              }`}>
                                {task.chapterName}
                              </span>
                            </div>
                            <div className="text-xs text-text-tertiary">
                              {task.questionCount}题 · {formatTime(task.estimatedTime)}
                            </div>
                          </div>
                          {task.completed && (
                            <div className="mt-2 pl-7">
                              <ProgressBar
                                progress={100}
                                color="success"
                                height="sm"
                              />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-text-tertiary">
                    <span>共 {totalQuestions} 题</span>
                    <span>约 {formatTime(totalTime)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="space-y-3">
          {progressData.map((chapter) => (
            <Card key={chapter.chapterId}>
              <Link
                to={`/practice/chapter/${chapter.chapterId}`}
                className="block p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{chapter.chapterName}</h4>
                  <span className="text-sm text-text-secondary">
                    {chapter.completed}/{chapter.total}
                  </span>
                </div>
                <ProgressBar
                  progress={chapter.total > 0 ? (chapter.completed / chapter.total) * 100 : 0}
                  color="primary"
                  height="sm"
                />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};
