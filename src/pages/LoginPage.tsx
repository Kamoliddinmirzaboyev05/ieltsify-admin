import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextBase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, User, Lock, GraduationCap, Shield } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username va parolni kiriting!');
      return;
    }

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      if (err instanceof Error) {
        setError(err.message || 'Login xatosi yuz berdi!');
      } else {
        setError('Username yoki parol noto\'g\'ri!');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-gradient-orb orb-1"></div>
        <div className="login-gradient-orb orb-2"></div>
        <div className="login-gradient-orb orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-icon">
              <GraduationCap className="brand-icon" />
            </div>
            <h1 className="login-brand-title">IELTSIFY</h1>
            <p className="login-brand-subtitle">Admin Panel</p>
          </div>

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon">
                <Shield />
              </div>
              <div className="feature-content">
                <h3>Xavfsiz Kirish</h3>
                <p>Zamonaviy shifrlash texnologiyasi bilan himoyalangan</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-icon">
                <GraduationCap />
              </div>
              <div className="feature-content">
                <h3>Kuchli Boshqaruv</h3>
                <p>Barcha IELTS materiallarini bir joydan boshqaring</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-icon-wrapper">
                <LogIn className="login-icon" />
              </div>
              <h2 className="login-title">Xush kelibsiz!</h2>
              <p className="login-subtitle">Admin paneliga kirish uchun ma'lumotlaringizni kiriting</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <Label htmlFor="username">Username</Label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-with-icon"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <Label htmlFor="password">Parol</Label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-with-icon"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && (
                <div className="login-error">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="login-button">
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <LogIn className="button-icon" />
                    Kirish
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
