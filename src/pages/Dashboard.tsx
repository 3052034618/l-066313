import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { ProgressBar } from '@/components/UI/ProgressBar';
import { useApp } from '@/context/AppContext';
import { getDaysRemaining, getOverallProgress, getTodayTask, formatTime } from '@/utils/studyPlan';
import { certificates } from '@/data/mockData';

export const Dashboard: React.FC = () => {
  const { userProfile, studyPlan, wrongQuestions, reminders, examRecords, markReminderRead } = useApp();

  const todayTask = getTodayTask(studyPlan);
  const daysRemaining = getDaysRemaining(userProfile.examDate);
  const overallProgress = getOverallProgress(studyPlan);
  const currentCertificate = certificates.find((c) => c.id === userProfile.targetCertificateId);
  const unreadReminders = reminders.filter((r) => !r.read).length;

  const getExamStatus = () => {
    if (!userProfile.examDate) return { text: '未设置考试日期', color: 'text-text-secondary' };
    if (daysRemaining <= 0) return { text: '考试已结束', color: 'text-danger' };
    if (daysRemaining <= 7) return { text: '冲刺阶段', color: 'text-danger' };
    if (daysRemaining <= 30) return { text: '强化阶段', color: 'text-warning' };
    return { text: '基础阶段', color: 'text-success' };
  };

  const examStatus = getExamStatus();

  if (!userProfile.targetCertificateId) {
    return (
      <PageLayout title="备考助手">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">开始你的备考之旅</h2>
          <p className="text-text-secondary text-center mb-6">
            选择目标证书，定制专属学习计划
          </p>
          <Link
            to="/settings"
            className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            立即开始
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            你好，{userProfile.name} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">今天也要加油哦~</p>
        </div>
        <Link
          to="/settings"
          className="relative w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center"
        >
          <span className="text-lg">⚙️</span>
          {unreadReminders > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
              {unreadReminders > 9 ? '9+' : unreadReminders}
            </span>
          )}
        </Link>
      </div>

      <Card className="mb-4 bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentCertificate?.icon || '📊'}</span>
              <div>
                <h3 className="font-semibold text-lg">{currentCertificate?.name || '未选择'}</h3>
                <span className={`text-sm opacity-90 ${examStatus.color}`}>
                  {examStatus.text}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-xs opacity-80">剩余天数</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{overallProgress}%</p>
              <p className="text-xs opacity-80">学习进度</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userProfile.studyStreak}</p>
              <p className="text-xs opacity-80">连续学习</p>
            </div>
          </div>

          <ProgressBar
            progress={overallProgress}
            color="success"
            height="sm"
          />
        </div>
      </Card>

      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">📋 今日任务</h3>
            <Link to="/plan" className="text-sm text-primary">
              查看全部 →
            </Link>
          </div>
          {todayTask ? (
            <div className="bg-bg-tertiary rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">
                  {todayTask.chapterName}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  todayTask.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {todayTask.completed ? '已完成' : '进行中'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>📝 {todayTask.questionCount} 道题</span>
                <span>⏱️ {formatTime(todayTask.estimatedTime)}</span>
              </div>
              {!todayTask.completed && (
                <Link
                  to={`/practice/chapter/${todayTask.chapterId}`}
                  className="block w-full mt-3 py-2 bg-primary text-white text-center rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  开始学习
                </Link>
              )}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">今天没有学习任务，好好休息吧~</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <Link to="/practice" className="block p-4">
            <div className="text-3xl mb-2">📝</div>
            <h4 className="font-medium text-text-primary">章节练习</h4>
            <p className="text-xs text-text-secondary mt-1">按章节刷题巩固</p>
          </Link>
        </Card>
        <Card>
          <Link to="/wrong" className="block p-4">
            <div className="text-3xl mb-2">❌</div>
            <h4 className="font-medium text-text-primary">错题本</h4>
            <p className="text-xs text-text-secondary mt-1">
              {wrongQuestions.length} 道错题
            </p>
          </Link>
        </Card>
        <Card>
          <Link to="/exam" className="block p-4">
            <div className="text-3xl mb-2">📄</div>
            <h4 className="font-medium text-text-primary">模拟考试</h4>
            <p className="text-xs text-text-secondary mt-1">
              {examRecords.length} 次记录
            </p>
          </Link>
        </Card>
        <Card>
          <Link to="/analysis" className="block p-4">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-medium text-text-primary">学习分析</h4>
            <p className="text-xs text-text-secondary mt-1">查看学习趋势</p>
          </Link>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">🔔 学习提醒</h3>
            {userProfile.dailyReminderTime && (
              <span className="text-xs text-text-tertiary">
                每日 {userProfile.dailyReminderTime} 提醒
              </span>
            )}
          </div>
          <div className="space-y-2">
            {reminders.filter((r) => !r.read).length > 0 ? (
              reminders.filter((r) => !r.read).slice(0, 5).map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-lg border ${
                    reminder.type === 'exam-7' || reminder.type === 'exam-3' || reminder.type === 'exam-1'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                  onClick={() => markReminderRead(reminder.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {reminder.type === 'exam-7' || reminder.type === 'exam-3' || reminder.type === 'exam-1'
                        ? '🔥'
                        : reminder.type === 'study'
                        ? '⏰'
                        : '📢'}
                    </span>
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${
                        reminder.type === 'exam-7' || reminder.type === 'exam-3' || reminder.type === 'exam-1'
                          ? 'text-orange-800'
                          : 'text-yellow-800'
                      }`}>
                        {reminder.title}
                      </h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        reminder.type === 'exam-7' || reminder.type === 'exam-3' || reminder.type === 'exam-1'
                          ? 'text-orange-700'
                          : 'text-yellow-700'
                      }`}>
                        {reminder.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-text-tertiary">
                <p className="text-lg mb-1">✅</p>
                <p className="text-sm">今天没有待处理的提醒</p>
              </div>
            )}
          </div>
          {reminders.filter((r) => !r.read).length > 5 && (
            <p className="text-center text-xs text-text-tertiary mt-3">
              还有 {reminders.filter((r) => !r.read).length - 5} 条未读提醒
            </p>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};
