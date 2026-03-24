export interface Profile {
  id: string;
  display_name: string | null;
  daily_goal_reviews: number;
  daily_goal_new_words: number;
  preferred_direction: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_default: boolean;
}

export interface Deck {
  id: string;
  category_id: string | null;
  user_id: string | null;
  name: string;
  description: string | null;
  is_public: boolean;
  card_type: string;
  created_at: string;
  category?: Category;
  card_count?: number;
}

export interface Card {
  id: string;
  deck_id: string;
  dutch: string | null;
  polish: string | null;
  english: string | null;
  pronunciation_pl: string | null;
  pronunciation_nl: string | null;
  example_sentence_nl: string | null;
  example_sentence_pl: string | null;
  example_sentence_en: string | null;
  notes: string | null;
  card_type: string;
  created_at: string;
}

export interface UserCardProgress {
  id: string;
  user_id: string;
  card_id: string;
  direction: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
}

export interface ReviewLog {
  id: string;
  user_id: string;
  card_id: string;
  direction: string;
  quality: number;
  reviewed_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_review_date: string | null;
}

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  cards_reviewed: number;
  new_cards_learned: number;
}

export interface ReviewCard extends Card {
  progress?: UserCardProgress;
  isNew: boolean;
}
