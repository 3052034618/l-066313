export type QuestionType = 'single' | 'multiple' | 'judge' | 'subjective';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface KnowledgePoint {
  id: string;
  name: string;
  chapterId: string;
}

export interface Chapter {
  id: string;
  name: string;
  certificateId: string;
  order: number;
  knowledgePoints: KnowledgePoint[];
  totalQuestions: number;
  estimatedTime: number;
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalChapters: number;
  totalQuestions: number;
  examDuration: number;
  passScore: number;
  totalScore: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string | string[];
  analysis: string;
  chapterId: string;
  knowledgePointId: string;
  difficulty: DifficultyLevel;
  score: number;
  isRealExam?: boolean;
  year?: number;
}

export interface DailyTask {
  id: string;
  date: string;
  chapterId: string;
  chapterName: string;
  questionCount: number;
  estimatedTime: number;
  completed: boolean;
  completedQuestions: number;
}

export interface StudyPlan {
  id: string;
  certificateId: string;
  startDate: string;
  examDate: string;
  dailyStudyTime: number;
  initialLevel: number;
  dailyTasks: DailyTask[];
  createdAt: string;
}

export interface WrongQuestion {
  id: string;
  questionId: string;
  question: Question;
  userAnswer: string | string[];
  wrongCount: number;
  firstWrongDate: string;
  lastWrongDate: string;
  mastered: boolean;
}

export interface ExamQuestionAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  score: number;
}

export interface ExamRecord {
  id: string;
  type: 'mock' | 'real';
  certificateId: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalScore: number;
  userScore: number;
  correctRate: number;
  answers: ExamQuestionAnswer[];
  knowledgePointStats: {
    knowledgePointId: string;
    knowledgePointName: string;
    totalQuestions: number;
    correctCount: number;
    correctRate: number;
  }[];
}

export interface UserProfile {
  name: string;
  targetCertificateId: string | null;
  examDate: string | null;
  dailyStudyTime: number;
  dailyReminderTime: string;
  initialLevel: number;
  studyStreak: number;
  totalStudyTime: number;
  lastStudyDate: string | null;
}

export interface LearningTrend {
  date: string;
  correctRate: number;
  totalQuestions: number;
  knowledgePointRates: {
    knowledgePointId: string;
    knowledgePointName: string;
    correctRate: number;
  }[];
}

export type ReminderType = 'study' | 'exam-7' | 'exam-3' | 'exam-1';

export interface StudyReminder {
  id: string;
  type: ReminderType;
  title: string;
  content: string;
  date: string;
  read: boolean;
}
