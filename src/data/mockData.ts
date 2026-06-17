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

const chaptersData: Record<string, Omit<Chapter, 'id' | 'certificateId'>[]> = {
  'cert-1': [
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
  ],
  'cert-2': [
    {
      name: '教师职业理念',
      order: 1,
      knowledgePoints: [
        { id: 'kp-t1-1', name: '教育观', chapterId: 'ch-t1' },
        { id: 'kp-t1-2', name: '学生观', chapterId: 'ch-t1' },
        { id: 'kp-t1-3', name: '教师观', chapterId: 'ch-t1' },
      ],
      totalQuestions: 50,
      estimatedTime: 100,
    },
    {
      name: '教育法律法规',
      order: 2,
      knowledgePoints: [
        { id: 'kp-t2-1', name: '《教育法》', chapterId: 'ch-t2' },
        { id: 'kp-t2-2', name: '《义务教育法》', chapterId: 'ch-t2' },
        { id: 'kp-t2-3', name: '《教师法》', chapterId: 'ch-t2' },
        { id: 'kp-t2-4', name: '《未成年人保护法》', chapterId: 'ch-t2' },
      ],
      totalQuestions: 65,
      estimatedTime: 130,
    },
    {
      name: '教师职业道德规范',
      order: 3,
      knowledgePoints: [
        { id: 'kp-t3-1', name: '爱国守法', chapterId: 'ch-t3' },
        { id: 'kp-t3-2', name: '爱岗敬业', chapterId: 'ch-t3' },
        { id: 'kp-t3-3', name: '关爱学生', chapterId: 'ch-t3' },
        { id: 'kp-t3-4', name: '教书育人', chapterId: 'ch-t3' },
      ],
      totalQuestions: 55,
      estimatedTime: 110,
    },
    {
      name: '文化素养',
      order: 4,
      knowledgePoints: [
        { id: 'kp-t4-1', name: '历史文化常识', chapterId: 'ch-t4' },
        { id: 'kp-t4-2', name: '科学文化常识', chapterId: 'ch-t4' },
        { id: 'kp-t4-3', name: '文学常识', chapterId: 'ch-t4' },
        { id: 'kp-t4-4', name: '艺术常识', chapterId: 'ch-t4' },
      ],
      totalQuestions: 70,
      estimatedTime: 140,
    },
    {
      name: '教师基本能力',
      order: 5,
      knowledgePoints: [
        { id: 'kp-t5-1', name: '阅读理解能力', chapterId: 'ch-t5' },
        { id: 'kp-t5-2', name: '逻辑思维能力', chapterId: 'ch-t5' },
        { id: 'kp-t5-3', name: '信息处理能力', chapterId: 'ch-t5' },
      ],
      totalQuestions: 60,
      estimatedTime: 120,
    },
    {
      name: '教育基础知识',
      order: 6,
      knowledgePoints: [
        { id: 'kp-t6-1', name: '教育的本质与起源', chapterId: 'ch-t6' },
        { id: 'kp-t6-2', name: '教育学发展历程', chapterId: 'ch-t6' },
        { id: 'kp-t6-3', name: '教育与人的发展', chapterId: 'ch-t6' },
      ],
      totalQuestions: 65,
      estimatedTime: 130,
    },
    {
      name: '中学课程与教学',
      order: 7,
      knowledgePoints: [
        { id: 'kp-t7-1', name: '课程理论', chapterId: 'ch-t7' },
        { id: 'kp-t7-2', name: '教学原则与方法', chapterId: 'ch-t7' },
        { id: 'kp-t7-3', name: '教学组织形式', chapterId: 'ch-t7' },
      ],
      totalQuestions: 55,
      estimatedTime: 110,
    },
    {
      name: '中学生学习心理',
      order: 8,
      knowledgePoints: [
        { id: 'kp-t8-1', name: '认知过程', chapterId: 'ch-t8' },
        { id: 'kp-t8-2', name: '学习理论', chapterId: 'ch-t8' },
        { id: 'kp-t8-3', name: '学习动机', chapterId: 'ch-t8' },
        { id: 'kp-t8-4', name: '学习迁移', chapterId: 'ch-t8' },
      ],
      totalQuestions: 60,
      estimatedTime: 120,
    },
    {
      name: '中学生发展心理',
      order: 9,
      knowledgePoints: [
        { id: 'kp-t9-1', name: '中学生身心发展', chapterId: 'ch-t9' },
        { id: 'kp-t9-2', name: '情绪情感发展', chapterId: 'ch-t9' },
        { id: 'kp-t9-3', name: '人格发展', chapterId: 'ch-t9' },
      ],
      totalQuestions: 50,
      estimatedTime: 100,
    },
    {
      name: '中学德育与班级管理',
      order: 10,
      knowledgePoints: [
        { id: 'kp-t10-1', name: '德育原则与方法', chapterId: 'ch-t10' },
        { id: 'kp-t10-2', name: '班级管理', chapterId: 'ch-t10' },
        { id: 'kp-t10-3', name: '班主任工作', chapterId: 'ch-t10' },
      ],
      totalQuestions: 55,
      estimatedTime: 110,
    },
  ],
  'cert-3': [
    {
      name: '计算机基础知识',
      order: 1,
      knowledgePoints: [
        { id: 'kp-c1-1', name: '计算机系统组成', chapterId: 'ch-c1' },
        { id: 'kp-c1-2', name: '计算机中数据的表示', chapterId: 'ch-c1' },
        { id: 'kp-c1-3', name: '操作系统基础', chapterId: 'ch-c1' },
      ],
      totalQuestions: 60,
      estimatedTime: 120,
    },
    {
      name: 'Office应用',
      order: 2,
      knowledgePoints: [
        { id: 'kp-c2-1', name: 'Word操作', chapterId: 'ch-c2' },
        { id: 'kp-c2-2', name: 'Excel操作', chapterId: 'ch-c2' },
        { id: 'kp-c2-3', name: 'PowerPoint操作', chapterId: 'ch-c2' },
        { id: 'kp-c2-4', name: '文档排版技巧', chapterId: 'ch-c2' },
      ],
      totalQuestions: 75,
      estimatedTime: 150,
    },
    {
      name: '程序设计基础',
      order: 3,
      knowledgePoints: [
        { id: 'kp-c3-1', name: '程序设计方法', chapterId: 'ch-c3' },
        { id: 'kp-c3-2', name: '算法与数据结构', chapterId: 'ch-c3' },
        { id: 'kp-c3-3', name: '结构化程序设计', chapterId: 'ch-c3' },
      ],
      totalQuestions: 65,
      estimatedTime: 130,
    },
    {
      name: 'C语言编程',
      order: 4,
      knowledgePoints: [
        { id: 'kp-c4-1', name: 'C语言基础语法', chapterId: 'ch-c4' },
        { id: 'kp-c4-2', name: '选择与循环结构', chapterId: 'ch-c4' },
        { id: 'kp-c4-3', name: '数组与函数', chapterId: 'ch-c4' },
        { id: 'kp-c4-4', name: '指针与结构体', chapterId: 'ch-c4' },
      ],
      totalQuestions: 80,
      estimatedTime: 160,
    },
    {
      name: '数据库基础',
      order: 5,
      knowledgePoints: [
        { id: 'kp-c5-1', name: '数据库基本概念', chapterId: 'ch-c5' },
        { id: 'kp-c5-2', name: 'SQL语言基础', chapterId: 'ch-c5' },
        { id: 'kp-c5-3', name: 'Access数据库操作', chapterId: 'ch-c5' },
      ],
      totalQuestions: 55,
      estimatedTime: 110,
    },
    {
      name: '网络技术基础',
      order: 6,
      knowledgePoints: [
        { id: 'kp-c6-1', name: '计算机网络基础', chapterId: 'ch-c6' },
        { id: 'kp-c6-2', name: 'Internet基础', chapterId: 'ch-c6' },
        { id: 'kp-c6-3', name: '网络安全基础', chapterId: 'ch-c6' },
      ],
      totalQuestions: 50,
      estimatedTime: 100,
    },
  ],
  'cert-4': [
    {
      name: '听力理解',
      order: 1,
      knowledgePoints: [
        { id: 'kp-e1-1', name: '短对话技巧', chapterId: 'ch-e1' },
        { id: 'kp-e1-2', name: '长对话技巧', chapterId: 'ch-e1' },
        { id: 'kp-e1-3', name: '短文理解技巧', chapterId: 'ch-e1' },
        { id: 'kp-e1-4', name: '听力填空技巧', chapterId: 'ch-e1' },
      ],
      totalQuestions: 70,
      estimatedTime: 140,
    },
    {
      name: '阅读理解',
      order: 2,
      knowledgePoints: [
        { id: 'kp-e2-1', name: '快速阅读技巧', chapterId: 'ch-e2' },
        { id: 'kp-e2-2', name: '仔细阅读技巧', chapterId: 'ch-e2' },
        { id: 'kp-e2-3', name: '信息匹配技巧', chapterId: 'ch-e2' },
      ],
      totalQuestions: 75,
      estimatedTime: 150,
    },
    {
      name: '词汇与语法',
      order: 3,
      knowledgePoints: [
        { id: 'kp-e3-1', name: '核心词汇记忆', chapterId: 'ch-e3' },
        { id: 'kp-e3-2', name: '词根词缀法', chapterId: 'ch-e3' },
        { id: 'kp-e3-3', name: '语法知识体系', chapterId: 'ch-e3' },
        { id: 'kp-e3-4', name: '重点语法项目', chapterId: 'ch-e3' },
      ],
      totalQuestions: 65,
      estimatedTime: 130,
    },
    {
      name: '完形填空',
      order: 4,
      knowledgePoints: [
        { id: 'kp-e4-1', name: '完形填空策略', chapterId: 'ch-e4' },
        { id: 'kp-e4-2', name: '上下文理解', chapterId: 'ch-e4' },
        { id: 'kp-e4-3', name: '词义辨析技巧', chapterId: 'ch-e4' },
      ],
      totalQuestions: 55,
      estimatedTime: 110,
    },
    {
      name: '翻译技巧',
      order: 5,
      knowledgePoints: [
        { id: 'kp-e5-1', name: '汉译英技巧', chapterId: 'ch-e5' },
        { id: 'kp-e5-2', name: '句型转换', chapterId: 'ch-e5' },
        { id: 'kp-e5-3', name: '文化词汇翻译', chapterId: 'ch-e5' },
        { id: 'kp-e5-4', name: '翻译常见错误', chapterId: 'ch-e5' },
      ],
      totalQuestions: 60,
      estimatedTime: 120,
    },
    {
      name: '写作技巧',
      order: 6,
      knowledgePoints: [
        { id: 'kp-e6-1', name: '议论文写作', chapterId: 'ch-e6' },
        { id: 'kp-e6-2', name: '说明文写作', chapterId: 'ch-e6' },
        { id: 'kp-e6-3', name: '应用文写作', chapterId: 'ch-e6' },
      ],
      totalQuestions: 50,
      estimatedTime: 100,
    },
    {
      name: '真题精讲',
      order: 7,
      knowledgePoints: [
        { id: 'kp-e7-1', name: '2023年真题解析', chapterId: 'ch-e7' },
        { id: 'kp-e7-2', name: '2024年真题解析', chapterId: 'ch-e7' },
        { id: 'kp-e7-3', name: '高频考点总结', chapterId: 'ch-e7' },
      ],
      totalQuestions: 45,
      estimatedTime: 90,
    },
  ],
};

