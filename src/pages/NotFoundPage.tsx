import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <AlertTriangle size={80} className="text-destructive" />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Sahifa topilmadi</h2>
        <p className="not-found-description">
          Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
        </p>
        <div className="not-found-actions">
          <Button onClick={() => navigate('/')} className="not-found-button">
            <Home className="mr-2 h-4 w-4" />
            Bosh sahifaga qaytish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
