import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, FileStack, FileText, Headphones, PenTool, BookMarked } from 'lucide-react';
import './ResourcesPage.css';

type TabType = 'article' | 'listening' | 'writing' | 'vocabulary';

interface Article {
  id: string;
  title: string;
  content: string;
  level: string;
  imageFile?: File | null;
  uploadDate: string;
}

interface ListeningMaterial {
  id: string;
  name: string;
  youtubeUrl: string;
  category: string;
  uploadDate: string;
}

interface WritingTask {
  id: string;
  title: string;
  task1Question: string;
  task1Image?: File | null;
  task2Question: string;
  uploadDate: string;
}

interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  example: string;
  level: string;
  uploadDate: string;
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('article');
  
  // Article state
  const [articles, setArticles] = useState<Article[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    level: 'Intermediate',
    imageFile: null as File | null,
  });

  // Listening state
  const [listeningMaterials, setListeningMaterials] = useState<ListeningMaterial[]>([]);
  const [showListeningForm, setShowListeningForm] = useState(false);
  const [listeningForm, setListeningForm] = useState({
    name: '',
    youtubeUrl: '',
    category: 'General',
  });

  // Writing state
  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
  const [showWritingForm, setShowWritingForm] = useState(false);
  const [writingForm, setWritingForm] = useState({
    title: '',
    task1Question: '',
    task1Image: null as File | null,
    task2Question: '',
  });

  // Vocabulary state
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [showVocabularyForm, setShowVocabularyForm] = useState(false);
  const [vocabularyForm, setVocabularyForm] = useState({
    word: '',
    definition: '',
    example: '',
    level: 'Intermediate',
  });

  // Article handlers
  const handleArticleSubmit = () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      alert('Sarlavha va matnni kiriting!');
      return;
    }
    const newArticle: Article = {
      id: Date.now().toString(),
      ...articleForm,
      uploadDate: new Date().toLocaleDateString('uz-UZ'),
    };
    setArticles([...articles, newArticle]);
    setArticleForm({ title: '', content: '', level: 'Intermediate', imageFile: null });
    setShowArticleForm(false);
  };

  // Listening handlers
  const handleListeningSubmit = () => {
    if (!listeningForm.name.trim() || !listeningForm.youtubeUrl.trim()) {
      alert('Nom va YouTube URL kiriting!');
      return;
    }
    const newMaterial: ListeningMaterial = {
      id: Date.now().toString(),
      ...listeningForm,
      uploadDate: new Date().toLocaleDateString('uz-UZ'),
    };
    setListeningMaterials([...listeningMaterials, newMaterial]);
    setListeningForm({ name: '', youtubeUrl: '', category: 'General' });
    setShowListeningForm(false);
  };

  // Writing handlers
  const handleWritingSubmit = () => {
    if (!writingForm.title.trim()) {
      alert('Sarlavha kiriting!');
      return;
    }
    const newTask: WritingTask = {
      id: Date.now().toString(),
      ...writingForm,
      uploadDate: new Date().toLocaleDateString('uz-UZ'),
    };
    setWritingTasks([...writingTasks, newTask]);
    setWritingForm({ title: '', task1Question: '', task1Image: null, task2Question: '' });
    setShowWritingForm(false);
  };

  // Vocabulary handlers
  const handleVocabularySubmit = () => {
    if (!vocabularyForm.word.trim() || !vocabularyForm.definition.trim()) {
      alert('So\'z va ta\'rifni kiriting!');
      return;
    }
    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      ...vocabularyForm,
      uploadDate: new Date().toLocaleDateString('uz-UZ'),
    };
    setVocabularyItems([...vocabularyItems, newItem]);
    setVocabularyForm({ word: '', definition: '', example: '', level: 'Intermediate' });
    setShowVocabularyForm(false);
  };

  const tabs = [
    { id: 'article' as TabType, label: 'Article', icon: FileText },
    { id: 'listening' as TabType, label: 'Listening', icon: Headphones },
    { id: 'writing' as TabType, label: 'Writing', icon: PenTool },
    { id: 'vocabulary' as TabType, label: 'Vocabulary', icon: BookMarked },
  ];

  return (
    <div className="resources-page">
      <div className="page-title-section">
        <div className="page-title-content">
          <FileStack className="page-title-icon" />
          <div>
            <h1 className="page-title">Resource Manager</h1>
            <p className="page-subtitle">Barcha materiallarni bir joyda boshqaring</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="tab-icon" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Article Tab */}
      {activeTab === 'article' && (
        <div className="tab-content">
          <Card className="upload-section">
            <button 
              className="collapse-button"
              onClick={() => setShowArticleForm(!showArticleForm)}
            >
              <Plus className="collapse-icon" />
              <span>Yangi Article (Smart Article uchun)</span>
            </button>

            {showArticleForm && (
              <div className="upload-form">
                <div className="form-field">
                  <label className="form-label">Sarlavha *</label>
                  <Input
                    placeholder="Masalan: Climate Change"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Matn *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Article matnini kiriting..."
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    rows={8}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Daraja *</label>
                    <select
                      className="form-select"
                      value={articleForm.level}
                      onChange={(e) => setArticleForm({ ...articleForm, level: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Rasm (ixtiyoriy)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setArticleForm({ ...articleForm, imageFile: e.target.files?.[0] || null })}
                      className="form-file-input"
                    />
                  </div>
                </div>

                <Button onClick={handleArticleSubmit} className="submit-button">
                  Qo'shish
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud Articlelar ({articles.length})</h2>
            {articles.length === 0 ? (
              <div className="empty-state">
                <FileText className="empty-icon" />
                <p className="empty-text">Hali articlelar yo'q</p>
              </div>
            ) : (
              <div className="items-list">
                {articles.map((article) => (
                  <div key={article.id} className="item-card">
                    <div className="item-info">
                      <h3 className="item-title">{article.title}</h3>
                      <p className="item-subtitle">{article.level} • {article.uploadDate}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setArticles(articles.filter(a => a.id !== article.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Listening Tab */}
      {activeTab === 'listening' && (
        <div className="tab-content">
          <Card className="upload-section">
            <button 
              className="collapse-button"
              onClick={() => setShowListeningForm(!showListeningForm)}
            >
              <Plus className="collapse-icon" />
              <span>Yangi Listening Material</span>
            </button>

            {showListeningForm && (
              <div className="upload-form">
                <div className="form-field">
                  <label className="form-label">Nomi *</label>
                  <Input
                    placeholder="Masalan: IELTS Listening Practice"
                    value={listeningForm.name}
                    onChange={(e) => setListeningForm({ ...listeningForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">YouTube URL *</label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={listeningForm.youtubeUrl}
                    onChange={(e) => setListeningForm({ ...listeningForm, youtubeUrl: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Kategoriya *</label>
                  <select
                    className="form-select"
                    value={listeningForm.category}
                    onChange={(e) => setListeningForm({ ...listeningForm, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>

                <Button onClick={handleListeningSubmit} className="submit-button">
                  Qo'shish
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud Materiallar ({listeningMaterials.length})</h2>
            {listeningMaterials.length === 0 ? (
              <div className="empty-state">
                <Headphones className="empty-icon" />
                <p className="empty-text">Hali materiallar yo'q</p>
              </div>
            ) : (
              <div className="items-list">
                {listeningMaterials.map((material) => (
                  <div key={material.id} className="item-card">
                    <div className="item-info">
                      <h3 className="item-title">{material.name}</h3>
                      <p className="item-subtitle">{material.category} • {material.uploadDate}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setListeningMaterials(listeningMaterials.filter(m => m.id !== material.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Writing Tab */}
      {activeTab === 'writing' && (
        <div className="tab-content">
          <Card className="upload-section">
            <button 
              className="collapse-button"
              onClick={() => setShowWritingForm(!showWritingForm)}
            >
              <Plus className="collapse-icon" />
              <span>Yangi Writing Task</span>
            </button>

            {showWritingForm && (
              <div className="upload-form">
                <div className="form-field">
                  <label className="form-label">Sarlavha *</label>
                  <Input
                    placeholder="Masalan: Environment & Technology"
                    value={writingForm.title}
                    onChange={(e) => setWritingForm({ ...writingForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="task-section">
                  <div className="task-header">
                    <span className="task-badge">📊 Task 1 (20 min, 150+ so'z)</span>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Task 1 Savol *</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Masalan: The chart below shows..."
                      value={writingForm.task1Question}
                      onChange={(e) => setWritingForm({ ...writingForm, task1Question: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Task 1 Rasm/Diagram (ixtiyoriy)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setWritingForm({ ...writingForm, task1Image: e.target.files?.[0] || null })}
                      className="form-file-input"
                    />
                  </div>
                </div>

                <div className="task-section">
                  <div className="task-header">
                    <span className="task-badge">✍️ Task 2 (40 min, 250+ so'z)</span>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Task 2 Savol *</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Masalan: Some people believe that technology..."
                      value={writingForm.task2Question}
                      onChange={(e) => setWritingForm({ ...writingForm, task2Question: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                <Button onClick={handleWritingSubmit} className="submit-button">
                  Qo'shish
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud Tasklar ({writingTasks.length})</h2>
            {writingTasks.length === 0 ? (
              <div className="empty-state">
                <PenTool className="empty-icon" />
                <p className="empty-text">Hali tasklar yo'q</p>
              </div>
            ) : (
              <div className="items-list">
                {writingTasks.map((task) => (
                  <div key={task.id} className="item-card">
                    <div className="item-info">
                      <h3 className="item-title">{task.title}</h3>
                      <p className="item-subtitle">{task.uploadDate}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setWritingTasks(writingTasks.filter(t => t.id !== task.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Vocabulary Tab */}
      {activeTab === 'vocabulary' && (
        <div className="tab-content">
          <Card className="upload-section">
            <button 
              className="collapse-button"
              onClick={() => setShowVocabularyForm(!showVocabularyForm)}
            >
              <Plus className="collapse-icon" />
              <span>Yangi Vocabulary</span>
            </button>

            {showVocabularyForm && (
              <div className="upload-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">So'z *</label>
                    <Input
                      placeholder="Masalan: Sustainable"
                      value={vocabularyForm.word}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, word: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Daraja *</label>
                    <select
                      className="form-select"
                      value={vocabularyForm.level}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, level: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Ta'rif *</label>
                  <Input
                    placeholder="So'zning ma'nosini kiriting"
                    value={vocabularyForm.definition}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, definition: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Misol (ixtiyoriy)</label>
                  <Input
                    placeholder="So'zdan foydalanish misoli"
                    value={vocabularyForm.example}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, example: e.target.value })}
                    className="form-input"
                  />
                </div>

                <Button onClick={handleVocabularySubmit} className="submit-button">
                  Qo'shish
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud So'zlar ({vocabularyItems.length})</h2>
            {vocabularyItems.length === 0 ? (
              <div className="empty-state">
                <BookMarked className="empty-icon" />
                <p className="empty-text">Hali so'zlar yo'q</p>
              </div>
            ) : (
              <div className="items-list">
                {vocabularyItems.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      <h3 className="item-title">{item.word}</h3>
                      <p className="item-subtitle">{item.level} • {item.uploadDate}</p>
                      <p className="item-description">{item.definition}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setVocabularyItems(vocabularyItems.filter(v => v.id !== item.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