export const chapters: Chapter[] = [];

Object.entries(chaptersData).forEach(([certId, certChapters]) => {
  certChapters.forEach((ch, index) => {
    const chapterId = `${certId}-ch-${index + 1}`;
    chapters.push({
      ...ch,
      id: chapterId,
      certificateId: certId,
      knowledgePoints: ch.knowledgePoints.map((kp) => ({
        ...kp,
        chapterId,
        id: `${certId}-${kp.id}`,
      })),
    });
  });
});

const generateQuestionTemplates = (kpName: string) => [
  {
    type: 'single' as const,
    content: `下列各项中，属于${kpName}的是？`,
    options: ['选项A：正确答案', '选项B：错误答案', '选项C：错误答案', '选项D：错误答案'],
    answer: 'A',
    analysis: `本题考查${kpName}的基本概念。A选项正确，因为...。B选项错误，因为...。`,
    difficulty: 'easy' as const,
    score: 1,
  },
  {
    type: 'single' as const,
    content: `关于${kpName}，下列说法正确的是？`,
    options: ['选项A：错误说法', '选项B：正确说法', '选项C：错误说法', '选项D：错误说法'],
    answer: 'B',
    analysis: 'B选项正确。A选项错误，因为...。C选项错误，因为...。D选项错误，因为...。',
    difficulty: 'medium' as const,
    score: 2,
  },
  {
    type: 'multiple' as const,
    content: `下列各项中，属于${kpName}内容的有？`,
    options: ['选项A：正确内容', '选项B：正确内容', '选项C：错误内容', '选项D：正确内容'],
    answer: ['A', 'B', 'D'],
    analysis: `ABD正确。${kpName}包括以下内容：1)... 2)... 3)...。C选项不属于${kpName}的内容。`,
    difficulty: 'medium' as const,
    score: 2,
  },
  {
    type: 'judge' as const,
    content: `${kpName}是本学科的重要基础知识之一。`,
    answer: '正确',
    analysis: `正确。${kpName}是本学科的重要基础知识，它规定了...。`,
    difficulty: 'easy' as const,
    score: 1,
  },
  {
    type: 'judge' as const,
    content: `在进行${kpName}处理时，应当遵循相关原则。`,
    answer: '正确',
    analysis: `正确。相关原则要求在进行${kpName}处理时，应保持谨慎和专业。`,
    difficulty: 'medium' as const,
    score: 1,
  },
  {
    type: 'subjective' as const,
    content: `请简述${kpName}的主要内容及其在实际工作中的应用。`,
    answer:
      `参考答案：\n1. ${kpName}的定义和概念\n2. 主要内容包括：\n   - 内容一：...\n   - 内容二：...\n   - 内容三：...\n3. 实际应用：\n   - 应用场景一\n   - 应用场景二\n4. 重要性和意义`,
    analysis:
      `本题考查对${kpName}的综合理解。答题时应从定义、内容、应用等多个角度进行阐述，注意条理清晰，逻辑严谨。`,
    difficulty: 'hard' as const,
    score: 5,
  },
  {
    type: 'single' as const,
    content: `某案例中涉及${kpName}的金额为100万元，下列处理正确的是？`,
    options: [
      'A. 计入当期损益',
      'B. 计入资产成本',
      'C. 计入所有者权益',
      'D. 计入负债',
    ],
    answer: 'B',
    analysis: `B选项正确。根据相关规定，${kpName}应当计入资产成本，因为它符合资产的确认条件。`,
    difficulty: 'hard' as const,
    score: 2,
  },
];

