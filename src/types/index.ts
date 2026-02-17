export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  htmlFile?: string;
  imageFile?: string;
  createdAt: string;
  status: 'active' | 'draft';
}

export interface PassageItem {
  id: string;
  title: string;
  date: string;
}

export interface ListeningTest {
  id: number;
  title: string;
  description: string;
  html_file: string;
  cover_image: string | null;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListeningTestCreate {
  title: string;
  description: string;
  html_file: File;
  cover_image?: File | null;
  difficulty: string;
  is_active: boolean;
}

export interface ReadingTest {
  id: number;
  title: string;
  html_content: string;
  cover_image: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingTestCreate {
  title: string;
  html_content: File;
  cover_image?: File | null;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
}

export interface SmartArticle {
  id: number;
  title: string;
  content: string;
  level: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PodcastMaterial {
  id: number;
  name: string;
  youtube_url: string;
  category: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WritingTask {
  id: number;
  title: string;
  task1_question: string;
  task1_image: string | null;
  task2_question: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Paginated API Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
