import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { StudyPlan } from './pages/StudyPlan';
import { Practice } from './pages/Practice';
import { ChapterPractice } from './pages/ChapterPractice';
import { RealExam } from './pages/RealExam';
import { WrongQuestions } from './pages/WrongQuestions';
import { MockExam } from './pages/MockExam';
import { Analysis } from './pages/Analysis';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/plan" element={<StudyPlan />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/practice/chapter/:chapterId" element={<ChapterPractice />} />
      <Route path="/practice/real-exam" element={<RealExam />} />
      <Route path="/wrong" element={<WrongQuestions />} />
      <Route path="/exam" element={<MockExam />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
