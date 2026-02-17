import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Trash2, Headphones, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { ListeningTest, PaginatedResponse } from '@/types';
import { toast } from 'sonner';
import './ListeningPage.css';

export default function ListeningPage() {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Fetch tests on mount
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setFetchLoading(true);
      const data = await apiClient.get<PaginatedResponse<ListeningTest>>('/listening-tests/');
      
      // Handle paginated response
      if (data && data.results && Array.isArray(data.results)) {
        setTests(data.results);
      } else if (Array.isArray(data)) {
        // Fallback: if API returns array directly
        setTests(data as unknown as ListeningTest[]);
      } else {
        console.error('Unexpected API response format:', data);
        setTests([]);
        toast.error('Ma\'lumotlar formati noto\'g\'ri');
      }
    } catch (err) {
      console.error('Failed to fetch tests:', err);
      toast.error('Testlarni yuklashda xatolik yuz berdi');
      setTests([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Sarlavha kiriting!');
      return;
    }

    if (!htmlFile) {
      toast.error('HTML fayl yuklang!');
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim() || 'Test haqida qisqacha ma\'lumot');
      formData.append('is_active', 'true'); // Always active as requested
      formData.append('html_file', htmlFile);
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      // Upload to API
      const newTest = await apiClient.uploadFile<ListeningTest>(
        '/listening-tests/',
        formData
      );

      // Add to list
      setTests([newTest, ...tests]);

      // Reset form
      setTitle('');
      setDescription('');
      setHtmlFile(null);
      setCoverImage(null);
      setShowForm(false);

      toast.success('Test muvaffaqiyatli yuklandi!');
    } catch (err) {
      console.error('Upload failed:', err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Yuklashda xatolik yuz berdi!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      return;
    }

    try {
      await apiClient.delete(`/listening-tests/${id}/`);
      setTests(tests.filter(t => t.id !== id));
      toast.success('Test o\'chirildi!');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('O\'chirishda xatolik yuz berdi!');
    }
  };

  return (
    <div className="listening-manager-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <Headphones className="page-title-icon" />
          <div>
            <h1 className="page-title">Listening Test Manager</h1>
            <p className="page-subtitle">Listening mock test uchun HTML fayllar yuklang</p>
          </div>
        </div>
      </div>

      <Card className="upload-section">
        <button 
          className="collapse-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="collapse-icon" />
          <span>Yangi Listening Test</span>
        </button>

        {showForm && (
          <div className="upload-form">
            <div className="form-field">
              <label className="form-label">Sarlavha *</label>
              <Input
                placeholder="Masalan: IELTS Listening Practice Test 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Tavsif (ixtiyoriy)</label>
              <textarea
                className="form-textarea"
                placeholder="Test haqida qisqacha ma'lumot"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="file-upload-row">
              <div className="file-upload-group">
                <label className="form-label">HTML Fayl *</label>
                <div className="file-upload-button-group">
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={(e) => setHtmlFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="html-file"
                    disabled={loading}
                  />
                  <label htmlFor="html-file" className="file-upload-label">
                    <Upload className="upload-icon" />
                    <span>HTML fayl yuklash</span>
                  </label>
                  {htmlFile && <span className="file-name">{htmlFile.name}</span>}
                </div>
              </div>

              <div className="file-upload-group">
                <label className="form-label">Cover Image (ixtiyoriy)</label>
                <div className="file-upload-button-group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="cover-image"
                    disabled={loading}
                  />
                  <label htmlFor="cover-image" className="file-upload-label">
                    <Upload className="upload-icon" />
                    <span>Rasm yuklash</span>
                  </label>
                  {coverImage && <span className="file-name">{coverImage.name}</span>}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="upload-icon animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                'Qo\'shish'
              )}
            </Button>
          </div>
        )}
      </Card>

      <Card className="tests-section">
        <h2 className="section-title">Mavjud Testlar ({tests.length})</h2>
        
        {fetchLoading ? (
          <div className="empty-state">
            <Loader2 className="empty-icon animate-spin" />
            <p className="empty-text">Yuklanmoqda...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="empty-state">
            <Headphones className="empty-icon" />
            <p className="empty-text">Hali testlar yo'q</p>
          </div>
        ) : (
          <div className="tests-list">
            {tests.map((test) => (
              <div key={test.id} className="test-card">
                <div className="test-info">
                  <h3 className="test-title">{test.title}</h3>
                  <p className="test-date">
                    {new Date(test.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(test.id)}
                  className="delete-button"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
