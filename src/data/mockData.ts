import type { Certificate, Chapter, Question, StudyReminder } from '@/types';

export const certificates: Certificate[] = [
  {
    id: 'cert-1',
    name: '初级会计职称',
    description: '初级会计专业技术资格考试，又称初级会计职称考试、助理会计师考试',
    icon: '📊',
    totalChapters: 8,
    totalQuestions: 500,
    examDuration: 120,
    passScore: 60,
    totalScore: 100,
  },
  {
    id: 'cert-2',
    name: '教师资格证',
    description: '中小学教师资格考试，是由教育部考试中心官方设定的教师资格考试',
    icon: '📚',
    totalChapters: 10,
    totalQuestions: 600,
    examDuration: 120,
    passScore: 70,
    totalScore: 150,
  },
  {
    id: 'cert-3',
    name: '计算机二级',
    description: '全国计算机等级考试二级，考核计算机基础知识和使用高级计算机语言编写程序以及上机调试的基本技能',
    icon: '💻',
    totalChapters: 6,
    totalQuestions: 400,
    examDuration: 90,
    passScore: 60,
    totalScore: 100,
  },
  {
    id: 'cert-4',
    name: '英语四级',
    description: '大学英语四级考试，是由国家教育部高等教育司主持的全国性英语考试',
    icon: '🔤',
    totalChapters: 7,
    totalQuestions: 450,
    examDuration: 130,
    passScore: 425,
    totalScore: 710,
  },
];

const chaptersData: Omit<Chapter, 'id' | 'certificateId'>[] = [
  {
    name: '会计概述',
    order: 1,
    knowledgePoints: [
      { id: 'kp-1-1', name: '会计的概念与特征', chapterId: 'ch-1' },
      { id: 'kp-1-2', name: '会计的职能与方法', chapterId: 'ch-1' },
      { id: 'kp-1-3', name: '会计基本假设与会计基础', chapterId: 'ch-1' },
    ],
    totalQuestions: 60,
    estimatedTime: 120,
  },
  {
    name: '资产',
    order: 2,
    knowledgePoints: [
      { id: 'kp-2-1', name: '货币资金', chapterId: 'ch-2' },
      { id: 'kp-2-2', name: '应收及预付款项', chapterId: 'ch-2' },
      { id: 'kp-2-3', name: '交易性金融资产', chapterId: 'ch-2' },
      { id: 'kp-2-4', name: '存货', chapterId: 'ch-2' },
    ],
    totalQuestions: 80,
    estimatedTime: 180,
  },
  {
    name: '负债',
    order: 3,
    knowledgePoints: [
      { id: 'kp-3-1', name: '短期借款', chapterId: 'ch-3' },
      { id: 'kp-3-2', name: '应付及预收款项', chapterId: 'ch-3' },
      { id: 'kp-3-3', name: '应付职工薪酬', chapterId: 'ch-3' },
      { id: 'kp-3-4', name: '应交税费', chapterId: 'ch-3' },
    ],
    totalQuestions: 70,
    estimatedTime: 150,
  },
  {
    name: '所有者权益',
    order: 4,
    knowledgePoints: [
      { id: 'kp-4-1', name: '实收资本', chapterId: 'ch-4' },
      { id: 'kp-4-2', name: '资本公积', chapterId: 'ch-4' },
      { id: 'kp-4-3', name: '留存收益', chapterId: 'ch-4' },
    ],
    totalQuestions: 50,
    estimatedTime: 100,
  },
  {
    name: '收入、费用和利润',
    order: 5,
    knowledgePoints: [
      { id: 'kp-5-1', name: '收入', chapterId: 'ch-5' },
      { id: 'kp-5-2', name: '费用', chapterId: 'ch-5' },
      { id: 'kp-5-3', name: '利润', chapterId: 'ch-5' },
    ],
    totalQuestions: 75,
    estimatedTime: 160,
  },
  {
    name: '财务报表',
    order: 6,
    knowledgePoints: [
      { id: 'kp-6-1', name: '资产负债表', chapterId: 'ch-6' },
      { id: 'kp-6-2', name: '利润表', chapterId: 'ch-6' },
      { id: 'kp-6-3', name: '所有者权益变动表', chapterId: 'ch-6' },
      { id: 'kp-6-4', name: '附注', chapterId: 'ch-6' },
    ],
    totalQuestions: 65,
    estimatedTime: 140,
  },
  {
    name: '管理会计基础',
    order: 7,
    knowledgePoints: [
      { id: 'kp-7-1', name: '管理会计概述', chapterId: 'ch-7' },
      { id: 'kp-7-2', name: '产品成本核算概述', chapterId: 'ch-7' },
      { id: 'kp-7-3', name: '产品成本的归集和分配', chapterId: 'ch-7' },
      { id: 'kp-7-4', name: '产品成本计算方法', chapterId: 'ch-7' },
    ],
    totalQuestions: 55,
    estimatedTime: 120,
  },
  {
    name: '政府会计基础',
    order: 8,
    knowledgePoints: [
      { id: 'kp-8-1', name: '政府会计概述', chapterId: 'ch-8' },
      { id: 'kp-8-2', name: '政府单位会计核算', chapterId: 'ch-8' },
    ],
    totalQuestions: 45,
    estimatedTime: 90,
  },
];

export const chapters: Chapter[] = chaptersData.map((ch, index) => ({
  ...ch,
  id: `ch-${index + 1}`,
  certificateId: 'cert-1',
  knowledgePoints: ch.knowledgePoints.map((kp) => ({
    ...kp,
    chapterId: `ch-${index + 1}`,
  })),
}));

