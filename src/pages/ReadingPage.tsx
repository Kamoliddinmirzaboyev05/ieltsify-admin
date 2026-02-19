import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Trash2, BookOpen, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { ReadingTest, PaginatedResponse } from '@/types';
import { toast } from 'sonner';
import './ReadingPage.css';

export default function ReadingPage() {
  const [passages, setPassages] = useState<ReadingTest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Fetch passages on mount
  useEffect(() => {
    fetchPassages();
  }, []);

  const fetchPassages = async () => {
    try {
      setFetchLoading(true);
      const data = await apiClient.get<PaginatedResponse<ReadingTest>>('/reading-passages/');
      
      // Handle paginated response
      if (data && data.results && Array.isArray(data.results)) {
        setPassages(data.results);
      } else if (Array.isArray(data)) {
        // Fallback: if API returns array directly
        setPassages(data as unknown as ReadingTest[]);
      } else {
        console.error('Unexpected API response format:', data);
        setPassages([]);
        toast.error('Ma\'lumotlar formati noto\'g\'ri');
      }
    } catch (err) {
      console.error('Failed to fetch passages:', err);
      toast.error('Reading passagelarni yuklashda xatolik yuz berdi');
      setPassages([]);
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
      formData.append('difficulty', 'medium'); // Default to medium as requested
      formData.append('is_active', 'true'); // Always active as requested
      formData.append('html_content', htmlFile);
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      // Upload to API
      const newPassage = await apiClient.uploadFile<ReadingTest>(
        '/reading-passages/',
        formData
      );

      // Add to list
      setPassages([newPassage, ...passages]);

      // Reset form
      setTitle('');
      setHtmlFile(null);
      setCoverImage(null);
      setShowForm(false);

      toast.success('Reading passage muvaffaqiyatli yuklandi!');
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

  const handleDelete = async (slug: string) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      return;
    }

    try {
      await apiClient.delete(`/reading-passages/${encodeURIComponent(slug)}/`);
      setPassages(prev => prev.filter(p => p.slug !== slug));
      toast.success('Passage o\'chirildi!');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('O\'chirishda xatolik yuz berdi!');
    }
  };

  return (
    <div className="reading-manager-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <BookOpen className="page-title-icon" />
          <div>
            <h1 className="page-title">Reading Passage Manager</h1>
            <p className="page-subtitle">Reading mock test uchun HTML fayllar yuklang</p>
          </div>
        </div>
      </div>

      <Card className="upload-section">
        <button 
          className="collapse-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="collapse-icon" />
          <span>Yangi Reading Passage</span>
        </button>

        {showForm && (
          <div className="upload-form">
            <div className="form-field">
              <label className="form-label">Sarlavha *</label>
              <Input
                placeholder="Masalan: The Nature of Memory"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
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
                    <span>{htmlFile ? htmlFile.name : 'HTML fayl yuklash'}</span>
                  </label>
                </div>
              </div>

              <div className="file-upload-group">
                <label className="form-label">Muqova rasmi (ixtiyoriy)</label>
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
                    <ImageIcon className="upload-icon" />
                    <span>{coverImage ? coverImage.name : 'Rasm yuklash'}</span>
                  </label>
                </div>
              </div>
            </div>

            <Button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Yuklanmoqda...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={18} />
                  Saqlash
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      <div className="passages-list">
        {fetchLoading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
            <p className="mt-2 text-muted-foreground">Yuklanmoqda...</p>
          </div>
        ) : passages.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'var(--card)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <BookOpen className="mx-auto text-muted-foreground mb-3" size={48} />
            <h3 className="text-lg font-medium">Hozircha reading passagelar yo'q</h3>
            <p className="text-muted-foreground">Yangi passage qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {passages.map((passage) => (
              <Card key={passage.id} className="passage-card">
                <div className="passage-info">
                  <div className={`passage-icon-wrapper icon-${passage.difficulty}`}>
                    <FileText size={24} />
                  </div>
                  <div className="passage-details">
                    <h3>{passage.title}</h3>
                    <div className="passage-meta">
                      <span>{new Date(passage.created_at).toLocaleDateString('uz-UZ')}</span>
                      <span>•</span>
                      <span className={passage.is_active ? 'status-active' : 'status-inactive'}>
                        {passage.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="delete-button"
                  onClick={() => handleDelete(passage.slug)}
                >
                  <Trash2 size={20} />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
