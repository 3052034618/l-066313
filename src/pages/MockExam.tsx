import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { QuestionCard } from '@/components/Question/QuestionCard';
import { useApp } from '@/context/AppContext';
import { getMockExamQuestions, certificates, getKnowledgePointById, getChapterByKnowledgePoint } from '@/data/mockData';
import type { Question, ExamRecord, ExamQuestionAnswer } from '@/types';

export const MockExam: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, addExamRecord, addWrongQuestion, addLearningTrend } = useApp();
  const [mode, setMode] = useState<'select' | 'exam' | 'result'>('select');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examResult, setExamResult] = useState<ExamRecord | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentCertificate = certificates.find((c) => c.id === userProfile.targetCertificateId);

  const startExam = (questionCount: number) => {
    const examQuestions = getMockExamQuestions(
      userProfile.targetCertificateId || 'cert-1',
      questionCount
    );
    setQuestions(examQuestions);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(currentCertificate?.examDuration || 120);
    setMode('exam');
  };

  useEffect(() => {
    if (mode === 'exam' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mode]);

  const handleAnswer = (answer: string | string[]) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
  };

  const handleSubmitExam = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let totalScore = 0;
    let userScore = 0;
    const answerDetails: ExamQuestionAnswer[] = [];

    const kpStats: Record<
      string,
      { name: string; total: number; correct: number }
    > = {};

    questions.forEach((q) => {
      totalScore += q.score;
      const userAnswer = answers[q.id] || '';
      let isCorrect = false;

      if (q.type !== 'subjective') {
        if (Array.isArray(q.answer)) {
          if (
            Array.isArray(userAnswer) &&
            q.answer.length === userAnswer.length &&
            q.answer.every((a) => userAnswer.includes(a))
          ) {
            isCorrect = true;
            userScore += q.score;
          }
        } else {
          if (userAnswer === q.answer) {
            isCorrect = true;
            userScore += q.score;
          }
        }

        if (!isCorrect) {
          addWrongQuestion(q, userAnswer);
        }
      }

      answerDetails.push({
        questionId: q.id,
        userAnswer,
        isCorrect,
        score: isCorrect ? q.score : 0,
      });

      const kpId = q.knowledgePointId;
      if (!kpStats[kpId]) {
        const kp = getKnowledgePointById(kpId);
        kpStats[kpId] = { name: kp?.name || kpId, total: 0, correct: 0 };
      }
      kpStats[kpId].total++;
      if (isCorrect) {
        kpStats[kpId].correct++;
      }
    });

    const correctRate = questions.length > 0
      ? Math.round(
          (answerDetails.filter((a) => a.isCorrect).length /
            questions.filter((q) => q.type !== 'subjective').length) *
            100
        )
      : 0;

    const knowledgePointStats = Object.entries(kpStats).map(([id, stat]) => ({
      knowledgePointId: id,
      knowledgePointName: stat.name,
      totalQuestions: stat.total,
      correctCount: stat.correct,
      correctRate: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
    }));

    const examRecord: ExamRecord = {
      id: `exam-${Date.now()}`,
      type: 'mock',
      certificateId: userProfile.targetCertificateId || 'cert-1',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: (currentCertificate?.examDuration || 120) - timeLeft,
      totalScore,
      userScore,
      correctRate,
      answers: answerDetails,
      knowledgePointStats,
    };

    addExamRecord(examRecord);
    setExamResult(examRecord);
    setMode('result');

    const today = new Date().toISOString().split('T')[0];
    addLearningTrend({
      date: today,
      correctRate,
      totalQuestions: questions.length,
      knowledgePointRates: knowledgePointStats.map((kp) => ({
        knowledgePointId: kp.knowledgePointId,
        knowledgePointName: kp.knowledgePointName,
        correctRate: kp.correctRate,
      })),
    });
  };

  const formatTimeLeft = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}分钟`;
  };

  const currentQuestion = questions[currentIndex];

  if (mode === 'select') {
    return (
      <PageLayout title="模拟考试">
        <div className="space-y-4">
          <Card>
            <div className="p-4 text-center">
              <div className="text-5xl mb-3">📄</div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">
                {currentCertificate?.name || '模拟考试'}
              </h3>
              <p className="text-sm text-text-secondary">
                考试时长 {currentCertificate?.examDuration || 120} 分钟 · 及格分 {currentCertificate?.passScore || 60} 分
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-4">选择题量</h3>
              <div className="grid grid-cols-2 gap-3">
                {[20, 30, 50, 80].map((count) => (
                  <button
                    key={count}
                    onClick={() => startExam(count)}
                    className="p-4 border-2 border-border rounded-xl hover:border-primary transition-colors text-left"
                  >
                    <p className="text-2xl font-bold text-primary mb-1">{count}题</p>
                    <p className="text-xs text-text-secondary">
                      约 {Math.round(count * 1.5)} 分钟
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-3">⚠️ 考试规则</h3>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>• 考试开始后将计时，到达时间自动交卷</li>
                <li>• 客观题自动批改，主观题需自行对照答案</li>
                <li>• 错题自动加入错题本，可反复练习</li>
                <li>• 考试结束后生成详细分析报告</li>
              </ul>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (mode === 'result' && examResult) {
    const isPassed = examResult.userScore >= (currentCertificate?.passScore || 60);
    const weakPoints = examResult.knowledgePointStats
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 3);

    return (
      <PageLayout title="考试结果">
        <div className="text-center py-6">
          <div className="text-6xl mb-3">
            {isPassed ? '🎉' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {isPassed ? '恭喜通过！' : '继续加油！'}
          </h2>
          <p className="text-text-secondary text-sm">
            {isPassed ? '你已经达到及格水平' : '距离及格还有一点距离'}
          </p>
        </div>

        <Card className="mb-4">
          <div className="p-6 text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {examResult.userScore.toFixed(0)}
              <span className="text-2xl text-text-tertiary">
                /{examResult.totalScore}
              </span>
            </div>
            <p className="text-text-secondary">
              正确率 {examResult.correctRate}%
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <div className="p-3 text-center">
              <p className="text-xl font-bold text-text-primary">{questions.length}</p>
              <p className="text-xs text-text-secondary">总题数</p>
            </div>
          </Card>
          <Card>
            <div className="p-3 text-center">
              <p className="text-xl font-bold text-success">
                {examResult.answers.filter((a) => a.isCorrect).length}
              </p>
              <p className="text-xs text-text-secondary">答对</p>
            </div>
          </Card>
          <Card>
            <div className="p-3 text-center">
              <p className="text-xl font-bold text-danger">
                {examResult.answers.filter((a) => !a.isCorrect && a.userAnswer).length}
              </p>
              <p className="text-xs text-text-secondary">答错</p>
            </div>
          </Card>
        </div>

        <Card className="mb-4">
          <div className="p-4">
            <h3 className="font-semibold text-text-primary mb-3">📊 薄弱知识点</h3>
            <div className="space-y-2">
              {weakPoints.map((kp) => (
                <div key={kp.knowledgePointId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-primary">{kp.knowledgePointName}</span>
                      <span className="text-text-secondary">{kp.correctRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-tertiary rounded-full">
                      <div
                        className="h-full bg-danger rounded-full"
                        style={{ width: `${kp.correctRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => {
                const weakestKp = weakPoints[0];
                if (weakestKp) {
                  const chapter = getChapterByKnowledgePoint(weakestKp.knowledgePointId);
                  if (chapter) {
                    navigate(`/practice/chapter/${chapter.id}`);
                  }
                }
              }}
            >
              去强化薄弱章节
            </Button>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/analysis')}>
            查看详细分析
          </Button>
          <Button className="flex-1" onClick={() => setMode('select')}>
            再考一次
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="模拟考试"
      onBack={() => {
        if (window.confirm('确定要退出考试吗？')) {
          setMode('select');
        }
      }}
      rightAction={
        <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-danger' : 'text-primary'}`}>
          {formatTimeLeft(timeLeft)}
        </span>
      }
    >
      {currentQuestion && (
        <>
          <div className="w-full h-1 bg-bg-tertiary rounded-full mb-4">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
            <span>第 {currentIndex + 1} / {questions.length} 题</span>
            <span>已答 {Object.keys(answers).length} 题</span>
          </div>

          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            showAnswer={false}
            userAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            mode="exam"
          />

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              上一题
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button
                className="flex-1"
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                下一题
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  if (window.confirm('确定要交卷吗？')) {
                    handleSubmitExam();
                  }
                }}
              >
                交卷
              </Button>
            )}
          </div>

          <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
            <p className="text-xs text-text-secondary mb-2">答题卡</p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    idx === currentIndex
                      ? 'bg-primary text-white'
                      : answers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-white text-text-secondary border border-border'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
};
