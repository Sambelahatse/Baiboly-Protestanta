import React, { useState } from 'react';
import { BOOKS_META } from '../data/booksMeta';
import { TestamentType } from '../types/bible';
import { Search, X } from 'lucide-react';

interface SidebarProps {
  currentBook: number;
  isOpen: boolean;
  onSelectBook: (bookNumber: number) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBook,
  isOpen,
  onSelectBook,
  onClose,
}) => {
  const [testament, setTestament] = useState<TestamentType>(
    currentBook <= 39 ? 'ot' : 'nt'
  );
  const [filterQuery, setFilterQuery] = useState('');

  const booksToDisplay = BOOKS_META.filter((b) => {
    const isMatchingTestament = testament === 'ot' ? b.book_number <= 39 : b.book_number > 39;
    if (filterQuery.trim()) {
      return (
        b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        b.book_number.toString() === filterQuery.trim()
      );
    }
    return isMatchingTestament;
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 top-[54px] bottom-0 z-20 w-72 md:w-64 flex flex-col border-r transition-all duration-200 ease-in-out select-none flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header with Testament Tabs */}
        <div className="p-3 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <h3
              className="text-[11px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--fg-dim)' }}
            >
              Lisitry ny Boky
            </h3>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-sm text-xs opacity-70 hover:opacity-100"
              style={{ color: 'var(--fg-muted)' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick search input */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs mb-2.5"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
            }}
          >
            <Search size={13} style={{ color: 'var(--fg-dim)' }} />
            <input
              type="text"
              placeholder="Sivana boky..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs"
              style={{ color: 'var(--fg)' }}
            />
            {filterQuery && (
              <button onClick={() => setFilterQuery('')} className="opacity-60 hover:opacity-100">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Testament Tabs */}
          {!filterQuery && (
            <div className="flex gap-1.5 p-0.5 rounded-md" style={{ backgroundColor: 'var(--surface2)' }}>
              <button
                onClick={() => setTestament('ot')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-sm transition-all text-center ${
                  testament === 'ot' ? 'shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: testament === 'ot' ? 'var(--gold)' : 'transparent',
                  color: testament === 'ot' ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                Taloha (39)
              </button>
              <button
                onClick={() => setTestament('nt')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-sm transition-all text-center ${
                  testament === 'nt' ? 'shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: testament === 'nt' ? 'var(--gold)' : 'transparent',
                  color: testament === 'nt' ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                Vaovao (27)
              </button>
            </div>
          )}
        </div>

        {/* Books List */}
        <div className="flex-1 overflow-y-auto py-1">
          {booksToDisplay.length === 0 ? (
            <div className="p-4 text-center text-xs" style={{ color: 'var(--fg-dim)' }}>
              Tsy nisy boky mifanaraka amin’io
            </div>
          ) : (
            booksToDisplay.map((book) => {
              const isActive = book.book_number === currentBook;
              return (
                <button
                  key={book.book_number}
                  onClick={() => {
                    onSelectBook(book.book_number);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors border-l-2 text-xs sm:text-[13px] ${
                    isActive ? 'font-semibold' : 'hover:bg-[var(--surface2)]'
                  }`}
                  style={{
                    borderLeftColor: isActive ? 'var(--gold)' : 'transparent',
                    backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: isActive ? 'var(--gold)' : 'var(--fg-muted)',
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="text-[11px] tabular-nums font-mono w-5 flex-shrink-0 text-right"
                      style={{ color: isActive ? 'var(--gold)' : 'var(--fg-dim)' }}
                    >
                      {book.book_number}
                    </span>
                    <span className="truncate">{book.name}</span>
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-sm tabular-nums"
                    style={{
                      backgroundColor: 'var(--surface2)',
                      color: 'var(--fg-dim)',
                    }}
                  >
                    {book.chapters} toko
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};
