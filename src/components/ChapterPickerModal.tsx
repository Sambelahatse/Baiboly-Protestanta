import React from 'react';
import { BookMeta } from '../types/bible';
import { isOldTestament } from '../data/booksMeta';
import { X, BookOpen } from 'lucide-react';

interface ChapterPickerModalProps {
  book: BookMeta | null;
  onClose: () => void;
  onSelectChapter: (bookNumber: number, chapterNumber: number) => void;
}

export const ChapterPickerModal: React.FC<ChapterPickerModalProps> = ({
  book,
  onClose,
  onSelectChapter,
}) => {
  if (!book) return null;

  const isOT = isOldTestament(book.book_number);
  const testamentName = isOT ? 'Testamenta Taloha' : 'Testamenta Vaovao';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--fg-dim)' }}>
              {testamentName} • Boky faha-{book.book_number}
            </div>
            <h2
              className="text-2xl sm:text-3xl font-semibold leading-tight mt-0.5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
            >
              {book.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectChapter(book.book_number, 1)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors hover:border-[var(--gold)]"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--gold)',
              }}
            >
              <BookOpen size={14} />
              <span>Toko 1</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface2)] transition-colors opacity-70 hover:opacity-100"
              style={{ color: 'var(--fg-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--fg-dim)' }}>
            Misafidiana toko ({book.chapters} toko)
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                onClick={() => onSelectChapter(book.book_number, ch)}
                className="h-10 rounded-lg border text-sm font-mono font-medium flex items-center justify-center transition-all hover:scale-105 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