const questionTemplates = [
  {
    type: 'single' as const,
    content: '下列各项中，属于{kp}的是？',
    options: ['选项A：正确答案', '选项B：错误答案', '选项C：错误答案', '选项D：错误答案'],
    answer: 'A',
    analysis: '本题考查{kp}的基本概念。A选项正确，因为...。B选项错误，因为...。',
    difficulty: 'easy' as const,
    score: 1,
  },
  {
    type: 'single' as const,
    content: '关于{kp}，下列说法正确的是？',
    options: ['选项A：错误说法', '选项B：正确说法', '选项C：错误说法', '选项D：错误说法'],
    answer: 'B',
    analysis: 'B选项正确。A选项错误，因为...。C选项错误，因为...。D选项错误，因为...。',
    difficulty: 'medium' as const,
    score: 2,
  },
  {
    type: 'multiple' as const,
    content: '下列各项中，属于{kp}内容的有？',
    options: ['选项A：正确内容', '选项B：正确内容', '选项C：错误内容', '选项D：正确内容'],
    answer: ['A', 'B', 'D'],
    analysis: 'ABD正确。{kp}包括以下内容：1)... 2)... 3)...。C选项不属于{kp}的内容。',
    difficulty: 'medium' as const,
    score: 2,
  },
  {
    type: 'judge' as const,
    content: '{kp}是会计核算的基本前提之一。',
    answer: '正确',
    analysis: '正确。{kp}是会计核算的基本前提，它规定了...。',
    difficulty: 'easy' as const,
    score: 1,
  },
  {
    type: 'judge' as const,
    content: '企业在进行{kp}处理时，应当遵循谨慎性原则。',
    answer: '正确',
    analysis: '正确。谨慎性原则要求企业在进行{kp}处理时，不应高估资产或收益，低估负债或费用。',
    difficulty: 'medium' as const,
    score: 1,
  },
  {
    type: 'subjective' as const,
    content: '请简述{kp}的主要内容及其在实际工作中的应用。',
    answer:
      '参考答案：\n1. {kp}的定义和概念\n2. 主要内容包括：\n   - 内容一：...\n   - 内容二：...\n   - 内容三：...\n3. 实际应用：\n   - 应用场景一\n   - 应用场景二\n4. 重要性和意义',
    analysis:
      '本题考查对{kp}的综合理解。答题时应从定义、内容、应用等多个角度进行阐述，注意条理清晰，逻辑严谨。',
    difficulty: 'hard' as const,
    score: 5,
  },
  {
    type: 'single' as const,
    content: '某企业{kp}的金额为100万元，下列处理正确的是？',
    options: [
      'A. 计入当期损益',
      'B. 计入资产成本',
      'C. 计入所有者权益',
      'D. 计入负债',
    ],
    answer: 'B',
    analysis: 'B选项正确。根据会计准则，{kp}应当计入资产成本，因为它符合资产的确认条件。',
    difficulty: 'hard' as const,
    score: 2,
  },
];

export const questions: Question[] = [];

let questionId = 1;
chapters.forEach((chapter) => {
  chapter.knowledgePoints.forEach((kp) => {
    const kpQuestions = questionTemplates.map((tpl, idx) => ({
      id: `q-${questionId++}`,
      type: tpl.type,
      content: tpl.content.replace(/{kp}/g, kp.name),
      options: tpl.options,
      answer: Array.isArray(tpl.answer)
        ? tpl.answer
        : (tpl.answer as string).replace(/{kp}/g, kp.name),
      analysis: tpl.analysis.replace(/{kp}/g, kp.name),
      chapterId: chapter.id,
      knowledgePointId: kp.id,
      difficulty: tpl.difficulty,
      score: tpl.score,
      isRealExam: idx % 5 === 0,
      year: idx % 5 === 0 ? 2023 - (idx % 3) : undefined,
    }));
    questions.push(...kpQuestions);
  });
});

export const getQuestionsByChapter = (chapterId: string): Question[] => {
  return questions.filter((q) => q.chapterId === chapterId);
};

export const getQuestionsByKnowledgePoint = (kpId: string): Question[] => {
  return questions.filter((q) => q.knowledgePointId === kpId);
};

export const getRealExamQuestions = (_certificateId: string): Question[] => {
  return questions.filter((q) => q.isRealExam);
};

export const getMockExamQuestions = (
  _certificateId: string,
  count: number = 50
): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const psychologicalTips = [
  { day: 7, title: '考前一周：保持节奏，稳中求进', content: '距离考试还有一周，不要慌张。保持每天的学习节奏，重点复习薄弱环节，同时保证充足的睡眠。记住：你已经准备了很久，相信自己！' },
  { day: 3, title: '考前三天：调整状态，轻松备考', content: '考前三天，建议减少新内容的学习，重点回顾错题和重要知识点。适当放松，听听音乐，散散步，保持良好的心态。' },
  { day: 1, title: '考前一天：放松心情，准备充分', content: '明天就要考试了！今天不要再做难题，可以快速浏览一遍知识点框架。准备好考试用品：准考证、身份证、文具等。早点休息，保持充沛的精力。相信自己，你一定可以的！加油！💪' },
];

export const defaultReminders: StudyReminder[] = [
  {
    id: 'reminder-1',
    type: 'study',
    title: '每日学习提醒',
    content: '今天的学习任务还没完成哦，快来学习吧！每天进步一点点，考试通关不是梦~',
    date: new Date().toISOString().split('T')[0],
    read: false,
  },
];
