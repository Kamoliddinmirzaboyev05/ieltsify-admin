import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Mic, MessageSquare } from 'lucide-react';
import '../pages/ReadingPage.css';

interface SpeakingTopic {
  id: string;
  title: string;
  part: 'Part 1' | 'Part 2' | 'Part 3';
  questions: string[];
  uploadDate: string;
}

export default function SpeakingPage() {
  const [topics, setTopics] = useState<SpeakingTopic[]>([
    {
      id: '1',
      title: 'Hometown and Family',
      part: 'Part 1',
      questions: [
        'Where are you from?',
        'Do you like your hometown?',
        'Tell me about your family.',
      ],
      uploadDate: '2024-02-10',
    },
    {
      id: '2',
      title: 'Describe a memorable journey',
      part: 'Part 2',
      questions: [
        'Describe a memorable journey you have made.',
        'You should say: where you went, when you went there, who you went with, and explain why it was memorable.',
      ],
      uploadDate: '2024-02-09',
    },
  ]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    part: 'Part 1' as 'Part 1' | 'Part 2' | 'Part 3',
    questions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTopic: SpeakingTopic = {
      id: Date.now().toString(),
      title: formData.title,
      part: formData.part,
      questions: formData.questions.split('\n').filter(q => q.trim()),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setTopics([newTopic, ...topics]);
    setFormData({ title: '', part: 'Part 1', questions: '' });
    setShowUploadForm(false);
  };

  const handleDelete = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  return (
    <div className="material-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <Mic />
            Speaking Topics
          </h1>
          <p>Upload and manage IELTS speaking questions</p>
        </div>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Plus style={{ marginRight: '0.5rem' }} />
          Add Topic
        </Button>
      </div>

      {showUploadForm && (
        <Card className="upload-form-card">
          <CardHeader>
            <CardTitle>Add New Speaking Topic</CardTitle>
            <CardDescription>
              Create a new speaking topic for IELTS practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <Label htmlFor="title">Topic Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Hometown and Family"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="part">Speaking Part</Label>
                <select
                  id="part"
                  className="input"
                  value={formData.part}
                  onChange={(e) => setFormData({ ...formData, part: e.target.value as 'Part 1' | 'Part 2' | 'Part 3' })}
                >
                  <option value="Part 1">Part 1 (Introduction)</option>
                  <option value="Part 2">Part 2 (Long Turn)</option>
                  <option value="Part 3">Part 3 (Discussion)</option>
                </select>
              </div>

              <div className="form-group">
                <Label htmlFor="questions">Questions (one per line) *</Label>
                <textarea
                  id="questions"
                  className="input"
                  placeholder="Enter questions, one per line..."
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  required
                  rows={6}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>

              <div className="form-actions">
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus style={{ marginRight: '0.5rem' }} />
                  Add Topic
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Speaking Topics ({topics.length})</CardTitle>
          <CardDescription>
            All speaking topics available for practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="materials-list">
            {topics.map((topic) => (
              <div key={topic.id} className="material-item">
                <div className="material-icon" style={{ background: '#06b6d4' }}>
                  <MessageSquare />
                </div>
                <div className="material-info">
                  <h3>{topic.title}</h3>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    {topic.questions.slice(0, 2).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                    {topic.questions.length > 2 && (
                      <li>+ {topic.questions.length - 2} more questions</li>
                    )}
                  </ul>
                  <div className="material-meta">
                    <span className={`difficulty-badge ${topic.part === 'Part 1' ? 'difficulty-easy' : topic.part === 'Part 2' ? 'difficulty-medium' : 'difficulty-hard'}`}>
                      {topic.part}
                    </span>
                    <span className="material-date">{topic.uploadDate}</span>
                  </div>
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(topic.id)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
