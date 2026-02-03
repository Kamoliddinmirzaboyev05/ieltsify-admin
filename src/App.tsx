import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ListeningPage from './pages/ListeningPage';
import ReadingPage from './pages/ReadingPage';
import WritingPage from './pages/WritingPage';
import SpeakingPage from './pages/SpeakingPage';
import UsersPage from './pages/UsersPage';
import './App.css';

import { ConfigProvider, theme as antdTheme } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#8B5CF6', // Slightly brighter purple for dark mode
          borderRadius: 12,
          fontFamily: "'Inter', sans-serif",
          colorBgBase: '#0f172a', // Deep navy/slate black
          colorBgContainer: '#1e293b', // Slightly lighter slate for cards
          colorBorder: 'rgba(255, 255, 255, 0.08)',
        },
        components: {
          Layout: {
            siderBg: '#0f172a',
            headerBg: '#0f172a',
            bodyBg: '#0f172a',
          },
          Menu: {
            itemBg: '#0f172a',
            itemSelectedBg: 'rgba(139, 92, 246, 0.15)',
            itemSelectedColor: '#a78bfa',
          },
          Card: {
            colorBgContainer: '#1e293b',
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="listening" element={<ListeningPage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="writing" element={<WritingPage />} />
            <Route path="speaking" element={<SpeakingPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