export const questions: Question[] = [];

let questionId = 1;
chapters.forEach((chapter) => {
  chapter.knowledgePoints.forEach((kp) => {
    const templates = generateQuestionTemplates(kp.name);
    const kpQuestions = templates.map((tpl, idx) => ({
      id: `q-${questionId++}`,
      type: tpl.type,
      content: tpl.content,
      options: tpl.options,
      answer: Array.isArray(tpl.answer)
        ? tpl.answer
        : (tpl.answer as string),
      analysis: tpl.analysis,
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

export const getChaptersByCertificate = (certificateId: string): Chapter[] => {
  return chapters.filter((c) => c.certificateId === certificateId);
};

export const getQuestionsByChapter = (chapterId: string): Question[] => {
  return questions.filter((q) => q.chapterId === chapterId);
};

export const getQuestionsByKnowledgePoint = (kpId: string): Question[] => {
  return questions.filter((q) => q.knowledgePointId === kpId);
};

export const getRealExamQuestions = (certificateId: string): Question[] => {
  const certChapters = getChaptersByCertificate(certificateId);
  const certChapterIds = certChapters.map((c) => c.id);
  return questions.filter((q) => certChapterIds.includes(q.chapterId) && q.isRealExam);
};

export const getMockExamQuestions = (
  certificateId: string,
  count: number = 50
): Question[] => {
  const certChapters = getChaptersByCertificate(certificateId);
  const certChapterIds = certChapters.map((c) => c.id);
  const certQuestions = questions.filter((q) => certChapterIds.includes(q.chapterId));
  const shuffled = [...certQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getKnowledgePointById = (kpId: string) => {
  for (const chapter of chapters) {
    const kp = chapter.knowledgePoints.find((k) => k.id === kpId);
    if (kp) return kp;
  }
  return null;
};

export const getChapterByKnowledgePoint = (kpId: string) => {
  for (const chapter of chapters) {
    if (chapter.knowledgePoints.some((k) => k.id === kpId)) {
      return chapter;
    }
  }
  return null;
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
