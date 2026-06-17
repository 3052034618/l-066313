import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { useApp } from '@/context/AppContext';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  BarController,
} from 'chart.js';
import { Radar, Line, Bar } from 'react-chartjs-2';
import { formatDate } from '@/utils/studyPlan';
import { getChapterByKnowledgePoint, getChaptersByCertificate } from '@/data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  BarController
);

export const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const { examRecords, learningTrends, wrongQuestions, userProfile, studyPlan } = useApp();
  const [viewMode, setViewMode] = useState<'overview' | 'trend' | 'records'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [selectedKP, setSelectedKP] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const fullReportRef = useRef<HTMLDivElement>(null);

  const latestExam = examRecords[0];

  const radarData = latestExam
    ? {
        labels: latestExam.knowledgePointStats.map((kp) => kp.knowledgePointName),
        datasets: [
          {
            label: '正确率',
            data: latestExam.knowledgePointStats.map((kp) => kp.correctRate),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          },
        ],
      }
    : {
        labels: ['知识点1', '知识点2', '知识点3', '知识点4', '知识点5'],
        datasets: [
          {
            label: '正确率',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
          },
        ],
      };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const getTrendData = () => {
    const sortedTrends = [...learningTrends].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let filteredTrends = sortedTrends;
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredTrends = sortedTrends.filter(
        (t) => new Date(t.date) >= weekAgo
      );
    } else {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredTrends = sortedTrends.filter(
        (t) => new Date(t.date) >= monthAgo
      );
    }

    const labels = filteredTrends.map((t) => {
      const d = new Date(t.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const data = filteredTrends.map((t) => t.correctRate);

    return {
      labels,
      datasets: [
        {
          label: '正确率',
          data,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getKnowledgePointTrendData = (kpId: string) => {
    const sortedTrends = [...learningTrends].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let filteredTrends = sortedTrends;
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredTrends = sortedTrends.filter(
        (t) => new Date(t.date) >= weekAgo
      );
    } else {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredTrends = sortedTrends.filter(
        (t) => new Date(t.date) >= monthAgo
      );
    }

    const labels = filteredTrends.map((t) => {
      const d = new Date(t.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const data = filteredTrends.map((t) => {
      const kpRate = t.knowledgePointRates.find((k) => k.knowledgePointId === kpId);
      return kpRate ? kpRate.correctRate : null;
    });

    return { labels, data };
  };

  const getKnowledgePointTrendComparison = () => {
    if (learningTrends.length < 2) return { progress: [], regress: [] };

    const sortedTrends = [...learningTrends].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const latest = sortedTrends[sortedTrends.length - 1];
    const previous = sortedTrends[sortedTrends.length - 2];

    const progress: { id: string; name: string; latestRate: number; previousRate: number; diff: number }[] = [];
    const regress: { id: string; name: string; latestRate: number; previousRate: number; diff: number }[] = [];

    latest.knowledgePointRates.forEach((kp) => {
      const prevKp = previous.knowledgePointRates.find(
        (p) => p.knowledgePointId === kp.knowledgePointId
      );
      if (prevKp) {
        const diff = kp.correctRate - prevKp.correctRate;
        if (diff > 0) {
          progress.push({
            id: kp.knowledgePointId,
            name: kp.knowledgePointName,
            latestRate: kp.correctRate,
            previousRate: prevKp.correctRate,
            diff,
          });
        } else if (diff < 0) {
          regress.push({
            id: kp.knowledgePointId,
            name: kp.knowledgePointName,
            latestRate: kp.correctRate,
            previousRate: prevKp.correctRate,
            diff,
          });
        }
      }
    });

    progress.sort((a, b) => b.diff - a.diff);
    regress.sort((a, b) => a.diff - b.diff);

    return { progress, regress };
  };

  const trendOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const scoreTrendData = {
    labels: examRecords.slice(0, 10).reverse().map((_, i) => `第${i + 1}次`),
    datasets: [
      {
        label: '考试分数',
        data: examRecords.slice(0, 10).reverse().map((r) => r.userScore),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const getWeakPoints = () => {
    if (!latestExam) return [];
    return [...latestExam.knowledgePointStats]
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 5);
  };

  const getStrongPoints = () => {
    if (!latestExam) return [];
    return [...latestExam.knowledgePointStats]
      .sort((a, b) => b.correctRate - a.correctRate)
      .slice(0, 3);
  };

  const goToChapterPractice = (kpId: string) => {
    const chapter = getChapterByKnowledgePoint(kpId);
    if (chapter) {
      navigate(`/practice/chapter/${chapter.id}`);
    }
  };

  const exportPDF = async () => {
    if (!fullReportRef.current) return;

    try {
      const canvas = await html2canvas(fullReportRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save(`学习报告_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败，请重试');
    }
  };

  const getChapterCoverage = () => {
    if (!userProfile.targetCertificateId) return [];
    
    const chapters = getChaptersByCertificate(userProfile.targetCertificateId);
    return chapters.map((chapter) => {
      const chapterTasks = studyPlan?.dailyTasks.filter((t) => t.chapterId === chapter.id) || [];
      const totalQuestions = chapterTasks.reduce((sum, t) => sum + t.questionCount, 0);
      const completedQuestions = chapterTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + t.completedQuestions, 0);
      const coverage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
      
      return {
        chapterName: chapter.name,
        coverage,
        totalQuestions,
        completedQuestions,
      };
    });
  };

  const { progress, regress } = getKnowledgePointTrendComparison();

  const overallStats = {
    totalExams: examRecords.length,
    avgScore:
      examRecords.length > 0
        ? Math.round(
            examRecords.reduce((sum, r) => sum + r.userScore, 0) / examRecords.length
          )
        : 0,
    totalWrong: wrongQuestions.length,
    masteredWrong: wrongQuestions.filter((q) => q.mastered).length,
  };

  const chapterCoverage = getChapterCoverage();

  return (
    <>
      <PageLayout
        title="学习分析"
        rightAction={
          <Button size="sm" variant="outline" onClick={exportPDF}>
            📄 导出报告
          </Button>
        }
      >
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === 'overview'
                ? 'bg-primary text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            📊 总览
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === 'trend'
                ? 'bg-primary text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            📈 趋势
          </button>
          <button
            onClick={() => setViewMode('records')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === 'records'
                ? 'bg-primary text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            📋 记录
          </button>
        </div>

        <div ref={reportRef}>
          {viewMode === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <div className="p-4 text-center">
                    <p className="text-3xl font-bold text-primary">
                      {overallStats.totalExams}
                    </p>
                    <p className="text-sm text-text-secondary">模拟考试次数</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4 text-center">
                    <p className="text-3xl font-bold text-success">
                      {overallStats.avgScore}
                    </p>
                    <p className="text-sm text-text-secondary">平均分</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4 text-center">
                    <p className="text-3xl font-bold text-danger">
                      {overallStats.totalWrong}
                    </p>
                    <p className="text-sm text-text-secondary">错题总数</p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4 text-center">
                    <p className="text-3xl font-bold text-warning">
                      {overallStats.masteredWrong}
                    </p>
                    <p className="text-sm text-text-secondary">已掌握错题</p>
                  </div>
                </Card>
              </div>

              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    📊 知识点掌握雷达图
                  </h3>
                  {latestExam ? (
                    <div className="h-64">
                      <Radar data={radarData} options={radarOptions} />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-text-tertiary">
                      暂无考试数据，去模拟考试吧~
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    💪 薄弱知识点推荐
                  </h3>
                  {getWeakPoints().length > 0 ? (
                    <div className="space-y-2">
                      {getWeakPoints().map((kp, _idx) => (
                        <div key={kp.knowledgePointId} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-primary">
                                {kp.knowledgePointName}
                              </span>
                              <span className="text-danger font-medium">
                                {kp.correctRate}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-tertiary rounded-full">
                              <div
                                className="h-full bg-danger rounded-full"
                                style={{ width: `${kp.correctRate}%` }}
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => goToChapterPractice(kp.knowledgePointId)}
                          >
                            去练习
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-tertiary text-sm text-center py-4">
                      暂无数据
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    🌟 优势知识点
                  </h3>
                  {getStrongPoints().length > 0 ? (
                    <div className="space-y-2">
                      {getStrongPoints().map((kp, _idx) => (
                        <div key={kp.knowledgePointId} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-primary">
                                {kp.knowledgePointName}
                              </span>
                              <span className="text-success font-medium">
                                {kp.correctRate}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-tertiary rounded-full">
                              <div
                                className="h-full bg-success rounded-full"
                                style={{ width: `${kp.correctRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-tertiary text-sm text-center py-4">
                      暂无数据
                    </p>
                  )}
                </div>
              </Card>

              {(progress.length > 0 || regress.length > 0) && (
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-3">
                      📍 进步与退步分析
                    </h3>
                    <div className="space-y-3">
                      {progress.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📈</span>
                            <p className="font-medium text-green-700">进步知识点</p>
                          </div>
                          <div className="space-y-1">
                            {progress.slice(0, 3).map((kp) => (
                              <div
                                key={kp.id}
                                className="flex items-center justify-between text-sm cursor-pointer hover:bg-green-100 p-2 rounded transition-colors"
                                onClick={() => goToChapterPractice(kp.id)}
                              >
                                <span className="text-green-800">{kp.name}</span>
                                <span className="text-green-600">
                                  {kp.previousRate}% → {kp.latestRate}% (+{kp.diff}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {regress.length > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📉</span>
                            <p className="font-medium text-red-700">退步知识点</p>
                          </div>
                          <div className="space-y-1">
                            {regress.slice(0, 3).map((kp) => (
                              <div
                                key={kp.id}
                                className="flex items-center justify-between text-sm cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                onClick={() => goToChapterPractice(kp.id)}
                              >
                                <span className="text-red-800">{kp.name}</span>
                                <span className="text-red-600">
                                  {kp.previousRate}% → {kp.latestRate}% ({kp.diff}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {viewMode === 'trend' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'week'
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  近7天
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'month'
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  近30天
                </button>
              </div>

              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    📈 正确率变化趋势
                  </h3>
                  {learningTrends.length > 0 ? (
                    <div className="h-64">
                      <Line data={getTrendData()} options={trendOptions} />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-text-tertiary">
                      暂无学习数据
                    </div>
                  )}
                </div>
              </Card>

              {latestExam && (
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary mb-3">
                      📊 各知识点正确率趋势
                    </h3>
                    <div className="space-y-3">
                      {latestExam.knowledgePointStats.map((kp) => {
                        const kpTrend = getKnowledgePointTrendData(kp.knowledgePointId);
                        const hasData = kpTrend.data.some((d) => d !== null);
                        
                        return (
                          <div
                            key={kp.knowledgePointId}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              selectedKP === kp.knowledgePointId
                                ? 'bg-primary/10 border border-primary/30'
                                : 'bg-bg-tertiary hover:bg-bg-secondary'
                            }`}
                            onClick={() =>
                              setSelectedKP(
                                selectedKP === kp.knowledgePointId
                                  ? null
                                  : kp.knowledgePointId
                              )
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-text-primary text-sm">
                                {kp.knowledgePointName}
                              </span>
                              <span
                                className={`text-sm font-medium ${
                                  kp.correctRate >= 60 ? 'text-success' : 'text-danger'
                                }`}
                              >
                                {kp.correctRate}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-secondary rounded-full mb-2">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  kp.correctRate >= 60 ? 'bg-success' : 'bg-danger'
                                }`}
                                style={{ width: `${kp.correctRate}%` }}
                              />
                            </div>
                            {selectedKP === kp.knowledgePointId && hasData && (
                              <div className="h-32 mt-3 pt-3 border-t border-border">
                                <Line
                                  data={{
                                    labels: kpTrend.labels,
                                    datasets: [
                                      {
                                        label: '正确率',
                                        data: kpTrend.data,
                                        borderColor: 'rgba(99, 102, 241, 1)',
                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        fill: true,
                                        tension: 0.4,
                                        spanGaps: true,
                                      },
                                    ],
                                  }}
                                  options={{
                                    ...trendOptions,
                                    plugins: {
                                      ...trendOptions.plugins,
                                      legend: { display: false },
                                    },
                                  }}
                                />
                                <div className="flex justify-end mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      goToChapterPractice(kp.knowledgePointId);
                                    }}
                                  >
                                    去练习 →
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}

              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    📊 考试成绩曲线
                  </h3>
                  {examRecords.length > 0 ? (
                    <div className="h-64">
                      <Bar data={scoreTrendData} options={trendOptions} />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-text-tertiary">
                      暂无考试记录
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {viewMode === 'records' && (
            <div className="space-y-3">
              {examRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    暂无考试记录
                  </h2>
                  <p className="text-text-secondary text-center mb-6">
                    去参加一次模拟考试吧
                  </p>
                </div>
              ) : (
                examRecords.map((record, index) => (
                  <Card key={record.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-text-primary">
                              第{index + 1}次模拟考试
                            </p>
                            <p className="text-xs text-text-tertiary">
                              {formatDate(record.startTime)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            {record.userScore.toFixed(0)}
                            <span className="text-sm text-text-tertiary">
                              /{record.totalScore}
                            </span>
                          </p>
                          <p className="text-xs text-text-secondary">
                            正确率 {record.correctRate}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-tertiary">
                        <span>⏱️ 用时{record.duration}分钟</span>
                        <span>📝 {record.answers.length}题</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </PageLayout>

      <div ref={fullReportRef} className="hidden">
        <div className="p-8 bg-white" style={{ width: '210mm' }}>
          <h1 className="text-2xl font-bold text-center mb-6">学习报告</h1>
          <p className="text-center text-gray-500 mb-6">
            生成日期：{new Date().toLocaleDateString('zh-CN')}
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">一、整体概览</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{overallStats.totalExams}</p>
                <p className="text-sm text-gray-500">模拟考试次数</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{overallStats.avgScore}</p>
                <p className="text-sm text-gray-500">平均分</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-600">{overallStats.totalWrong}</p>
                <p className="text-sm text-gray-500">错题总数</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-600">{overallStats.masteredWrong}</p>
                <p className="text-sm text-gray-500">已掌握错题</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">二、章节覆盖率</h2>
            <div className="space-y-3">
              {chapterCoverage.map((chapter, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{chapter.chapterName}</span>
                    <span className="text-blue-600 font-medium">{chapter.coverage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${chapter.coverage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    已完成 {chapter.completedQuestions}/{chapter.totalQuestions} 题
                  </div>
                </div>
              ))}
            </div>
          </div>

          {examRecords.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">三、模考成绩变化</h2>
              <div className="h-48">
                <Bar
                  data={scoreTrendData}
                  options={{
                    ...trendOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                {examRecords.slice(0, 5).map((record, idx) => (
                  <div key={record.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                    <span>第{idx + 1}次 ({formatDate(record.startTime)})</span>
                    <span className="font-medium">{record.userScore.toFixed(0)}分 (正确率 {record.correctRate}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wrongQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">四、错题明细</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {wrongQuestions.slice(0, 20).map((wq, idx) => (
                  <div key={wq.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">第{idx + 1}题</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${wq.mastered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {wq.mastered ? '已掌握' : '未掌握'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{wq.question.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      错误次数: {wq.wrongCount} | 首次错误: {wq.firstWrongDate}
                    </p>
                  </div>
                ))}
                {wrongQuestions.length > 20 && (
                  <p className="text-center text-gray-500 text-sm">
                    ...还有 {wrongQuestions.length - 20} 道错题
                  </p>
                )}
              </div>
            </div>
          )}

          {latestExam && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">五、知识点分析</h2>
              <div className="h-48 mb-4">
                <Radar data={radarData} options={{ ...radarOptions, maintainAspectRatio: false }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-red-600">薄弱知识点</h3>
                  <div className="space-y-1">
                    {getWeakPoints().map((kp, _idx) => (
                      <div key={kp.knowledgePointId} className="flex justify-between text-sm p-1">
                        <span>{kp.knowledgePointName}</span>
                        <span className="text-red-600">{kp.correctRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-green-600">优势知识点</h3>
                  <div className="space-y-1">
                    {getStrongPoints().map((kp, _idx) => (
                      <div key={kp.knowledgePointId} className="flex justify-between text-sm p-1">
                        <span>{kp.knowledgePointName}</span>
                        <span className="text-green-600">{kp.correctRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
