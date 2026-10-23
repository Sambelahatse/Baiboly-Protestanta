import { useState, useEffect, useCallback } from 'react';
import { BOOKS_META, getBookByNumber } from './data/booksMeta';
import {
  ChapterData,
  FontSizeLevel,
  AppTheme,
  AppFontFamily,
  HighlightColor,
  HighlightItem,
  UserNote,
  UserBookmark,
  ActiveTab,
} from './types/bible';
import { getChapter, loadSavedState, saveAppState, loadFullBible } from './services/bibleService';
import { Topbar } from './components/Topbar';
import { ReaderView } from './components/ReaderView';
import { BooksHomeView } from './components/BooksHomeView';
import { FullSearchView } from './components/FullSearchView';
import { StudyDrawerView } from './components/StudyDrawerView';
import { ReadingPlanView } from './components/ReadingPlanView';
import { ChapterPickerModal } from './components/ChapterPickerModal';
import { SearchModal } from './components/SearchModal';
import { QuickJumpDialog } from './components/QuickJumpDialog';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { VerseShareModal } from './components/VerseShareModal';
import { DisplaySettingsPopover } from './components/DisplaySettingsPopover';

export function App() {
  const [initialState] = useState(() => loadSavedState());

  const [bookNumber, setBookNumber] = useState(initialState.bookNumber);
  const [chapterNumber, setChapterNumber] = useState(initialState.chapterNumber);
  const [fontSize, setFontSize] = useState<FontSizeLevel>(initialState.fontSize);
  const [fontFamily, setFontFamily] = useState<AppFontFamily>(initialState.fontFamily || 'serif');
  const [theme, setTheme] = useState<AppTheme>(initialState.theme || 'light');
  const [activeView, setActiveView] = useState<ActiveTab>(initialState.activeView);
  const [highlights, setHighlights] = useState<Record<string, HighlightItem>>(initialState.highlights);
  const [notes, setNotes] = useState<Record<string, UserNote>>(initialState.notes);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>(initialState.bookmarks);
  const [history, setHistory] = useState(initialState.history);

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetVerse, setTargetVerse] = useState<number | undefined>(undefined);

  // Modals & Floating players
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [chapterPickerOpen, setChapterPickerOpen] = useState(false);
  const [displayPopoverOpen, setDisplayPopoverOpen] = useState(false);
  const [audioBarOpen, setAudioBarOpen] = useState(false);
  const [currentAudioVerseIndex, setCurrentAudioVerseIndex] = useState(0);

  const [shareData, setShareData] = useState<{
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    verseText: string;
  } | null>(null);

  // Sync theme attribute to HTML document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Preload full Bible dataset in background
  useEffect(() => {
    loadFullBible().catch(() => {});
  }, []);

  // Save state on change
  useEffect(() => {
    saveAppState({
      bookNumber,
      chapterNumber,
      fontSize,
      fontFamily,
      theme,
      sidebarOpen: false,
      activeView,
      highlights,
      notes,
      bookmarks,
      history,
    });
  }, [bookNumber, chapterNumber, fontSize, fontFamily, theme, activeView, highlights, notes, bookmarks, history]);

  // Fetch chapter data & record history
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getChapter(bookNumber, chapterNumber)
      .then((data) => {
        if (!cancelled) {
          setChapterData(data);
          setIsLoading(false);

          // Add to reading history
          setHistory((prev) => {
            const filtered = prev.filter(
              (h) => !(h.bookNumber === bookNumber && h.chapterNumber === chapterNumber)
            );
            return [
              {
                bookNumber,
                bookName: data.bookName,
                chapterNumber,
                timestamp: Date.now(),
              },
              ...filtered,
            ].slice(0, 30);
          });
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

  // Chapter is bookmarked check
  const isCurrentChapterBookmarked = bookmarks.some(
    (b) => b.bookNumber === bookNumber && b.chapterNumber === chapterNumber
  );

  // Navigation callbacks
  const handleSelectBook = useCallback((newBookNumber: number, newChapter = 1, verse?: number) => {
    setBookNumber(newBookNumber);
    setChapterNumber(newChapter);
    setTargetVerse(verse);
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

  // Multi-color Highlight Management
  const handleSetHighlight = useCallback(
    (
      verseKey: string,
      color: HighlightColor | null,
      text: string,
      bookNum: number,
      bookName: string,
      chapNum: number,
      verseNum: number
    ) => {
      setHighlights((prev) => {
        const next = { ...prev };
        if (!color) {
          delete next[verseKey];
        } else {
          next[verseKey] = {
            verseKey,
            bookNumber: bookNum,
            bookName,
            chapterNumber: chapNum,
            verseNumber: verseNum,
            text,
            color,
            timestamp: Date.now(),
          };
        }
        return next;
      });
    },
    []
  );

  const handleRemoveHighlight = useCallback((verseKey: string) => {
    setHighlights((prev) => {
      const next = { ...prev };
      delete next[verseKey];
      return next;
    });
  }, []);

  // Study Notes Management
  const handleSaveNote = useCallback(
    (
      verseKey: string,
      content: string,
      text: string,
      bookNum: number,
      bookName: string,
      chapNum: number,
      verseNum: number
    ) => {
      setNotes((prev) => ({
        ...prev,
        [verseKey]: {
          id: verseKey,
          verseKey,
          bookNumber: bookNum,
          bookName,
          chapterNumber: chapNum,
          verseNumber: verseNum,
          verseText: text,
          content,
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const handleDeleteNote = useCallback((key: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Bookmarks Management
  const handleToggleBookmark = useCallback(() => {
    const existingIndex = bookmarks.findIndex(
      (b) => b.bookNumber === bookNumber && b.chapterNumber === chapterNumber
    );

    if (existingIndex >= 0) {
      setBookmarks((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      const newBm: UserBookmark = {
        id: `bm_${bookNumber}_${chapterNumber}_${Date.now()}`,
        bookNumber,
        bookName: currentBookMeta.name,
        chapterNumber,
        label: `${currentBookMeta.name} ${chapterNumber}`,
        timestamp: Date.now(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  }, [bookNumber, chapterNumber, bookmarks, currentBookMeta.name]);

  const handleRemoveBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Audio trigger
  const handleStartAudio = useCallback((verseIndex = 0) => {
    setCurrentAudioVerseIndex(verseIndex);
    setAudioBarOpen(true);
  }, []);

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

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setQuickJumpOpen(true);
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
    <div className="flex flex-col h-screen w-screen overflow-hidden select-text relative">
      {/* Top bar (Bible.com inspired) */}
      <Topbar
        activeView={activeView}
        fontSize={fontSize}
        theme={theme}
        fontFamily={fontFamily}
        onToggleSearch={() => setSearchModalOpen(true)}
        onToggleQuickJump={() => setQuickJumpOpen(true)}
        onToggleDisplayPopover={() => setDisplayPopoverOpen((prev) => !prev)}
        onSetView={setActiveView}
      />

      {/* Display Settings Popover (Bible.com Aa) */}
      <DisplaySettingsPopover
        isOpen={displayPopoverOpen}
        onClose={() => setDisplayPopoverOpen(false)}
        fontSize={fontSize}
        theme={theme}
        fontFamily={fontFamily}
        onChangeFontSize={setFontSize}
        onChangeTheme={setTheme}
        onChangeFontFamily={setFontFamily}
      />

      {/* Main Content Area - Full-width expansive reading experience without sidebar */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* View Switch */}
        {activeView === 'reader' && (
          <ReaderView
            chapterData={chapterData}
            isLoading={isLoading}
            fontSize={fontSize}
            fontFamily={fontFamily}
            highlights={highlights}
            notes={notes}
            isBookmarked={isCurrentChapterBookmarked}
            targetVerse={targetVerse}
            onOpenChapterPicker={() => setChapterPickerOpen(true)}
            onSetHighlight={handleSetHighlight}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onToggleBookmark={handleToggleBookmark}
            onPrevChapter={handlePrevChapter}
            onNextChapter={handleNextChapter}
            canPrev={canPrev}
            canNext={canNext}
            onStartAudio={handleStartAudio}
          />
        )}

        {activeView === 'books' && (
          <BooksHomeView
            onSelectBook={(b, ch) => handleSelectBook(b, ch || 1)}
            onOpenBookPicker={() => {
              setChapterPickerOpen(true);
            }}
          />
        )}

        {activeView === 'search' && (
          <FullSearchView onSelectVerse={(b, c, v) => handleSelectBook(b, c, v)} />
        )}

        {activeView === 'study' && (
          <StudyDrawerView
            highlights={highlights}
            notes={notes}
            bookmarks={bookmarks}
            history={history}
            onSelectVerse={(b, c, v) => handleSelectBook(b, c, v)}
            onRemoveHighlight={handleRemoveHighlight}
            onRemoveNote={handleDeleteNote}
            onRemoveBookmark={handleRemoveBookmark}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeView === 'plan' && (
          <ReadingPlanView
            onSelectPassage={(b, c, v) => handleSelectBook(b, c, v)}
            onOpenShare={(bName, cNum, vNum, text) =>
              setShareData({
                bookName: bName,
                chapterNumber: cNum,
                verseNumber: vNum,
                verseText: text,
              })
            }
          />
        )}
      </div>

      {/* Floating Audio Player Bar */}
      {audioBarOpen && chapterData && (
        <AudioPlayerBar
          bookName={chapterData.bookName}
          chapterNumber={chapterData.chapterNumber}
          verses={chapterData.verses}
          currentVerseIndex={currentAudioVerseIndex}
          onVerseChange={setCurrentAudioVerseIndex}
          onClose={() => setAudioBarOpen(false)}
        />
      )}

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={(b, c, v) => handleSelectBook(b, c, v)}
      />

      {/* Quick Jump Reference Dialog (Ctrl+J or Button) */}
      <QuickJumpDialog
        isOpen={quickJumpOpen}
        onClose={() => setQuickJumpOpen(false)}
        onJump={(b, c, v) => handleSelectBook(b, c, v)}
      />

      {/* Bible.com Style 2-Column Chapter & Book Picker Modal */}
      <ChapterPickerModal
        isOpen={chapterPickerOpen}
        currentBookNumber={bookNumber}
        currentChapterNumber={chapterNumber}
        onClose={() => setChapterPickerOpen(false)}
        onSelect={(b, c) => {
          handleSelectBook(b, c);
        }}
      />

      {/* Verse Share Modal */}
      {shareData && (
        <VerseShareModal
          isOpen={!!shareData}
          onClose={() => setShareData(null)}
          bookName={shareData.bookName}
          chapterNumber={shareData.chapterNumber}
          verseNumber={shareData.verseNumber}
          verseText={shareData.verseText}
        />
      )}
    </div>
  );
}
