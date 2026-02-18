import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextBase';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@ieltsify.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <User />
            Profile Settings
          </h1>
          <p>Manage your account information and preferences</p>
        </div>
      </div>

      <div className="profile-grid">
        <Card className="profile-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Button type="submit">
                <Save style={{ marginRight: '0.5rem' }} />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="profile-card">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <Button type="submit">
                <Lock style={{ marginRight: '0.5rem' }} />
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="profile-card stats-card">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Materials Uploaded</span>
                <span className="stat-value">47</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Reading Materials</span>
                <span className="stat-value">12</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Listening Materials</span>
                <span className="stat-value">15</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Writing Tasks</span>
                <span className="stat-value">10</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Speaking Topics</span>
                <span className="stat-value">10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="profile-card">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="info-list">
              <div className="info-item">
                <Mail className="info-icon" />
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-value">{user?.email || 'admin@ieltsify.com'}</div>
                </div>
              </div>
              <div className="info-item">
                <User className="info-icon" />
                <div>
                  <div className="info-label">Role</div>
                  <div className="info-value">Administrator</div>
                </div>
              </div>
              <div className="info-item">
                <User className="info-icon" />
                <div>
                  <div className="info-label">Member Since</div>
                  <div className="info-value">January 2024</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
