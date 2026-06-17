import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  StudyPlan,
  WrongQuestion,
  ExamRecord,
  StudyReminder,
  LearningTrend,
  Question,
} from '@/types';
import {
  getUserProfile,
  setUserProfile,
  getStudyPlan,
  setStudyPlan,
  getWrongQuestions,
  setWrongQuestions,
  getExamRecords,
  setExamRecords,
  getReminders,
  setReminders,
  getLearningTrends,
  setLearningTrends,
  defaultUserProfile,
} from '@/utils/storage';
import { generateStudyPlan } from '@/utils/studyPlan';
import { defaultReminders, psychologicalTips } from '@/data/mockData';

interface AppContextType {
  userProfile: UserProfile;
  studyPlan: StudyPlan | null;
  wrongQuestions: WrongQuestion[];
  examRecords: ExamRecord[];
  reminders: StudyReminder[];
  learningTrends: LearningTrend[];

  updateUserProfile: (profile: Partial<UserProfile>) => void;
  createStudyPlan: (
    certificateId: string,
    examDate: string,
    dailyStudyTime: number,
    initialLevel: number
  ) => void;
  updateDailyTask: (taskId: string, completed: boolean, completedQuestions: number) => void;
  addWrongQuestion: (question: Question, userAnswer: string | string[]) => void;
  removeWrongQuestion: (questionId: string) => void;
  markMastered: (questionId: string) => void;
  addExamRecord: (record: ExamRecord) => void;
  addReminder: (reminder: StudyReminder) => void;
  markReminderRead: (reminderId: string) => void;
  addLearningTrend: (trend: LearningTrend) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [studyPlan, setStudyPlanState] = useState<StudyPlan | null>(null);
  const [wrongQuestions, setWrongQuestionsState] = useState<WrongQuestion[]>([]);
  const [examRecords, setExamRecordsState] = useState<ExamRecord[]>([]);
  const [reminders, setRemindersState] = useState<StudyReminder[]>([]);
  const [learningTrends, setLearningTrendsState] = useState<LearningTrend[]>([]);

  useEffect(() => {
    setUserProfileState(getUserProfile());
    setStudyPlanState(getStudyPlan());
    setWrongQuestionsState(getWrongQuestions());
    setExamRecordsState(getExamRecords());
    
    const storedReminders = getReminders();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const hasTodayStudyReminder = storedReminders.some(
      (r) => r.type === 'study' && r.date === todayStr
    );
    
    if (!hasTodayStudyReminder && getUserProfile().targetCertificateId) {
      const todayReminder: StudyReminder = {
        id: `reminder-study-${todayStr}`,
        type: 'study',
        title: '今日学习提醒',
        content: `今天的学习时间到了！每天${getUserProfile().dailyReminderTime || '20:00'}，坚持学习，顺利通关！`,
        date: todayStr,
        read: false,
      };
      const updatedReminders = [todayReminder, ...storedReminders];
      setRemindersState(updatedReminders);
      setReminders(updatedReminders);
    } else if (storedReminders.length === 0) {
      setRemindersState(defaultReminders);
      setReminders(defaultReminders);
    } else {
      setRemindersState(storedReminders);
    }
    
    setLearningTrendsState(getLearningTrends());
  }, []);

  useEffect(() => {
    if (userProfile.examDate) {
      checkExamReminders();
    }
  }, [userProfile.examDate]);

