import type { DailyTask, StudyPlan } from '@/types';
import { chapters } from '@/data/mockData';

export const generateStudyPlan = (
  certificateId: string,
  examDate: string,
  dailyStudyTime: number,
  initialLevel: number
): StudyPlan => {
  const startDate = new Date();
  const exam = new Date(examDate);

  const certChapters = chapters.filter((c) => c.certificateId === certificateId);
  const levelFactor = initialLevel / 100;

  const dailyTasks: DailyTask[] = [];
  let currentDate = new Date(startDate);
  let chapterIndex = 0;
  let remainingChapterTime = 0;
  let completedQuestions = 0;

  while (chapterIndex < certChapters.length && currentDate <= exam) {
    const chapter = certChapters[chapterIndex];
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (remainingChapterTime <= 0) {
      remainingChapterTime = chapter.estimatedTime;
      completedQuestions = 0;
    }

    const adjustedDailyTime = dailyStudyTime * (1 + levelFactor * 0.3);
    const todayTime = Math.min(adjustedDailyTime, remainingChapterTime);
    const progressRatio = todayTime / chapter.estimatedTime;
    const todayQuestions = Math.ceil(chapter.totalQuestions * progressRatio);
    const actualQuestions = Math.min(todayQuestions, chapter.totalQuestions - completedQuestions);

    dailyTasks.push({
      id: `task-${dateStr}-${chapter.id}`,
      date: dateStr,
      chapterId: chapter.id,
      chapterName: chapter.name,
      questionCount: actualQuestions,
      estimatedTime: todayTime,
      completed: false,
      completedQuestions: 0,
    });

    remainingChapterTime -= todayTime;
    completedQuestions += actualQuestions;

    if (remainingChapterTime <= 0 || completedQuestions >= chapter.totalQuestions) {
      chapterIndex++;
      remainingChapterTime = 0;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    id: `plan-${Date.now()}`,
    certificateId,
    startDate: startDate.toISOString().split('T')[0],
    examDate,
    dailyStudyTime,
    initialLevel,
    dailyTasks,
    createdAt: new Date().toISOString(),
  };
};

export const getTodayTask = (studyPlan: StudyPlan | null): DailyTask | null => {
  if (!studyPlan) return null;
  const today = new Date().toISOString().split('T')[0];
  return studyPlan.dailyTasks.find((task) => task.date === today) || null;
};

export const getCompletedTaskCount = (studyPlan: StudyPlan | null): number => {
  if (!studyPlan) return 0;
  return studyPlan.dailyTasks.filter((t) => t.completed).length;
};

export const getOverallProgress = (studyPlan: StudyPlan | null): number => {
  if (!studyPlan || studyPlan.dailyTasks.length === 0) return 0;
  const completed = studyPlan.dailyTasks.filter((t) => t.completed).length;
  return Math.round((completed / studyPlan.dailyTasks.length) * 100);
};

export const getDaysRemaining = (examDate: string | null): number => {
  if (!examDate) return 0;
  const today = new Date();
  const exam = new Date(examDate);
  const diff = exam.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
  }
  return `${mins}分钟`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
