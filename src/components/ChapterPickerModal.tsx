import React, { useState } from 'react';
import { BOOKS_META, OT_BOOKS, NT_BOOKS } from '../data/booksMeta';
import { BookMeta, TestamentType } from '../types/bible';
import { X, Search } from 'lucide-react';

interface ChapterPickerModalProps {
  isOpen: boolean;
  currentBookNumber: number;
  currentChapterNumber: number;
  onClose: () => void;
  onSelect: (bookNumber: number, chapterNumber: number) => void;
}

export const ChapterPickerModal: React.FC<ChapterPickerModalProps> = ({
  isOpen,
  currentBookNumber,
  currentChapterNumber,
  onClose,
  onSelect,
}) => {
  const [selectedBook, setSelectedBook] = useState<BookMeta>(() => {
    return BOOKS_META.find((b) => b.book_number === currentBookNumber) || BOOKS_META[0];
  });
  const [testament, setTestament] = useState<TestamentType>(
    currentBookNumber <= 39 ? 'ot' : 'nt'
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentBooks = testament === 'ot' ? OT_BOOKS : NT_BOOKS;
  const filteredBooks = searchQuery.trim()
    ? BOOKS_META.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        b.book_number.toString() === searchQuery.trim()
      )
    : currentBooks;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-[80vh] max-h-[640px] animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span
              className="text-base sm:text-lg font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
            >
              Misafidiana Boky sy Toko
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface2)] opacity-70 hover:opacity-100 transition-colors"
            style={{ color: 'var(--fg-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2-Column Responsive Layout (Bible.com layout) */}
        <div className="flex flex-1 min-h-0 divide-x" style={{ borderColor: 'var(--border)' }}>
          {/* Left Column: Books list with Testament Tabs */}
          <div className="w-1/2 flex flex-col">
            {/* Search Input */}
            <div className="p-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                }}
              >
                <Search size={13} style={{ color: 'var(--fg-dim)' }} />
                <input
                  type="text"
                  placeholder="Mitadiava boky..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs"
                  style={{ color: 'var(--fg)' }}
                />
              </div>

              {!searchQuery && (
                <div className="flex gap-1 mt-2 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--surface2)' }}>
                  <button
                    onClick={() => setTestament('ot')}
                    className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all text-center ${
                      testament === 'ot' ? 'shadow-xs font-semibold' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: testament === 'ot' ? 'var(--gold)' : 'transparent',
                      color: testament === 'ot' ? 'var(--bg)' : 'var(--fg)',
                    }}
                  >
                    Taloha (39)
                  </button>
                  <button
                    onClick={() => setTestament('nt')}
                    className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-all text-center ${
                      testament === 'nt' ? 'shadow-xs font-semibold' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: testament === 'nt' ? 'var(--gold)' : 'transparent',
                      color: testament === 'nt' ? 'var(--bg)' : 'var(--fg)',
                    }}
                  >
                    Vaovao (27)
                  </button>
                </div>
              )}
            </div>

            {/* Books List */}
            <div className="flex-1 overflow-y-auto py-1">
              {filteredBooks.map((b) => {
                const isSelected = selectedBook.book_number === b.book_number;
                const isCurrent = currentBookNumber === b.book_number;
                return (
                  <button
                    key={b.book_number}
                    onClick={() => setSelectedBook(b)}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm transition-colors border-l-2 ${
                      isSelected ? 'font-semibold' : 'hover:bg-[var(--surface2)]'
                    }`}
                    style={{
                      borderLeftColor: isSelected ? 'var(--gold)' : 'transparent',
                      backgroundColor: isSelected ? 'rgba(212,175,55,0.1)' : 'transparent',
                      color: isSelected ? 'var(--gold)' : 'var(--fg)',
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] w-4 text-right" style={{ color: 'var(--fg-dim)' }}>
                        {b.book_number}
                      </span>
                      <span className="truncate">{b.name}</span>
                    </div>

                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chapters Grid of the Selected Book */}
          <div className="w-1/2 flex flex-col p-4 overflow-y-auto">
            <div className="mb-3">
              <div className="text-[10px] uppercase font-semibold tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                Boky nofidina
              </div>
              <h3
                className="text-xl sm:text-2xl font-semibold mt-0.5"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                {selectedBook.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                Misafidiana toko (1 ka hatramin'ny {selectedBook.chapters})
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 pt-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => {
                const isCurrentChapter =
                  selectedBook.book_number === currentBookNumber && ch === currentChapterNumber;
                return (
                  <button
                    key={ch}
                    onClick={() => {
                      onSelect(selectedBook.book_number, ch);
                      onClose();
                    }}
                    className={`h-10 rounded-xl border text-sm font-mono font-medium flex items-center justify-center transition-all hover:scale-105 ${
                      isCurrentChapter
                        ? 'font-bold shadow-xs'
                        : 'hover:border-[var(--gold)] hover:text-[var(--gold)]'
                    }`}
                    style={{
                      backgroundColor: isCurrentChapter ? 'var(--gold)' : 'var(--surface2)',
                      borderColor: isCurrentChapter ? 'var(--gold)' : 'var(--border)',
                      color: isCurrentChapter ? 'var(--bg)' : 'var(--fg)',
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
