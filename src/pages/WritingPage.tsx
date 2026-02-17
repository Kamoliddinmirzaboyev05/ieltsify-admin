import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, PenTool, FileEdit } from 'lucide-react';
import '../pages/ReadingPage.css';

interface WritingTask {
  id: string;
  title: string;
  taskType: 'Task 1' | 'Task 2';
  question: string;
  uploadDate: string;
}

export default function WritingPage() {
  const [tasks, setTasks] = useState<WritingTask[]>([
    {
      id: '1',
      title: 'Graph Description - Population Growth',
      taskType: 'Task 1',
      question: 'The graph below shows population growth in three cities from 2000 to 2020. Summarize the information...',
      uploadDate: '2024-02-10',
    },
    {
      id: '2',
      title: 'Essay - Technology in Education',
      taskType: 'Task 2',
      question: 'Some people believe that technology has made learning easier. To what extent do you agree or disagree?',
      uploadDate: '2024-02-09',
    },
  ]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    taskType: 'Task 2' as 'Task 1' | 'Task 2',
    question: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: WritingTask = {
      id: Date.now().toString(),
      ...formData,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setTasks([newTask, ...tasks]);
    setFormData({ title: '', taskType: 'Task 2', question: '' });
    setShowUploadForm(false);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="material-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <PenTool />
            Writing Tasks
          </h1>
          <p>Upload and manage IELTS writing questions</p>
        </div>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Plus style={{ marginRight: '0.5rem' }} />
          Add Task
        </Button>
      </div>

      {showUploadForm && (
        <Card className="upload-form-card">
          <CardHeader>
            <CardTitle>Add New Writing Task</CardTitle>
            <CardDescription>
              Create a new writing task for IELTS practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Essay - Technology in Education"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="taskType">Task Type</Label>
                <select
                  id="taskType"
                  className="input"
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value as 'Task 1' | 'Task 2' })}
                >
                  <option value="Task 1">Task 1 (Graph/Chart/Letter)</option>
                  <option value="Task 2">Task 2 (Essay)</option>
                </select>
              </div>

              <div className="form-group">
                <Label htmlFor="question">Question *</Label>
                <textarea
                  id="question"
                  className="input"
                  placeholder="Enter the full writing task question..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  rows={5}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>

              <div className="form-actions">
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus style={{ marginRight: '0.5rem' }} />
                  Add Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Writing Tasks ({tasks.length})</CardTitle>
          <CardDescription>
            All writing tasks available for practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="materials-list">
            {tasks.map((task) => (
              <div key={task.id} className="material-item">
                <div className="material-icon" style={{ background: '#8b5cf6' }}>
                  <FileEdit />
                </div>
                <div className="material-info">
                  <h3>{task.title}</h3>
                  <p>{task.question}</p>
                  <div className="material-meta">
                    <span className={`difficulty-badge ${task.taskType === 'Task 1' ? 'difficulty-medium' : 'difficulty-hard'}`}>
                      {task.taskType}
                    </span>
                    <span className="material-date">{task.uploadDate}</span>
                  </div>
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(task.id)}>
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