  const checkExamReminders = useCallback(() => {
    if (!userProfile.examDate) return;

    const today = new Date();
    const examDate = new Date(userProfile.examDate);
    const daysRemaining = Math.ceil(
      (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const reminderDays = [7, 3, 1];
    const todayStr = today.toISOString().split('T')[0];

    reminderDays.forEach((day) => {
      if (daysRemaining === day) {
        const tip = psychologicalTips.find((t) => t.day === day);
        if (tip) {
          const existingReminder = reminders.find(
            (r) => r.type === `exam-${day}` && r.date === todayStr
          );
          if (!existingReminder) {
            const newReminder: StudyReminder = {
              id: `reminder-exam-${day}-${todayStr}`,
              type: `exam-${day}` as 'exam-7' | 'exam-3' | 'exam-1',
              title: tip.title,
              content: tip.content,
              date: todayStr,
              read: false,
            };
            const newReminders = [...reminders, newReminder];
            setRemindersState(newReminders);
            setReminders(newReminders);
          }
        }
      }
    });
  }, [userProfile.examDate, reminders]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfileState((prev) => {
      const updated = { ...prev, ...profile };
      setUserProfile(updated);
      return updated;
    });
  }, []);

  const createStudyPlan = useCallback(
    (certificateId: string, examDate: string, dailyStudyTime: number, initialLevel: number) => {
      const plan = generateStudyPlan(certificateId, examDate, dailyStudyTime, initialLevel);
      setStudyPlanState(plan);
      setStudyPlan(plan);
      updateUserProfile({
        targetCertificateId: certificateId,
        examDate,
        dailyStudyTime,
        initialLevel,
      });
    },
    [updateUserProfile]
  );

  const updateDailyTask = useCallback(
    (taskId: string, completed: boolean, completedQuestions: number) => {
      if (!studyPlan) return;

      const updatedTasks = studyPlan.dailyTasks.map((task) =>
        task.id === taskId ? { ...task, completed, completedQuestions } : task
      );

      const updatedPlan = { ...studyPlan, dailyTasks: updatedTasks };
      setStudyPlanState(updatedPlan);
      setStudyPlan(updatedPlan);
    },
    [studyPlan]
  );

  const addWrongQuestion = useCallback((question: Question, userAnswer: string | string[]) => {
    const wrongQuestion: WrongQuestion = {
      id: `wrong-${Date.now()}`,
      questionId: question.id,
      question,
      userAnswer,
      wrongCount: 1,
      firstWrongDate: new Date().toISOString().split('T')[0],
      lastWrongDate: new Date().toISOString().split('T')[0],
      mastered: false,
    };

    setWrongQuestionsState((prev) => {
      const existingIndex = prev.findIndex((q) => q.questionId === question.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          wrongCount: updated[existingIndex].wrongCount + 1,
          lastWrongDate: wrongQuestion.lastWrongDate,
          userAnswer,
          mastered: false,
        };
        setWrongQuestions(updated);
        return updated;
      }
      const updated = [...prev, wrongQuestion];
      setWrongQuestions(updated);
      return updated;
    });
  }, []);

  const removeWrongQuestion = useCallback((questionId: string) => {
    setWrongQuestionsState((prev) => {
      const updated = prev.filter((q) => q.questionId !== questionId);
      setWrongQuestions(updated);
      return updated;
    });
  }, []);

  const markMastered = useCallback((questionId: string) => {
    setWrongQuestionsState((prev) => {
      const updated = prev.map((q) =>
        q.questionId === questionId ? { ...q, mastered: true } : q
      );
      setWrongQuestions(updated);
      return updated;
    });
  }, []);

  const addExamRecord = useCallback((record: ExamRecord) => {
    setExamRecordsState((prev) => {
      const updated = [record, ...prev];
      setExamRecords(updated);
      return updated;
    });
  }, []);

  const addReminder = useCallback((reminder: StudyReminder) => {
    setRemindersState((prev) => {
      const updated = [reminder, ...prev];
      setReminders(updated);
      return updated;
    });
  }, []);

  const markReminderRead = useCallback((reminderId: string) => {
    setRemindersState((prev) => {
      const updated = prev.map((r) =>
        r.id === reminderId ? { ...r, read: true } : r
      );
      setReminders(updated);
      return updated;
    });
  }, []);

  const addLearningTrend = useCallback((trend: LearningTrend) => {
    setLearningTrendsState((prev) => {
      const existingIndex = prev.findIndex((t) => t.date === trend.date);
      let updated: LearningTrend[];
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const mergedKpRates = [...existing.knowledgePointRates];
        
        trend.knowledgePointRates.forEach((newKp) => {
          const existingKpIndex = mergedKpRates.findIndex(
            (k) => k.knowledgePointId === newKp.knowledgePointId
          );
          if (existingKpIndex >= 0) {
            const existingKp = mergedKpRates[existingKpIndex];
            mergedKpRates[existingKpIndex] = {
              ...existingKp,
              correctRate: Math.round((existingKp.correctRate + newKp.correctRate) / 2),
            };
          } else {
            mergedKpRates.push(newKp);
          }
        });

        const totalQuestions = existing.totalQuestions + trend.totalQuestions;
        const correctRate = Math.round(
          (existing.correctRate * existing.totalQuestions + trend.correctRate * trend.totalQuestions) /
          totalQuestions
        );

        const mergedTrend: LearningTrend = {
          ...existing,
          correctRate,
          totalQuestions,
          knowledgePointRates: mergedKpRates,
        };

        updated = [...prev];
        updated[existingIndex] = mergedTrend;
      } else {
        updated = [...prev, trend];
      }
      setLearningTrends(updated);
      return updated;
    });
  }, []);

  const resetAllData = useCallback(() => {
    setUserProfileState(defaultUserProfile);
    setStudyPlanState(null);
    setWrongQuestionsState([]);
    setExamRecordsState([]);
    setRemindersState(defaultReminders);
    setLearningTrendsState([]);
    localStorage.clear();
    setReminders(defaultReminders);
  }, []);

  const value: AppContextType = {
    userProfile,
    studyPlan,
    wrongQuestions,
    examRecords,
    reminders,
    learningTrends,
    updateUserProfile,
    createStudyPlan,
    updateDailyTask,
    addWrongQuestion,
    removeWrongQuestion,
    markMastered,
    addExamRecord,
    addReminder,
    markReminderRead,
    addLearningTrend,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
