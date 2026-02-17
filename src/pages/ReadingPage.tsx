import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Trash2, BookOpen, FileText } from 'lucide-react';
import './ReadingPage.css';

interface ReadingPassage {
  id: string;
  title: string;
  htmlFile?: File | null;
  imageFile?: File | null;
  uploadDate: string;
}

export default function ReadingPage() {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Sarlavha kiriting!');
      return;
    }

    const newPassage: ReadingPassage = {
      id: Date.now().toString(),
      title,
      htmlFile,
      imageFile,
      uploadDate: new Date().toLocaleDateString('uz-UZ'),
    };

    setPassages([...passages, newPassage]);
    setTitle('');
    setHtmlFile(null);
    setImageFile(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setPassages(passages.filter(p => p.id !== id));
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
              />
            </div>

            <div className="file-upload-row">
              <div className="file-upload-group">
                <label className="form-label">HTML Fayl *</label>
                <div className="file-upload-button-group">
                  <input
                    type="file"
                    accept=".html"
                    onChange={(e) => setHtmlFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="html-file"
                  />
                  <label htmlFor="html-file" className="file-upload-label">
                    <Upload className="upload-icon" />
                    <span>HTML fayl yuklash</span>
                  </label>
                  {htmlFile && <span className="file-name">{htmlFile.name}</span>}
                </div>
              </div>

              <div className="file-upload-group">
                <label className="form-label">Rasm (ixtiyoriy)</label>
                <div className="file-upload-button-group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="image-file"
                  />
                  <label htmlFor="image-file" className="file-upload-label">
                    <Upload className="upload-icon" />
                    <span>Rasm yuklash</span>
                  </label>
                  {imageFile && <span className="file-name">{imageFile.name}</span>}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="submit-button"
            >
              Qo'shish
            </Button>
          </div>
        )}
      </Card>

      <Card className="passages-section">
        <h2 className="section-title">Mavjud Passagelar ({passages.length})</h2>
        
        {passages.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <p className="empty-text">Hali passagelar yo'q</p>
          </div>
        ) : (
          <div className="passages-list">
            {passages.map((passage) => (
              <div key={passage.id} className="passage-card">
                <div className="passage-info">
                  <h3 className="passage-title">{passage.title}</h3>
                  <p className="passage-date">{passage.uploadDate}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(passage.id)}
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
