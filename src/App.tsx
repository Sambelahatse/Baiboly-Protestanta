import { useState, useEffect, useCallback } from 'react';
import { BOOKS_META, getBookByNumber } from './data/booksMeta';
import { ChapterData, BookMeta, FontSizeLevel } from './types/bible';
import { getChapter, loadSavedState, saveAppState, loadFullBible } from './services/bibleService';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { BooksHomeView } from './components/BooksHomeView';
import { FullSearchView } from './components/FullSearchView';
import { ChapterPickerModal } from './components/ChapterPickerModal';
import { SearchModal } from './components/SearchModal';

export function App() {
  const [initialState] = useState(() => loadSavedState());

  const [bookNumber, setBookNumber] = useState(initialState.bookNumber);
  const [chapterNumber, setChapterNumber] = useState(initialState.chapterNumber);
  const [fontSize, setFontSize] = useState<FontSizeLevel>(initialState.fontSize);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialState.theme);
  const [sidebarOpen, setSidebarOpen] = useState(initialState.sidebarOpen);
  const [activeView, setActiveView] = useState<'reader' | 'books' | 'search'>(initialState.activeView);
  const [highlights, setHighlights] = useState<Record<string, boolean>>(initialState.highlights);

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetVerse, setTargetVerse] = useState<number | undefined>(undefined);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pickerBook, setPickerBook] = useState<BookMeta | null>(null);

  // Sync theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Preload full bible data in background
  useEffect(() => {
    loadFullBible().catch(() => {});
  }, []);

  // Save state on change
  useEffect(() => {
    saveAppState({
      bookNumber,
      chapterNumber,
      fontSize,
      theme,
      sidebarOpen,
      activeView,
      highlights,
      bookmarks: [],
    });
  }, [bookNumber, chapterNumber, fontSize, theme, sidebarOpen, activeView, highlights]);

  // Fetch chapter data whenever bookNumber or chapterNumber changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getChapter(bookNumber, chapterNumber)
      .then((data) => {
        if (!cancelled) {
          setChapterData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load chapter:', err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bookNumber, chapterNumber]);

  const currentBookMeta = getBookByNumber(bookNumber) || BOOKS_META[0];
  const totalChapters = currentBookMeta.chapters;

  // Navigation callbacks
  const handleSelectBook = useCallback((newBookNumber: number, newChapter = 1) => {
    setBookNumber(newBookNumber);
    setChapterNumber(newChapter);
    setTargetVerse(undefined);
    setActiveView('reader');
  }, []);

  const handleSelectChapter = useCallback((newChapter: number) => {
    setChapterNumber(newChapter);
    setTargetVerse(undefined);
    setActiveView('reader');
  }, []);

  const handlePrevChapter = useCallback(() => {
    if (chapterNumber > 1) {
      setChapterNumber((prev) => prev - 1);
      setTargetVerse(undefined);
      setActiveView('reader');
    } else if (bookNumber > 1) {
      const prevBook = BOOKS_META[bookNumber - 2];
      setBookNumber(bookNumber - 1);
      setChapterNumber(prevBook.chapters);
      setTargetVerse(undefined);
      setActiveView('reader');
    }
  }, [bookNumber, chapterNumber]);

  const handleNextChapter = useCallback(() => {
    if (chapterNumber < totalChapters) {
      setChapterNumber((prev) => prev + 1);
      setTargetVerse(undefined);
      setActiveView('reader');
    } else if (bookNumber < BOOKS_META.length) {
      setBookNumber(bookNumber + 1);
      setChapterNumber(1);
      setTargetVerse(undefined);
      setActiveView('reader');
    }
  }, [bookNumber, chapterNumber, totalChapters]);

  const canPrev = bookNumber > 1 || chapterNumber > 1;
  const canNext = bookNumber < BOOKS_META.length || chapterNumber < totalChapters;

  // Toggle Highlight
  const handleToggleHighlight = useCallback((verseKey: string) => {
    setHighlights((prev) => {
      const next = { ...prev };
      if (next[verseKey]) {
        delete next[verseKey];
      } else {
        next[verseKey] = true;
      }
      return next;
    });
  }, []);

  // Cycle font size
  const handleCycleFontSize = useCallback(() => {
    const levels: FontSizeLevel[] = [15, 17, 19, 22];
    setFontSize((prev) => {
      const idx = levels.indexOf(prev);
      return levels[(idx + 1) % levels.length];
    });
  }, []);

  // Toggle theme
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Toggle sidebar
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Jump to specific verse from search
  const handleSelectSearchVerse = useCallback(
    (bNum: number, cNum: number, vNum: number) => {
      setBookNumber(bNum);
      setChapterNumber(cNum);
      setTargetVerse(vNum);
      setActiveView('reader');
    },
    []
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextChapter, handlePrevChapter]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden select-text">
      {/* Top bar */}
      <Topbar
        currentBook={bookNumber}
        currentChapter={chapterNumber}
        totalChapters={totalChapters}
        fontSize={fontSize}
        theme={theme}
        sidebarOpen={sidebarOpen}
        activeView={activeView}
        onSelectBook={(b) => handleSelectBook(b, 1)}
        onSelectChapter={handleSelectChapter}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        canPrev={canPrev}
        canNext={canNext}
        onToggleSearch={() => setSearchModalOpen(true)}
        onCycleFontSize={handleCycleFontSize}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={handleToggleSidebar}
        onSetView={setActiveView}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentBook={bookNumber}
          isOpen={sidebarOpen}
          onSelectBook={(b) => handleSelectBook(b, 1)}
          onClose={() => setSidebarOpen(false)}
        />

        {/* View Switch */}
        {activeView === 'reader' && (
          <ReaderView
            chapterData={chapterData}
            isLoading={isLoading}
            fontSize={fontSize}
            highlightedVerses={highlights}
            targetVerse={targetVerse}
            onToggleHighlight={handleToggleHighlight}
            onSelectChapter={handleSelectChapter}
            onPrevChapter={handlePrevChapter}
            onNextChapter={handleNextChapter}
            onNavigateHome={() => setActiveView('books')}
          />
        )}

        {activeView === 'books' && (
          <BooksHomeView
            onSelectBook={(b, ch) => handleSelectBook(b, ch || 1)}
            onOpenBookPicker={(book) => setPickerBook(book)}
          />
        )}

        {activeView === 'search' && (
          <FullSearchView onSelectVerse={handleSelectSearchVerse} />
        )}
      </div>

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={handleSelectSearchVerse}
      />

      {/* Book Chapter Picker Modal */}
      <ChapterPickerModal
        book={pickerBook}
        onClose={() => setPickerBook(null)}
        onSelectChapter={(b, c) => {
          setPickerBook(null);
          handleSelectBook(b, c);
        }}
      />
    </div>
  );
}
