import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { useApp } from '@/context/AppContext';
import { getChaptersByCertificate, getQuestionsByChapter } from '@/data/mockData';

export const Practice: React.FC = () => {
  const { studyPlan, userProfile } = useApp();

  const certChapters = getChaptersByCertificate(userProfile.targetCertificateId || '');

  const getChapterProgress = (chapterId: string): number => {
    if (!studyPlan) return 0;
    const chapterTasks = studyPlan.dailyTasks.filter((t) => t.chapterId === chapterId);
    const total = chapterTasks.reduce((sum, t) => sum + t.questionCount, 0);
    const completed = chapterTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.completedQuestions, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (!userProfile.targetCertificateId) {
    return (
      <PageLayout title="章节练习">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">请先选择证书</h2>
          <p className="text-text-secondary text-center mb-6">
            选择目标证书后开始练习
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

  return (
    <PageLayout title="章节练习">
      <div className="flex gap-2 mb-4">
        <Link
          to="/practice"
          className="flex-1 py-2 rounded-lg font-medium text-center bg-primary text-white"
        >
          📚 章节练习
        </Link>
        <Link
          to="/practice/real-exam"
          className="flex-1 py-2 rounded-lg font-medium text-center bg-bg-tertiary text-text-secondary"
        >
          📄 历年真题
        </Link>
      </div>

      <div className="space-y-3">
        {certChapters.map((chapter, index) => {
          const questions = getQuestionsByChapter(chapter.id);
          const progress = getChapterProgress(chapter.id);

          return (
            <Card key={chapter.id}>
              <Link
                to={`/practice/chapter/${chapter.id}`}
                className="block p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-text-primary">{chapter.name}</h3>
                      <span className="text-sm text-text-secondary">
                        {questions.length}题
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary mb-2">
                      <span>📝 {chapter.knowledgePoints.length} 知识点</span>
                      <span>⏱️ 约{Math.round(chapter.estimatedTime / 60)}小时</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-tertiary">{progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
};
