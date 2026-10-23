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

export interface AppState {
  bookNumber: number;
  chapterNumber: number;
  fontSize: FontSizeLevel;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  activeView: 'reader' | 'books' | 'search';
  highlights: Record<string, boolean>; // key format: `b${book}_c${chap}_v${verse}`
  bookmarks: Array<{
    id: string;
    bookNumber: number;
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    text: string;
    timestamp: number;
  }>;
}
