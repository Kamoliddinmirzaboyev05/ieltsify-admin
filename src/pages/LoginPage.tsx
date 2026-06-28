import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextBase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogIn,
  User,
  Lock,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="login-background" aria-hidden="true">
        <div className="login-gradient-orb orb-1"></div>
        <div className="login-gradient-orb orb-2"></div>
        <div className="login-gradient-orb orb-3"></div>
        <div className="login-grid"></div>
      </div>

      <div className="login-container">
        {/* Branding panel */}
        <aside className="login-left">
          <div className="login-brand">
            <div className="login-brand-logo-ring">
              <img
                src="/ieltsifylogo.png"
                alt="IELTSIFY"
                className="login-brand-logo"
              />
            </div>
            <h1 className="login-brand-title">IELTSIFY</h1>
            <span className="login-brand-badge">
              <Sparkles className="badge-spark" />
              Admin Panel
            </span>
            <p className="login-brand-tagline">
              IELTS platformangizni bitta zamonaviy boshqaruv markazidan
              nazorat qiling.
            </p>
          </div>

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon">
                <Shield />
              </div>
              <div className="feature-content">
                <h3>Xavfsiz kirish</h3>
                <p>Zamonaviy shifrlash va token autentifikatsiyasi.</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-icon">
                <GraduationCap />
              </div>
              <div className="feature-content">
                <h3>Kuchli boshqaruv</h3>
                <p>Barcha IELTS materiallarini bir joydan boshqaring.</p>
              </div>
            </div>
          </div>

          <div className="login-stats">
            <div className="login-stat">
              <span className="stat-value">4</span>
              <span className="stat-label">Modul</span>
            </div>
            <div className="login-stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Baholash</span>
            </div>
            <div className="login-stat">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Mavjud</span>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-mobile-logo">
                <img src="/ieltsifylogo.png" alt="IELTSIFY" />
              </div>
              <div className="login-icon-wrapper">
                <LogIn className="login-icon" />
              </div>
              <h2 className="login-title">Xush kelibsiz!</h2>
              <p className="login-subtitle">
                Admin paneliga kirish uchun ma'lumotlaringizni kiriting
              </p>
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-with-icon input-with-toggle"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni korsatish'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
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
                    Kirish
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </Button>
            </form>

            <p className="login-footer">
              © {new Date().getFullYear()} IELTSIFY • Admin Panel
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
