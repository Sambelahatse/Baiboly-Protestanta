import React, { useState } from 'react';
import { TOTAL_BOOKS, TOTAL_CHAPTERS, TOTAL_VERSES, OT_BOOKS, NT_BOOKS } from '../data/booksMeta';
import { BookMeta } from '../types/bible';
import { Search, BookOpen } from 'lucide-react';

interface BooksHomeViewProps {
  onSelectBook: (bookNumber: number, chapterNumber?: number) => void;
  onOpenBookPicker: (book: BookMeta) => void;
}

export const BooksHomeView: React.FC<BooksHomeViewProps> = ({
  onSelectBook,
  onOpenBookPicker,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filterBooks = (books: BookMeta[]) => {
    if (!searchFilter.trim()) return books;
    const query = searchFilter.toLowerCase().trim();
    return books.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.book_number.toString() === query
    );
  };

  const filteredOT = filterBooks(OT_BOOKS);
  const filteredNT = filterBooks(NT_BOOKS);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center py-8 sm:py-12 border-b mb-10 select-none" style={{ borderColor: 'var(--border)' }}>
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--fg-dim)' }}
          >
            Dikan-teny malagasy
          </div>
          <h1
            className="text-4xl sm:text-6xl font-semibold tracking-tight mb-3 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--fg)',
            }}
          >
            Baiboly Protestanta
          </h1>
          <p
            className="text-xl sm:text-2xl italic font-normal mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--gold)',
            }}
          >
            Tenin’Andriamanitra — 1865
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap">
            <div className="text-center">
              <span
                className="text-3xl sm:text-4xl font-semibold tabular-nums leading-none block"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                {TOTAL_BOOKS}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--fg-dim)' }}>
                Boky
              </span>
            </div>
            <div className="text-center">
              <span
                className="text-3xl sm:text-4xl font-semibold tabular-nums leading-none block"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                {TOTAL_CHAPTERS.toLocaleString()}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--fg-dim)' }}>
                Toko
              </span>
            </div>
            <div className="text-center">
              <span
                className="text-3xl sm:text-4xl font-semibold tabular-nums leading-none block"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                {TOTAL_VERSES.toLocaleString()}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--fg-dim)' }}>
                Andininy
              </span>
            </div>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mb-8 max-w-md mx-auto">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <Search size={16} style={{ color: 'var(--fg-dim)' }} />
            <input
              type="text"
              placeholder="Mitadiava boky (oh: Genesisy, Salamo, Jaona)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: 'var(--fg)' }}
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="text-xs opacity-60 hover:opacity-100"
                style={{ color: 'var(--fg-muted)' }}
              >
                Esory
              </button>
            )}
          </div>
        </div>

        {/* Testamenta Taloha (Old Testament) */}
        {filteredOT.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5 select-none">
              <h2
                className="text-2xl font-semibold leading-none"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
              >
                Testamenta Taloha
              </h2>
              <span
                className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                {filteredOT.length} boky
              </span>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {filteredOT.map((book) => (
                <div
                  key={book.book_number}
                  className="group relative p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                  onClick={() => onOpenBookPicker(book)}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono tabular-nums block mb-1"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {book.book_number}
                    </span>
                    <h3
                      className="font-semibold text-sm sm:text-base leading-snug group-hover:text-[var(--gold)] transition-colors"
                      style={{ color: 'var(--fg)' }}
                    >
                      {book.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'var(--fg-dim)' }}>
                    <span>{book.chapters} toko</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBook(book.book_number, 1);
                      }}
                      title={`Hamaky ${book.name} toko voalohany`}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:text-[var(--gold)] transition-opacity"
                    >
                      <BookOpen size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testamenta Vaovao (New Testament) */}
        {filteredNT.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5 select-none">
              <h2
                className="text-2xl font-semibold leading-none"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
              >
                Testamenta Vaovao
              </h2>
              <span
                className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                {filteredNT.length} boky
              </span>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {filteredNT.map((book) => (
                <div
                  key={book.book_number}
                  className="group relative p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                  onClick={() => onOpenBookPicker(book)}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono tabular-nums block mb-1"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {book.book_number}
                    </span>
                    <h3
                      className="font-semibold text-sm sm:text-base leading-snug group-hover:text-[var(--gold)] transition-colors"
                      style={{ color: 'var(--fg)' }}
                    >
                      {book.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'var(--fg-dim)' }}>
                    <span>{book.chapters} toko</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBook(book.book_number, 1);
                      }}
                      title={`Hamaky ${book.name} toko voalohany`}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:text-[var(--gold)] transition-opacity"
                    >
                      <BookOpen size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
