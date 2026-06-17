import React, { useState, useRef } from 'react';
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
  const { examRecords, learningTrends, wrongQuestions } = useApp();
  const [viewMode, setViewMode] = useState<'overview' | 'trend' | 'records'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const reportRef = useRef<HTMLDivElement>(null);

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

  const exportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
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

  return (
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
                    {getWeakPoints().map((kp, idx) => (
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
                    {getStrongPoints().map((kp, idx) => (
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

            {learningTrends.length >= 2 && (
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">
                    📍 进步与退步分析
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-medium text-green-700">进步区域</p>
                        <p className="text-sm text-green-600">
                          相比前一次，正确率有所提升的知识点
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-2xl">📉</span>
                      <div>
                        <p className="font-medium text-red-700">退步区域</p>
                        <p className="text-sm text-red-600">
                          相比前一次，正确率有所下降的知识点
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
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
  );
};
