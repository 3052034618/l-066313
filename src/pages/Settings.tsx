import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { useApp } from '@/context/AppContext';
import { certificates, questions } from '@/data/mockData';
import { formatDate } from '@/utils/studyPlan';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile, createStudyPlan, resetAllData } = useApp();

  const [step, setStep] = useState<'main' | 'certificate' | 'exam' | 'level'>('main');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    userProfile.targetCertificateId
  );
  const [examDate, setExamDate] = useState<string>(userProfile.examDate || '');
  const [dailyStudyTime, setDailyStudyTime] = useState<number>(userProfile.dailyStudyTime);
  const [initialLevel, setInitialLevel] = useState<number>(userProfile.initialLevel);
  const [showLevelTest, setShowLevelTest] = useState(false);
  const [levelTestResult, setLevelTestResult] = useState<number | null>(null);

  const timeOptions = [30, 60, 90, 120, 180];

  const handleSaveCertificate = () => {
    if (!selectedCertificate) return;
    setStep('exam');
  };

  const handleSaveExamDate = () => {
    if (!examDate) return;
    setStep('level');
  };

  const handleFinishSetup = () => {
    createStudyPlan(
      selectedCertificate!,
      examDate,
      dailyStudyTime,
      initialLevel
    );
    navigate('/');
  };

  const handleStartLevelTest = () => {
    setShowLevelTest(true);
    setLevelTestResult(null);
  };

  const handleLevelTestComplete = (result: number) => {
    setLevelTestResult(result);
    setInitialLevel(result);
    setShowLevelTest(false);
  };

  const handleResetData = () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      resetAllData();
      navigate('/');
    }
  };

  const renderMainSettings = () => (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">👤 个人信息</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary block mb-1">昵称</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => updateUserProfile({ name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">🎯 目标证书</h3>
            <button
              onClick={() => setStep('certificate')}
              className="text-sm text-primary"
            >
              修改
            </button>
          </div>
          {userProfile.targetCertificateId ? (
            <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
              <span className="text-2xl">
                {certificates.find((c) => c.id === userProfile.targetCertificateId)?.icon}
              </span>
              <div>
                <p className="font-medium text-text-primary">
                  {certificates.find((c) => c.id === userProfile.targetCertificateId)?.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {certificates.find((c) => c.id === userProfile.targetCertificateId)?.description}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">未选择证书</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">📅 考试信息</h3>
            <button
              onClick={() => setStep('exam')}
              className="text-sm text-primary"
            >
              修改
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary block mb-1">考试日期</label>
              <p className="text-text-primary font-medium">
                {userProfile.examDate ? formatDate(userProfile.examDate) : '未设置'}
              </p>
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">每日学习时长</label>
              <p className="text-text-primary font-medium">
                {userProfile.dailyStudyTime} 分钟
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">📊 初始水平</h3>
            <button
              onClick={handleStartLevelTest}
              className="text-sm text-primary"
            >
              重新测试
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">水平评分</span>
                <span className="font-medium text-text-primary">{initialLevel}分</span>
              </div>
              <div className="w-full h-2 bg-bg-tertiary rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${initialLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">⚙️ 其他设置</h3>
          <div className="space-y-3">
            <button
              className="w-full p-3 text-left bg-bg-tertiary rounded-lg text-text-primary hover:bg-bg-tertiary/80 transition-colors"
              onClick={() => navigate('/analysis')}
            >
              📈 学习数据分析
            </button>
            <button
              className="w-full p-3 text-left bg-bg-tertiary rounded-lg text-text-primary hover:bg-bg-tertiary/80 transition-colors"
              onClick={() => navigate('/wrong')}
            >
              ❌ 错题本管理
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">⚠️ 危险操作</h3>
          <Button variant="danger" onClick={handleResetData} className="w-full">
            重置所有数据
          </Button>
          <p className="text-xs text-text-tertiary mt-2 text-center">
            清除所有学习记录、错题和设置
          </p>
        </div>
      </Card>
    </div>
  );

  const renderCertificateSelect = () => (
    <div className="space-y-3">
      {certificates.map((cert) => (
        <Card
          key={cert.id}
          onClick={() => setSelectedCertificate(cert.id)}
          className={`cursor-pointer border-2 transition-all ${
            selectedCertificate === cert.id
              ? 'border-primary'
              : 'border-transparent'
          }`}
        >
          <div className="p-4 flex items-center gap-4">
            <span className="text-4xl">{cert.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">{cert.name}</h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {cert.description}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-text-tertiary">
                <span>{cert.totalChapters} 章节</span>
                <span>{cert.totalQuestions} 题</span>
                <span>{cert.examDuration} 分钟</span>
              </div>
            </div>
            {selectedCertificate === cert.id && (
              <span className="text-primary text-xl">✓</span>
            )}
          </div>
        </Card>
      ))}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={() => setStep('main')}>
          返回
        </Button>
        <Button
          className="flex-1"
          onClick={handleSaveCertificate}
          disabled={!selectedCertificate}
        >
          下一步
        </Button>
      </div>
    </div>
  );

  const renderExamSettings = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">📅 考试日期</h3>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-3 border border-border rounded-lg focus:border-primary focus:outline-none text-lg"
          />
          <p className="text-xs text-text-tertiary mt-2">
            系统将根据考试日期自动安排学习计划
          </p>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">⏱️ 每日学习时长</h3>
          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map((time) => (
              <button
                key={time}
                onClick={() => setDailyStudyTime(time)}
                className={`py-3 rounded-lg border-2 font-medium transition-all ${
                  dailyStudyTime === time
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-text-primary hover:border-primary/50'
                }`}
              >
                {time}分钟
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep('certificate')}>
          返回
        </Button>
        <Button
          className="flex-1"
          onClick={handleSaveExamDate}
          disabled={!examDate}
        >
          下一步
        </Button>
      </div>
    </div>
  );

  const renderLevelSettings = () => (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-4">📊 评估初始水平</h3>
          <p className="text-sm text-text-secondary mb-4">
            系统将根据你的水平自动调整学习计划难度
          </p>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">自评分</span>
              <span className="font-medium text-primary">{initialLevel}分</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={initialLevel}
              onChange={(e) => setInitialLevel(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-tertiary">
              <span>零基础</span>
              <span>有基础</span>
              <span>很熟练</span>
            </div>
          </div>
          {levelTestResult !== null && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-700">
                ✅ 测试完成，你的水平得分为 <strong>{levelTestResult}分</strong>
              </p>
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={handleStartLevelTest}>
            {showLevelTest ? '取消测试' : levelTestResult !== null ? '重新测试' : '做个水平测试'}
          </Button>
        </div>
      </Card>

      {showLevelTest && (
        <LevelTest onComplete={handleLevelTestComplete} onCancel={() => setShowLevelTest(false)} />
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={() => setStep('exam')}>
          返回
        </Button>
        <Button className="flex-1" onClick={handleFinishSetup}>
          生成学习计划
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout
      title={
        step === 'main'
          ? '个人设置'
          : step === 'certificate'
          ? '选择证书'
          : step === 'exam'
          ? '考试设置'
          : '水平评估'
      }
      onBack={step !== 'main' ? () => setStep('main') : undefined}
    >
      {step === 'main' && renderMainSettings()}
      {step === 'certificate' && renderCertificateSelect()}
      {step === 'exam' && renderExamSettings()}
      {step === 'level' && renderLevelSettings()}
    </PageLayout>
  );
};

interface LevelTestProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const LevelTest: React.FC<LevelTestProps> = ({ onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const testQuestions = questions.slice(0, 10);
  const currentQuestion = testQuestions[currentIndex];

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      let correct = 0;
      testQuestions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer) {
          if (Array.isArray(q.answer)) {
            if (
              Array.isArray(userAnswer) &&
              q.answer.length === userAnswer.length &&
              q.answer.every((a) => userAnswer.includes(a))
            ) {
              correct++;
            }
          } else {
            if (userAnswer === q.answer) {
              correct++;
            }
          }
        }
      });
      const score = Math.round((correct / testQuestions.length) * 100);
      onComplete(score);
    }
  };

  if (!currentQuestion) return null;

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between text-sm text-text-secondary mb-4">
          <span>水平测试</span>
          <span>{currentIndex + 1} / {testQuestions.length}</span>
        </div>
        <div className="w-full h-1 bg-bg-tertiary rounded-full mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / testQuestions.length) * 100}%` }}
          />
        </div>

        <div className="mb-4">
          <p className="font-medium text-text-primary mb-3">
            {currentIndex + 1}. {currentQuestion.content}
          </p>
          {currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => {
                const optionLabel = String.fromCharCode(65 + idx);
                const isSelected = answers[currentQuestion.id] === optionLabel ||
                  (Array.isArray(answers[currentQuestion.id]) &&
                    (answers[currentQuestion.id] as string[]).includes(optionLabel));

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(optionLabel)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium mr-2">{optionLabel}.</span>
                    {option.replace(/^[A-D]\.\s*/, '').replace(/^选项[A-D]：/, '')}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            {currentIndex < testQuestions.length - 1 ? '下一题' : '完成测试'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
