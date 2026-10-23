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
      <div className="max-w-[1040px] mx-auto px-5 sm:px-10 py-10 sm:py-14">
        {/* Hero Section (Bible.com clean style) */}
        <div className="text-center py-6 sm:py-10 mb-8 select-none">
          <div
            className="text-xs uppercase font-semibold tracking-[0.2em] mb-2"
            style={{ color: 'var(--primary)' }}
          >
            Baiboly Protestanta Malagasy (1865)
          </div>
          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-3 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--fg)',
            }}
          >
            Ny Tenin’Andriamanitra
          </h1>
          <p
            className="text-lg sm:text-xl italic font-normal mb-8 max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-body-serif)',
              color: 'var(--gold)',
            }}
          >
            « Fanilon’ ny tongotro sy fanazavana ny lalako ny teninao. »
          </p>

          {/* Clean Unboxed Stats (No AI pill boxes) */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 text-xs text-slate-500 flex-wrap">
            <div className="text-center">
              <span
                className="text-2xl sm:text-3xl font-bold block tabular-nums leading-none"
                style={{ color: 'var(--fg)' }}
              >
                {TOTAL_BOOKS}
              </span>
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                Boky
              </span>
            </div>
            <span aria-hidden="true" style={{ color: 'var(--border)' }}>·</span>
            <div className="text-center">
              <span
                className="text-2xl sm:text-3xl font-bold block tabular-nums leading-none"
                style={{ color: 'var(--fg)' }}
              >
                {TOTAL_CHAPTERS.toLocaleString()}
              </span>
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                Toko
              </span>
            </div>
            <span aria-hidden="true" style={{ color: 'var(--border)' }}>·</span>
            <div className="text-center">
              <span
                className="text-2xl sm:text-3xl font-bold block tabular-nums leading-none"
                style={{ color: 'var(--fg)' }}
              >
                {TOTAL_VERSES.toLocaleString()}
              </span>
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                Andininy
              </span>
            </div>
          </div>
        </div>

        {/* Search / Filter Input */}
        <div className="mb-10 max-w-md mx-auto">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm shadow-xs"
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
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b select-none" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-baseline gap-2">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
                >
                  Testamenta Taloha
                </h2>
                <span className="text-xs" style={{ color: 'var(--fg-dim)' }}>
                  ({filteredOT.length} boky)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredOT.map((book) => (
                <div
                  key={book.book_number}
                  className="group relative p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between hover:border-[var(--gold)] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                  onClick={() => onOpenBookPicker(book)}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono tabular-nums block mb-1 opacity-60"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {book.book_number}
                    </span>
                    <h3
                      className="font-semibold text-sm leading-snug group-hover:text-[var(--gold)] transition-colors"
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
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b select-none" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-baseline gap-2">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
                >
                  Testamenta Vaovao
                </h2>
                <span className="text-xs" style={{ color: 'var(--fg-dim)' }}>
                  ({filteredNT.length} boky)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredNT.map((book) => (
                <div
                  key={book.book_number}
                  className="group relative p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between hover:border-[var(--gold)] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                  onClick={() => onOpenBookPicker(book)}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono tabular-nums block mb-1 opacity-60"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {book.book_number}
                    </span>
                    <h3
                      className="font-semibold text-sm leading-snug group-hover:text-[var(--gold)] transition-colors"
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
