import type {
  UserProfile,
  StudyPlan,
  WrongQuestion,
  ExamRecord,
  StudyReminder,
  LearningTrend,
} from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'exam_app_user_profile',
  STUDY_PLAN: 'exam_app_study_plan',
  WRONG_QUESTIONS: 'exam_app_wrong_questions',
  EXAM_RECORDS: 'exam_app_exam_records',
  REMINDERS: 'exam_app_reminders',
  LEARNING_TRENDS: 'exam_app_learning_trends',
};

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

export const defaultUserProfile: UserProfile = {
  name: '备考达人',
  targetCertificateId: null,
  examDate: null,
  dailyStudyTime: 60,
  initialLevel: 50,
  studyStreak: 0,
  totalStudyTime: 0,
  lastStudyDate: null,
};

export const getUserProfile = (): UserProfile => {
  return storage.get<UserProfile>(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
};

export const setUserProfile = (profile: UserProfile): void => {
  storage.set<UserProfile>(STORAGE_KEYS.USER_PROFILE, profile);
};

export const getStudyPlan = (): StudyPlan | null => {
  return storage.get<StudyPlan | null>(STORAGE_KEYS.STUDY_PLAN, null);
};

export const setStudyPlan = (plan: StudyPlan | null): void => {
  storage.set<StudyPlan | null>(STORAGE_KEYS.STUDY_PLAN, plan);
};

export const getWrongQuestions = (): WrongQuestion[] => {
  return storage.get<WrongQuestion[]>(STORAGE_KEYS.WRONG_QUESTIONS, []);
};

export const setWrongQuestions = (questions: WrongQuestion[]): void => {
  storage.set<WrongQuestion[]>(STORAGE_KEYS.WRONG_QUESTIONS, questions);
};

export const getExamRecords = (): ExamRecord[] => {
  return storage.get<ExamRecord[]>(STORAGE_KEYS.EXAM_RECORDS, []);
};

export const setExamRecords = (records: ExamRecord[]): void => {
  storage.set<ExamRecord[]>(STORAGE_KEYS.EXAM_RECORDS, records);
};

export const getReminders = (): StudyReminder[] => {
  return storage.get<StudyReminder[]>(STORAGE_KEYS.REMINDERS, []);
};

export const setReminders = (reminders: StudyReminder[]): void => {
  storage.set<StudyReminder[]>(STORAGE_KEYS.REMINDERS, reminders);
};

export const getLearningTrends = (): LearningTrend[] => {
  return storage.get<LearningTrend[]>(STORAGE_KEYS.LEARNING_TRENDS, []);
};

export const setLearningTrends = (trends: LearningTrend[]): void => {
  storage.set<LearningTrend[]>(STORAGE_KEYS.LEARNING_TRENDS, trends);
};

export const addWrongQuestion = (question: WrongQuestion): void => {
  const wrongQuestions = getWrongQuestions();
  const existingIndex = wrongQuestions.findIndex(
    (q) => q.questionId === question.questionId
  );

  if (existingIndex >= 0) {
    wrongQuestions[existingIndex] = {
      ...wrongQuestions[existingIndex],
      wrongCount: wrongQuestions[existingIndex].wrongCount + 1,
      lastWrongDate: question.lastWrongDate,
      userAnswer: question.userAnswer,
      mastered: false,
    };
  } else {
    wrongQuestions.push(question);
  }

  setWrongQuestions(wrongQuestions);
};

export const markQuestionMastered = (questionId: string): void => {
  const wrongQuestions = getWrongQuestions();
  const index = wrongQuestions.findIndex((q) => q.questionId === questionId);
  if (index >= 0) {
    wrongQuestions[index].mastered = true;
    setWrongQuestions(wrongQuestions);
  }
};

export const addExamRecord = (record: ExamRecord): void => {
  const records = getExamRecords();
  records.unshift(record);
  setExamRecords(records);
};
