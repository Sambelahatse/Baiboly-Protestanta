import { BOOKS_META, getBookByNumber } from '../data/booksMeta';
import { CompactBook, ChapterData, SearchHit, AppState, FontSizeLevel, HighlightItem, ActiveTab } from '../types/bible';

const STORAGE_KEY = 'baiboly_bpm_state_v2';

let fullBibleData: CompactBook[] | null = null;
let fullBiblePromise: Promise<CompactBook[]> | null = null;
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
export async function searchBible(query: string, limit = 100): Promise<SearchHit[]> {
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
    fontFamily: 'serif',
    theme: 'light',
    sidebarOpen: true,
    activeView: 'reader',
    highlights: {},
    notes: {},
    bookmarks: [],
    history: [],
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('baiboly_bpm_state_v2');
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);

    let highlightsObj: Record<string, HighlightItem> = {};
    if (parsed.highlights) {
      if (typeof Object.values(parsed.highlights)[0] === 'boolean') {
        Object.keys(parsed.highlights).forEach((key) => {
          highlightsObj[key] = {
            verseKey: key,
            bookNumber: 1,
            bookName: '',
            chapterNumber: 1,
            verseNumber: 1,
            text: '',
            color: 'gold',
            timestamp: Date.now(),
          };
        });
      } else {
        highlightsObj = parsed.highlights;
      }
    }

    const validTabs: ActiveTab[] = ['reader', 'books', 'search', 'study', 'plan'];
    const activeView: ActiveTab = validTabs.includes(parsed.activeView) ? parsed.activeView : 'reader';
    const validThemes = ['light', 'sepia', 'dark'];
    const theme = validThemes.includes(parsed.theme) ? parsed.theme : 'light';
    const fontFamily = parsed.fontFamily === 'sans' ? 'sans' : 'serif';

    return {
      ...defaultState,
      ...parsed,
      theme,
      fontFamily,
      activeView,
      highlights: highlightsObj,
      notes: parsed.notes || {},
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
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
    document.documentElement.setAttribute('data-theme', state.theme);
  } catch (e) {
    console.warn('Failed to save app state:', e);
  }
}
