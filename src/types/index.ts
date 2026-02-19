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
  slug: string;
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

export interface QuickStatsResponse {
  success: boolean;
  data: {
    total_items: {
      listening: number;
      reading: number;
      writing: number;
      articles: number;
      materials: number;
      vocabulary: number;
    };
    active_items: {
      listening: number;
      reading: number;
      writing: number;
      materials: number;
      articles?: number;
      vocabulary?: number;
    };
    recent_count: {
      today: {
        listening: number;
        reading: number;
        writing: number;
        articles: number;
        materials?: number;
        vocabulary?: number;
      };
    };
  };
}

export interface DashboardStatisticsResponse {
  success: boolean;
  data: {
    overview: {
      total_listening_tests: number;
      total_reading_passages: number;
      total_writing_tasks: number;
      total_smart_articles: number;
      total_listening_materials: number;
      total_vocabulary_words: number;
    };
    active_items: {
      active_listening_tests: number;
      active_reading_passages: number;
      active_writing_tasks: number;
      active_listening_materials: number;
    };
    difficulty_distribution: {
      listening_tests: { difficulty: string; count: number }[];
      reading_passages: { difficulty: string; count: number }[];
      writing_tasks: { difficulty: string; count: number }[];
      listening_materials: { difficulty: string; count: number }[];
    };
    articles_by_level: {
      level: string;
      count: number;
    }[];
    recent_additions: {
      last_7_days: {
        listening_tests: number;
        reading_passages: number;
        writing_tasks: number;
        smart_articles: number;
        listening_materials: number;
        vocabulary_words: number;
      };
    };
    user_statistics: {
      total_vocabulary_words: number;
      public_vocabulary_words: number;
      private_vocabulary_words: number;
    };
    system_info: {
      total_modules: number;
      last_updated: string;
    };
  };
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
