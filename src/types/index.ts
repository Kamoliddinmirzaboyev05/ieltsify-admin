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

// Paginated API Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
