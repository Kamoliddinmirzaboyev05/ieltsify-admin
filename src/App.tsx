import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ListeningPage from './pages/ListeningPage';
import ReadingPage from './pages/ReadingPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PageTransition from './components/ui/PageTransition';
import './index.css';

import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContextBase';
import { ThemeProvider } from './contexts/ThemeProvider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <PageTransition>
            <LoginPage />
          </PageTransition>
        } />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <PageTransition>
              <DashboardPage />
            </PageTransition>
          } />
          <Route path="reading" element={
            <PageTransition>
              <ReadingPage />
            </PageTransition>
          } />
          <Route path="listening" element={
            <PageTransition>
              <ListeningPage />
            </PageTransition>
          } />
          <Route path="resources" element={
            <PageTransition>
              <ResourcesPage />
            </PageTransition>
          } />
          <Route path="profile" element={
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          } />
        </Route>
        <Route path="*" element={
          <PageTransition>
            <NotFoundPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton theme="system" />
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
