import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, FileStack, FileText, Headphones, PenTool, BookMarked, Loader2, Upload } from 'lucide-react';import { apiClient } from '@/lib/api';
import type { SmartArticle, PodcastMaterial, PaginatedResponse, WritingTask } from '@/types';
import { toast } from 'sonner';
import './ResourcesPage.css';

type TabType = 'article' | 'podcasts' | 'writing' | 'vocabulary';

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
  const [articles, setArticles] = useState<SmartArticle[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    level: 'intermediate',
    featured_image: null as File | null,
  });

  // Fetch articles when tab is active
  useEffect(() => {
    if (activeTab === 'article') {
      fetchArticles();
    }
  }, [activeTab]);

  const fetchArticles = async () => {
    setFetchLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<SmartArticle>>('/smart-articles/');
      if (data && data.results && Array.isArray(data.results)) {
        setArticles(data.results);
      } else if (Array.isArray(data)) {
        setArticles(data as unknown as SmartArticle[]);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Articlelarni yuklashda xatolik yuz berdi');
    } finally {
      setFetchLoading(false);
    }
  };

  // Article handlers
  const handleArticleSubmit = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      toast.error('Sarlavha va matnni kiriting!');
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', articleForm.title);
      formData.append('content', articleForm.content);
      formData.append('level', articleForm.level);
      if (articleForm.featured_image) {
        formData.append('featured_image', articleForm.featured_image);
      }

      const newArticle = await apiClient.uploadFile<SmartArticle>('/smart-articles/', formData);
      setArticles([newArticle, ...articles]);
      setArticleForm({ title: '', content: '', level: 'intermediate', featured_image: null });
      setShowArticleForm(false);
      toast.success('Article muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Failed to create article:', error);
      toast.error('Article yaratishda xatolik yuz berdi');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      await apiClient.delete(`/smart-articles/${id}/`);
      setArticles(articles.filter(a => a.id !== id));
      toast.success('Article o\'chirildi');
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  // Podcast state
  const [podcastMaterials, setPodcastMaterials] = useState<PodcastMaterial[]>([]);
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [podcastForm, setPodcastForm] = useState({
    name: '',
    youtube_url: '',
    description: '',
  });

  // Fetch podcasts when tab is active
  useEffect(() => {
    if (activeTab === 'podcasts') {
      fetchPodcasts();
    }
  }, [activeTab]);

  // Fetch writings when tab is active
  useEffect(() => {
    if (activeTab === 'writing') {
      fetchWritingTasks();
    }
  }, [activeTab]);

  const fetchPodcasts = async () => {
    setFetchLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<PodcastMaterial>>('/listening-materials/');
      if (data && data.results && Array.isArray(data.results)) {
        setPodcastMaterials(data.results);
      } else if (Array.isArray(data)) {
        setPodcastMaterials(data as unknown as PodcastMaterial[]);
      } else {
        setPodcastMaterials([]);
      }
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      toast.error('Podcastlarni yuklashda xatolik yuz berdi');
    } finally {
      setFetchLoading(false);
    }
  };

  // Writing state
  const [writingTasks, setWritingTasks] = useState<WritingTask[]>([]);
  const [showWritingForm, setShowWritingForm] = useState(false);
  const [writingForm, setWritingForm] = useState({
    title: '',
    task1Question: '',
    task1Image: null as File | null,
    task2Question: '',
  });

  const fetchWritingTasks = async () => {
    setFetchLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<WritingTask>>('/writing-tasks/');
      if (data && data.results && Array.isArray(data.results)) {
        setWritingTasks(data.results);
      } else if (Array.isArray(data)) {
        setWritingTasks(data as unknown as WritingTask[]);
      } else {
        setWritingTasks([]);
      }
    } catch (error) {
      console.error('Failed to fetch writing tasks:', error);
      toast.error('Writing tasklarni yuklashda xatolik yuz berdi');
    } finally {
      setFetchLoading(false);
    }
  };

  // Vocabulary state
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [showVocabularyForm, setShowVocabularyForm] = useState(false);
  const [vocabularyForm, setVocabularyForm] = useState({
    word: '',
    definition: '',
    example: '',
    level: 'Intermediate',
  });

  // Podcast handlers
  const handlePodcastSubmit = async () => {
    if (!podcastForm.name.trim() || !podcastForm.youtube_url.trim()) {
      toast.error('Nom va YouTube URL kiriting!');
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', podcastForm.name);
      formData.append('youtube_url', podcastForm.youtube_url);
      if (podcastForm.description) formData.append('description', podcastForm.description);

      const newMaterial = await apiClient.uploadFile<PodcastMaterial>('/listening-materials/', formData);
      setPodcastMaterials([newMaterial, ...podcastMaterials]);
      setPodcastForm({ 
        name: '', 
        youtube_url: '', 
        description: '',
        
      });
      setShowPodcastForm(false);
      toast.success('Podcast muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Failed to create podcast:', error);
      toast.error('Podcast yaratishda xatolik yuz berdi');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePodcast = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      await apiClient.delete(`/listening-materials/${id}/`);
      setPodcastMaterials(podcastMaterials.filter(m => m.id !== id));
      toast.success('Podcast o\'chirildi');
    } catch (error) {
      console.error('Failed to delete podcast:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  // Writing handlers
  const handleWritingSubmit = async () => {
    if (!writingForm.title.trim() || !writingForm.task1Question.trim() || !writingForm.task2Question.trim()) {
      toast.error('Sarlavha va savollarni to\'ldiring!');
      return;
    }
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', writingForm.title);
      formData.append('task1_question', writingForm.task1Question);
      formData.append('task2_question', writingForm.task2Question);
      formData.append('is_active', 'true');
      if (writingForm.task1Image) {
        formData.append('task1_image', writingForm.task1Image);
      }

      const newTask = await apiClient.uploadFile<WritingTask>('/writing-tasks/', formData);
      setWritingTasks([newTask, ...writingTasks]);
      setWritingForm({ title: '', task1Question: '', task1Image: null, task2Question: '' });
      setShowWritingForm(false);
      toast.success('Writing task muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Failed to create writing task:', error);
      toast.error('Writing task yaratishda xatolik yuz berdi');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteWriting = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
    try {
      await apiClient.delete(`/writing-tasks/${id}/`);
      setWritingTasks(writingTasks.filter(t => t.id !== id));
      toast.success('Writing task o\'chirildi');
    } catch (error) {
      console.error('Failed to delete writing task:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
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
    { id: 'podcasts' as TabType, label: 'Podcasts', icon: Headphones },
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
                    disabled={submitLoading}
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
                    disabled={submitLoading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Daraja *</label>
                    <select
                      className="form-select"
                      value={articleForm.level}
                      onChange={(e) => setArticleForm({ ...articleForm, level: e.target.value })}
                      disabled={submitLoading}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Rasm (ixtiyoriy)</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setArticleForm({ ...articleForm, featured_image: e.target.files?.[0] || null })}
                        className="hidden-file-input"
                        id="article-image"
                        disabled={submitLoading}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="article-image" className="file-upload-label">
                        <Upload size={18} className="mr-2" />
                        {articleForm.featured_image ? articleForm.featured_image.name : 'Rasm yuklash'}
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleArticleSubmit} 
                  className="submit-button"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Yuklanmoqda...
                    </>
                  ) : (
                    'Qo\'shish'
                  )}
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud Articlelar ({articles.length})</h2>
            {fetchLoading ? (
              <div className="empty-state">
                <Loader2 className="animate-spin empty-icon" />
                <p className="empty-text">Yuklanmoqda...</p>
              </div>
            ) : articles.length === 0 ? (
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
                      <p className="item-subtitle">{article.level} • {new Date(article.created_at).toLocaleDateString('uz-UZ')}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Podcast Tab */}
      {activeTab === 'podcasts' && (
        <div className="tab-content">
          <Card className="upload-section">
            <button 
              className="collapse-button"
              onClick={() => setShowPodcastForm(!showPodcastForm)}
            >
              <Plus className="collapse-icon" />
              <span>Yangi Podcast</span>
            </button>

            {showPodcastForm && (
              <div className="upload-form">
                <div className="form-field">
                  <label className="form-label">Nomi *</label>
                  <Input
                    placeholder="Masalan: IELTS Listening Practice"
                    value={podcastForm.name}
                    onChange={(e) => setPodcastForm({ ...podcastForm, name: e.target.value })}
                    className="form-input"
                    disabled={submitLoading}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">YouTube URL *</label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={podcastForm.youtube_url}
                    onChange={(e) => setPodcastForm({ ...podcastForm, youtube_url: e.target.value })}
                    className="form-input"
                    disabled={submitLoading}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Qiyinchilik</label>
                  <select
                    className="form-select"
                    onChange={() => setPodcastForm({ ...podcastForm })}
                    disabled={submitLoading}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                

                <div className="form-field">
                  <label className="form-label">Tavsif (ixtiyoriy)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Podcast haqida qisqacha..."
                    value={podcastForm.description}
                    onChange={(e) => setPodcastForm({ ...podcastForm, description: e.target.value })}
                    rows={4}
                    disabled={submitLoading}
                  />
                </div>

                

                <Button 
                  onClick={handlePodcastSubmit} 
                  className="submit-button"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Yuklanmoqda...
                    </>
                  ) : (
                    'Qo\'shish'
                  )}
                </Button>
              </div>
            )}
          </Card>

          <Card className="items-section">
            <h2 className="section-title">Mavjud Podcastlar ({podcastMaterials.length})</h2>
            {fetchLoading ? (
              <div className="empty-state">
                <Loader2 className="animate-spin empty-icon" />
                <p className="empty-text">Yuklanmoqda...</p>
              </div>
            ) : podcastMaterials.length === 0 ? (
              <div className="empty-state">
                <Headphones className="empty-icon" />
                <p className="empty-text">Hali podcastlar yo'q</p>
              </div>
            ) : (
              <div className="items-list">
                {podcastMaterials.map((material) => (
                  <div key={material.id} className="item-card">
                    <div className="item-info">
                      <h3 className="item-title">{material.name}</h3>
                      <p className="item-subtitle">
                        {material.category} • • {new Date(material.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeletePodcast(material.id)}
                    >
                      <Trash2 size={18} />
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
                      <p className="item-subtitle">{task.created_at ? new Date(task.created_at).toLocaleDateString('uz-UZ') : ''}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteWriting(task.id)}
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
