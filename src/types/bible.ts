export type TestamentType = 'ot' | 'nt';

export interface BookMeta {
  book_number: number;
  name: string;
  file?: string;
  chapters: number;
}

export interface VerseItem {
  verseNumber: number;
  text: string;
}

export interface ChapterData {
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  totalChapters: number;
  verses: VerseItem[];
}

export interface CompactBook {
  n: number;
  name: string;
  c: Array<Array<[number, string]>>;
}

export interface SearchHit {
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
}

export type FontSizeLevel = 15 | 17 | 19 | 22;
export type AppTheme = 'light' | 'sepia' | 'dark';
export type AppFontFamily = 'serif' | 'sans';

export type HighlightColor = 'gold' | 'emerald' | 'blue' | 'rose' | 'purple';

export interface HighlightItem {
  verseKey: string;
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  color: HighlightColor;
  timestamp: number;
}

export interface UserNote {
  id: string;
  verseKey: string;
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  content: string;
  updatedAt: number;
}

export interface UserBookmark {
  id: string;
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber?: number;
  label: string;
  timestamp: number;
}

export interface HistoryItem {
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  timestamp: number;
}

export interface DailyVerse {
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  theme: string;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  testament: string;
  passages: Array<{
    bookNumber: number;
    bookName: string;
    chapterNumber: number;
    label: string;
  }>;
}

export type ActiveTab = 'reader' | 'books' | 'search' | 'study' | 'plan';

export interface AppState {
  bookNumber: number;
  chapterNumber: number;
  fontSize: FontSizeLevel;
  fontFamily: AppFontFamily;
  theme: AppTheme;
  sidebarOpen?: boolean;
  activeView: ActiveTab;
  highlights: Record<string, HighlightItem>;
  notes: Record<string, UserNote>;
  bookmarks: UserBookmark[];
  history: HistoryItem[];
}
