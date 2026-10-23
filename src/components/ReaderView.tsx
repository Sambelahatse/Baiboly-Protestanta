import React, { useEffect, useRef, useState } from 'react';
import { ChapterData, FontSizeLevel } from '../types/bible';
import { BOOKS_META, isOldTestament } from '../data/booksMeta';
import { ChevronLeft, ChevronRight, Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';

interface ReaderViewProps {
  chapterData: ChapterData | null;
  isLoading: boolean;
  fontSize: FontSizeLevel;
  highlightedVerses: Record<string, boolean>;
  targetVerse?: number;
  onToggleHighlight: (verseKey: string) => void;
  onSelectChapter: (chapterNumber: number) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onNavigateHome: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  chapterData,
  isLoading,
  fontSize,
  highlightedVerses,
  targetVerse,
  onToggleHighlight,
  onSelectChapter,
  onPrevChapter,
  onNextChapter,
  onNavigateHome,
}) => {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const readerScrollRef = useRef<HTMLDivElement>(null);
  const activeChapterRef = useRef<HTMLButtonElement>(null);

  // Scroll to target verse or top on chapter change
  useEffect(() => {
    if (targetVerse && !isLoading) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${targetVerse}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else if (readerScrollRef.current) {
      readerScrollRef.current.scrollTop = 0;
    }
  }, [chapterData?.bookNumber, chapterData?.chapterNumber, targetVerse, isLoading]);

  // Scroll chapter sidebar to current chapter
  useEffect(() => {
    if (activeChapterRef.current) {
      activeChapterRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chapterData?.chapterNumber]);

  if (isLoading || !chapterData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 select-none">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif italic" style={{ color: 'var(--fg-dim)' }}>
          Eo am-panokafana ny Tenin’Andriamanitra…
        </p>
      </div>
    );
  }

  const { bookNumber, bookName, chapterNumber, totalChapters, verses } = chapterData;
  const isOT = isOldTestament(bookNumber);
  const testamentName = isOT ? 'Testamenta Taloha' : 'Testamenta Vaovao';

  // Compute previous and next chapter labels
  let prevLabel: string | null = null;
  if (chapterNumber > 1) {
    prevLabel = `${bookName} ${chapterNumber - 1}`;
  } else if (bookNumber > 1) {
    const prevBook = BOOKS_META[bookNumber - 2];
    prevLabel = `${prevBook.name} ${prevBook.chapters}`;
  }

  let nextLabel: string | null = null;
  if (chapterNumber < totalChapters) {
    nextLabel = `${bookName} ${chapterNumber + 1}`;
  } else if (bookNumber < BOOKS_META.length) {
    const nextBook = BOOKS_META[bookNumber];
    nextLabel = `${nextBook.name} 1`;
  }

  const handleCopyVerse = (e: React.MouseEvent, verseNum: number, text: string) => {
    e.stopPropagation();
    const formatted = `${bookName} ${chapterNumber}:${verseNum} - « ${text} »`;
    navigator.clipboard.writeText(formatted);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sticky Chapter Quick-Bar (Desktop) */}
      {totalChapters > 1 && (
        <aside
          className="hidden lg:flex flex-col w-14 border-r py-4 px-1.5 flex-shrink-0 select-none overflow-y-auto"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[10px] uppercase font-semibold text-center mb-2 tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            Toko
          </div>
          <div className="flex flex-col gap-1">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => {
              const isCurrent = ch === chapterNumber;
              return (
                <button
                  key={ch}
                  ref={isCurrent ? activeChapterRef : null}
                  onClick={() => onSelectChapter(ch)}
                  className={`h-8 rounded-md text-xs font-mono font-medium transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'shadow-xs font-bold'
                      : 'hover:bg-[var(--surface2)] opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? 'var(--gold)' : 'transparent',
                    color: isCurrent ? 'var(--bg)' : 'var(--fg-muted)',
                  }}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main Reader Scroll Container */}
      <main ref={readerScrollRef} className="flex-1 overflow-y-auto min-w-0 scroll-smooth">
        <div className="max-w-[760px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs mb-8 select-none flex-wrap" style={{ color: 'var(--fg-dim)' }}>
            <button
              onClick={onNavigateHome}
              className="hover:underline transition-colors"
              style={{ color: 'var(--fg-muted)' }}
            >
              Baiboly
            </button>
            <span>/</span>
            <span>{testamentName}</span>
            <span>/</span>
            <span style={{ color: 'var(--fg-muted)' }}>{bookName}</span>
            <span>/</span>
            <strong style={{ color: 'var(--gold)' }}>Toko {chapterNumber}</strong>
          </nav>

          {/* Chapter Header */}
          <div className="text-center mb-10 select-none">
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: 'var(--fg-dim)' }}
            >
              {testamentName}
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-2 leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--fg)',
              }}
            >
              {bookName}
            </h1>
            <p
              className="text-xl sm:text-2xl italic font-normal"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--gold)',
              }}
            >
              Toko {chapterNumber}
            </p>

            {/* Ornamental Divider */}
            <div className="flex items-center gap-4 my-6 text-xs max-w-xs mx-auto" style={{ color: 'var(--fg-dim)' }}>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />
              <span className="tracking-[0.3em]" style={{ color: 'var(--gold-dim)' }}>
                ✦ ✦ ✦
              </span>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--border)' }} />
            </div>
          </div>

          {/* Verses List */}
          <div
            className="space-y-1.5 leading-relaxed selection:bg-amber-500/20"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: `${fontSize}px`,
            }}
          >
            {verses.map((verse) => {
              const verseKey = `b${bookNumber}_c${chapterNumber}_v${verse.verseNumber}`;
              const isHighlighted = !!highlightedVerses[verseKey];
              const isTarget = targetVerse === verse.verseNumber;

              return (
                <div
                  key={verse.verseNumber}
                  id={`verse-${verse.verseNumber}`}
                  onClick={() => onToggleHighlight(verseKey)}
                  className={`group relative flex items-start gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                    isHighlighted
                      ? 'bg-amber-500/15 border-l-2 border-[var(--gold)]'
                      : isTarget
                      ? 'bg-amber-500/20 ring-1 ring-[var(--gold)]'
                      : 'hover:bg-[var(--surface2)]/50'
                  }`}
                >
                  {/* Verse Number */}
                  <span
                    className="select-none font-mono text-xs pt-1 w-6 text-right font-medium flex-shrink-0 tabular-nums transition-colors"
                    style={{
                      color: isHighlighted || isTarget ? 'var(--gold)' : 'var(--gold-dim)',
                    }}
                  >
                    {verse.verseNumber}
                  </span>

                  {/* Verse Text */}
                  <p className="flex-1 leading-relaxed" style={{ color: 'var(--fg)' }}>
                    {verse.text}
                  </p>

                  {/* Quick Action Overlay (Copy, Bookmark) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-1 flex-shrink-0 select-none">
                    <button
                      onClick={(e) => handleCopyVerse(e, verse.verseNumber, verse.text)}
                      title="Adikao ity andininy ity"
                      className="p-1 rounded hover:bg-[var(--surface2)] text-xs transition-colors"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {copiedVerse === verse.verseNumber ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleHighlight(verseKey);
                      }}
                      title={isHighlighted ? "Esory ny fanamarihana" : "Mariho ity andininy ity"}
                      className="p-1 rounded hover:bg-[var(--surface2)] text-xs transition-colors"
                      style={{ color: isHighlighted ? 'var(--gold)' : 'var(--fg-dim)' }}
                    >
                      {isHighlighted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chapter Bottom Navigation */}
          <nav
            className="flex items-center justify-between gap-4 mt-14 pt-8 border-t select-none"
            style={{ borderColor: 'var(--border)' }}
          >
            {prevLabel ? (
              <button
                onClick={onPrevChapter}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all hover:border-[var(--gold)] group"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>{prevLabel}</span>
              </button>
            ) : (
              <div />
            )}

            {nextLabel ? (
              <button
                onClick={onNextChapter}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all hover:border-[var(--gold)] group"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <span>{nextLabel}</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </main>
    </div>
  );
};
