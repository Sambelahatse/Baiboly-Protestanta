import React from 'react';
import { BOOKS_META } from '../data/booksMeta';
import { FontSizeLevel } from '../types/bible';
import { Search, Sun, Moon, PanelLeft, ChevronLeft, ChevronRight, BookOpen, Library } from 'lucide-react';

interface TopbarProps {
  currentBook: number;
  currentChapter: number;
  totalChapters: number;
  fontSize: FontSizeLevel;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  activeView: 'reader' | 'books' | 'search';
  onSelectBook: (bookNumber: number) => void;
  onSelectChapter: (chapterNumber: number) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canPrev: boolean;
  canNext: boolean;
  onToggleSearch: () => void;
  onCycleFontSize: () => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onSetView: (view: 'reader' | 'books' | 'search') => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentBook,
  currentChapter,
  totalChapters,
  fontSize,
  theme,
  sidebarOpen,
  activeView,
  onSelectBook,
  onSelectChapter,
  onPrevChapter,
  onNextChapter,
  canPrev,
  canNext,
  onToggleSearch,
  onCycleFontSize,
  onToggleTheme,
  onToggleSidebar,
  onSetView,
}) => {
  const fontLabels: Record<FontSizeLevel, string> = {
    15: 'A⁻',
    17: 'A',
    19: 'A⁺',
    22: 'A⁺⁺',
  };

  return (
    <header className="h-[54px] sticky top-0 z-30 flex items-center justify-between px-3 md:px-5 border-b select-none flex-shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--fg)',
      }}
    >
      {/* Brand & Sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:opacity-80 transition-colors"
          style={{
            color: sidebarOpen ? 'var(--gold)' : 'var(--fg-muted)',
            backgroundColor: sidebarOpen ? 'rgba(201,168,76,0.1)' : 'transparent',
          }}
          title={sidebarOpen ? 'Hakatona ny lisitra' : 'Hovohana ny lisitra'}
        >
          <PanelLeft size={18} />
        </button>

        <button
          onClick={() => onSetView('books')}
          className="flex items-baseline gap-1.5 font-semibold text-left transition-opacity hover:opacity-90"
        >
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
          >
            Baiboly
          </span>
          <span
            className="text-xs font-normal tracking-wide hidden sm:inline"
            style={{ color: 'var(--fg-dim)', fontFamily: 'var(--font-ui)' }}
          >
            1865
          </span>
        </button>

        {/* View Mode Pills */}
        <div className="hidden lg:flex items-center gap-1 ml-2 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => onSetView('reader')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'reader' ? 'shadow-xs' : ''
            }`}
            style={{
              backgroundColor: activeView === 'reader' ? 'var(--surface2)' : 'transparent',
              color: activeView === 'reader' ? 'var(--gold)' : 'var(--fg-muted)',
            }}
          >
            <BookOpen size={13} />
            Hamaky
          </button>
          <button
            onClick={() => onSetView('books')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'books' ? 'shadow-xs' : ''
            }`}
            style={{
              backgroundColor: activeView === 'books' ? 'var(--surface2)' : 'transparent',
              color: activeView === 'books' ? 'var(--gold)' : 'var(--fg-muted)',
            }}
          >
            <Library size={13} />
            Boky
          </button>
        </div>
      </div>

      {/* Chapter & Book Quick Navigator */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onPrevChapter}
          disabled={!canPrev}
          title="Toko teo aloha (Left arrow)"
          className="w-8 h-8 rounded-md flex items-center justify-center border transition-opacity disabled:opacity-30 disabled:pointer-events-none hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <select
          value={currentBook}
          onChange={(e) => onSelectBook(Number(e.target.value))}
          className="text-xs sm:text-sm font-medium py-1.5 px-2 rounded-md border outline-none cursor-pointer max-w-[110px] sm:max-w-[170px]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg)',
          }}
        >
          <optgroup label="Testamenta Taloha">
            {BOOKS_META.slice(0, 39).map((b) => (
              <option key={b.book_number} value={b.book_number}>
                {b.book_number}. {b.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Testamenta Vaovao">
            {BOOKS_META.slice(39).map((b) => (
              <option key={b.book_number} value={b.book_number}>
                {b.book_number}. {b.name}
              </option>
            ))}
          </optgroup>
        </select>

        <select
          value={currentChapter}
          onChange={(e) => onSelectChapter(Number(e.target.value))}
          className="text-xs sm:text-sm font-medium py-1.5 px-2 rounded-md border outline-none cursor-pointer w-[68px] sm:w-[76px]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg)',
          }}
        >
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
            <option key={ch} value={ch}>
              Toko {ch}
            </option>
          ))}
        </select>

        <button
          onClick={onNextChapter}
          disabled={!canNext}
          title="Toko manaraka (Right arrow)"
          className="w-8 h-8 rounded-md flex items-center justify-center border transition-opacity disabled:opacity-30 disabled:pointer-events-none hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Action buttons: Search, Font size, Theme */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={onToggleSearch}
          title="Fikarohana (Ctrl+K)"
          className="h-8 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 border transition-colors hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }}
        >
          <Search size={15} />
          <span className="hidden md:inline text-xs" style={{ color: 'var(--fg-dim)' }}>
            Karohy (Ctrl+K)
          </span>
        </button>

        <button
          onClick={onCycleFontSize}
          title="Habean'ny soratra (Font size)"
          className="w-8 h-8 rounded-md flex items-center justify-center border font-serif text-sm font-semibold transition-colors hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--gold)',
          }}
        >
          {fontLabels[fontSize]}
        </button>

        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Hovaina ho mazava' : 'Hovaina ho maizina'}
          className="w-8 h-8 rounded-md flex items-center justify-center border transition-colors hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
