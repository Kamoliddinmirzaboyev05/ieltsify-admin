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
          colorPrimary: '#7C3AED', // Muted Corporate Purple
          borderRadius: 12,
          fontFamily: "'Inter', sans-serif",
          colorBgBase: '#0F172A', // Deep Navy Base
          colorBgContainer: '#1E293B', // Dark Slate Container
          colorBorder: 'rgba(255, 255, 255, 0.08)',
          colorTextBase: '#F8FAF9',
          colorTextHeading: '#FFFFFF',
        },
        components: {
          Layout: {
            siderBg: '#0F172A',
            headerBg: 'rgba(15, 23, 42, 0.8)',
            bodyBg: '#0F172A',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: 'rgba(124, 58, 237, 0.08)',
            itemSelectedColor: '#A78BFA',
            itemActiveBg: 'transparent',
            itemHoverBg: 'rgba(255, 255, 255, 0.03)',
            itemMarginInline: 12,
            itemBorderRadius: 8,
          },
          Card: {
            colorBgContainer: '#1E293B',
            borderRadiusLG: 16,
          },
          Button: {
            borderRadius: 8,
            fontWeight: 500,
          },
          Table: {
            headerBg: 'transparent',
            headerColor: '#94A3B8',
            headerBorderRadius: 0,
          },
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
