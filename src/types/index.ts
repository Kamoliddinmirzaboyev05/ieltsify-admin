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

// =====================================================
// ADMIN PANEL NEW TYPES
// =====================================================

export interface AdminDashboardOverview {
  total_users: number;
  active_subscriptions: number;
  total_coins_distributed: number;
  total_coins_in_circulation: number;
  pending_payments: number;
  today_active_users: number;
}

export interface AdminDashboardSubscriptions {
  total: number;
  active: number;
  plan_distribution: Record<string, number>;
}

export interface AdminDashboardPayments {
  total_approved_amount: number;
  total_pending_amount: number;
  pending_count: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: {
    overview: AdminDashboardOverview;
    subscriptions: AdminDashboardSubscriptions;
    payments: AdminDashboardPayments;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'super_admin';
  full_name?: string;
  avatar_url?: string;
  current_band?: number;
  target_band?: number;
  target_score?: number;
  target_date?: string;
  bio?: string;
  is_vip?: boolean;
  vip_expires_at?: string;
  weak_skills?: string[];
  is_active: boolean;
  last_active_at?: string;
  created_at: string;
  user_coins?: UserCoinWallet;
  user_subscriptions?: UserSubscription[];
}

export interface UserCoinWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'trial';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  started_at: string;
  expires_at?: string;
  cancelled_at?: string;
  auto_renew: boolean;
  price: number;
}

export interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_type: 'coin_purchase' | 'subscription' | 'other';
  plan_type?: string;
  coins_requested?: number;
  receipt_image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_id?: string;
  admin_note?: string;
  processed_at?: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, any>;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  reference_id?: string;
  admin_id?: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

export interface ReferralStats {
  referrer_id: string;
  count: number;
  users?: {
    email: string;
    full_name: string;
  };
}

export interface EdgeFunctionResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
