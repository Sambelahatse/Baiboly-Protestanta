import { BOOKS_META, getBookByNumber } from '../data/booksMeta';
import { CompactBook, ChapterData, SearchHit, AppState, FontSizeLevel } from '../types/bible';

const STORAGE_KEY = 'baiboly_react_state';

// In-memory cache of full Bible data
let fullBibleData: CompactBook[] | null = null;
let fullBiblePromise: Promise<CompactBook[]> | null = null;

// In-memory cache of individually loaded book files
const singleBookCache = new Map<number, any>();

/**
 * Loads the complete Bible dataset in compact format
 */
export async function loadFullBible(): Promise<CompactBook[]> {
  if (fullBibleData) return fullBibleData;
  if (fullBiblePromise) return fullBiblePromise;

  fullBiblePromise = (async () => {
    try {
      const res = await fetch('/data/baiboly.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: CompactBook[] = await res.json();
      fullBibleData = data;
      return data;
    } catch (err) {
      console.error('Failed to load /data/baiboly.json:', err);
      // Fallback: try root /baiboly.json
      try {
        const res2 = await fetch('baiboly.json');
        const data2: CompactBook[] = await res2.json();
        fullBibleData = data2;
        return data2;
      } catch (e2) {
        console.error('Fallback load also failed:', e2);
        throw err;
      }
    }
  })();

  return fullBiblePromise;
}

/**
 * Loads a single book from its dedicated JSON file
 */
async function loadSingleBook(bookNumber: number): Promise<any> {
  if (singleBookCache.has(bookNumber)) {
    return singleBookCache.get(bookNumber);
  }

  const meta = getBookByNumber(bookNumber);
  if (!meta || !meta.file) throw new Error(`Book ${bookNumber} not found`);

  const filePath = meta.file.startsWith('/') ? meta.file : `/${meta.file}`;
  const res = await fetch(filePath);
  if (!res.ok) {
    throw new Error(`Failed to load ${filePath}: HTTP ${res.status}`);
  }
  const json = await res.json();
  singleBookCache.set(bookNumber, json);
  return json;
}

/**
 * Gets chapter verses either from memory or via fetch
 */
export async function getChapter(bookNumber: number, chapterNumber: number): Promise<ChapterData> {
  const meta = getBookByNumber(bookNumber);
  if (!meta) throw new Error(`Book ${bookNumber} not found`);

  // If full Bible is already in memory, use it
  if (fullBibleData) {
    const bookIndex = bookNumber - 1;
    const compactBook = fullBibleData[bookIndex];
    if (compactBook && compactBook.c && compactBook.c[chapterNumber - 1]) {
      const rawVerses = compactBook.c[chapterNumber - 1];
      return {
        bookNumber,
        bookName: meta.name,
        chapterNumber,
        totalChapters: meta.chapters,
        verses: rawVerses.map(([vn, vt]) => ({ verseNumber: vn, text: vt })),
      };
    }
  }

  // Try loading single book JSON
  try {
    const bookJson = await loadSingleBook(bookNumber);
    const chapterObj = bookJson.chapters?.find((c: any) => c.chapter === chapterNumber);
    if (chapterObj && chapterObj.verses) {
      return {
        bookNumber,
        bookName: meta.name,
        chapterNumber,
        totalChapters: meta.chapters,
        verses: chapterObj.verses.map((v: any) => ({
          verseNumber: v.verse,
          text: v.text,
        })),
      };
    }
  } catch (singleErr) {
    console.warn(`Single book load failed for ${bookNumber}, falling back to full bible...`, singleErr);
  }

  // Fallback to loading full Bible
  const full = await loadFullBible();
  const compactBook = full[bookNumber - 1];
  const rawVerses = compactBook.c[chapterNumber - 1] || [];
  return {
    bookNumber,
    bookName: meta.name,
    chapterNumber,
    totalChapters: meta.chapters,
    verses: rawVerses.map(([vn, vt]) => ({ verseNumber: vn, text: vt })),
  };
}

/**
 * Searches the Bible for matching verses
 */
export async function searchBible(query: string, limit = 80): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const bible = await loadFullBible();
  const lowerQ = trimmed.toLowerCase();
  const hits: SearchHit[] = [];

  for (let bi = 0; bi < bible.length; bi++) {
    const book = bible[bi];
    const bookNumber = book.n || bi + 1;
    const bookName = book.name || BOOKS_META[bi]?.name || `Boky ${bookNumber}`;

    for (let ci = 0; ci < book.c.length; ci++) {
      const chapter = book.c[ci];
      const chapterNumber = ci + 1;

      for (let vi = 0; vi < chapter.length; vi++) {
        const [vn, vt] = chapter[vi];
        if (vt.toLowerCase().includes(lowerQ)) {
          hits.push({
            bookNumber,
            bookName,
            chapterNumber,
            verseNumber: vn,
            text: vt,
          });

          if (hits.length >= limit) {
            return hits;
          }
        }
      }
    }
  }

  return hits;
}

/**
 * Local storage state management
 */
export function loadSavedState(): AppState {
  const defaultState: AppState = {
    bookNumber: 1,
    chapterNumber: 1,
    fontSize: 17,
    theme: 'dark',
    sidebarOpen: true,
    activeView: 'reader',
    highlights: {},
    bookmarks: [],
  };

  try {
    // Check legacy state from original index.html first if present
    const legacy = localStorage.getItem('baiboly_state');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (typeof parsed.b === 'number') defaultState.bookNumber = parsed.b + 1;
      if (typeof parsed.c === 'number') defaultState.chapterNumber = parsed.c + 1;
      if (parsed.theme === 'light' || parsed.theme === 'dark') defaultState.theme = parsed.theme;
      if (typeof parsed.sidebar === 'boolean') defaultState.sidebarOpen = parsed.sidebar;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      fontSize: [15, 17, 19, 22].includes(parsed.fontSize) ? (parsed.fontSize as FontSizeLevel) : 17,
    };
  } catch (e) {
    console.warn('Failed to parse saved state:', e);
    return defaultState;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Also sync theme attribute on root
    document.documentElement.setAttribute('data-theme', state.theme);
  } catch (e) {
    console.warn('Failed to save app state:', e);
  }
}
