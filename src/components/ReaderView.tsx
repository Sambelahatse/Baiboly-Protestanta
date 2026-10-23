import React, { useEffect, useRef, useState } from 'react';
import {
  ChapterData,
  FontSizeLevel,
  AppFontFamily,
  HighlightItem,
  UserNote,
  HighlightColor,
} from '../types/bible';
import { isOldTestament } from '../data/booksMeta';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  FileText,
} from 'lucide-react';
import { FloatingVerseDock } from './FloatingVerseDock';
import { VerseShareModal } from './VerseShareModal';

interface SelectedVerseInfo {
  verseNumber: number;
  text: string;
}

interface ReaderViewProps {
  chapterData: ChapterData | null;
  isLoading: boolean;
  fontSize: FontSizeLevel;
  fontFamily: AppFontFamily;
  highlights: Record<string, HighlightItem>;
  notes: Record<string, UserNote>;
  isBookmarked: boolean;
  targetVerse?: number;
  onOpenChapterPicker: () => void;
  onSetHighlight: (
    verseKey: string,
    color: HighlightColor | null,
    text: string,
    bookNum: number,
    bookName: string,
    chapNum: number,
    verseNum: number
  ) => void;
  onSaveNote: (
    verseKey: string,
    content: string,
    text: string,
    bookNum: number,
    bookName: string,
    chapNum: number,
    verseNum: number
  ) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleBookmark: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canPrev: boolean;
  canNext: boolean;
  onStartAudio: (verseIndex?: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  chapterData,
  isLoading,
  fontSize,
  fontFamily,
  highlights,
  notes,
  isBookmarked,
  targetVerse,
  onOpenChapterPicker,
  onSetHighlight,
  onSaveNote,
  onToggleBookmark,
  onPrevChapter,
  onNextChapter,
  canPrev,
  canNext,
  onStartAudio,
}) => {
  const [selectedVerses, setSelectedVerses] = useState<SelectedVerseInfo[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const readerScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to target verse or top on chapter change
  useEffect(() => {
    setSelectedVerses([]);
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

  const { bookNumber, bookName, chapterNumber, verses } = chapterData;
  const isOT = isOldTestament(bookNumber);
  const testamentName = isOT ? 'Testamenta Taloha' : 'Testamenta Vaovao';

  // Toggle verse selection (Bible.com multi-select interaction)
  const handleToggleVerseSelection = (verseNumber: number, text: string) => {
    setSelectedVerses((prev) => {
      const exists = prev.some((v) => v.verseNumber === verseNumber);
      if (exists) {
        return prev.filter((v) => v.verseNumber !== verseNumber);
      } else {
        const updated = [...prev, { verseNumber, text }];
        return updated.sort((a, b) => a.verseNumber - b.verseNumber);
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedVerses([]);
  };

  // Highlighting selected verses
  const handleApplyHighlight = (color: HighlightColor | null) => {
    selectedVerses.forEach((v) => {
      const key = `b${bookNumber}_c${chapterNumber}_v${v.verseNumber}`;
      onSetHighlight(key, color, v.text, bookNumber, bookName, chapterNumber, v.verseNumber);
    });
    handleClearSelection();
  };

  // Copy selected verses
  const handleCopySelected = () => {
    if (selectedVerses.length === 0) return;
    const firstV = selectedVerses[0].verseNumber;
    const lastV = selectedVerses[selectedVerses.length - 1].verseNumber;
    const ref =
      selectedVerses.length === 1
        ? `${bookName} ${chapterNumber}:${firstV}`
        : `${bookName} ${chapterNumber}:${firstV}–${lastV}`;

    const versesText = selectedVerses.map((v) => `${v.verseNumber}. ${v.text}`).join('\n');
    const full = `« ${versesText} »\n\n— ${ref} (Baiboly Protestanta 1865)`;
    navigator.clipboard.writeText(full);
    handleClearSelection();
  };

  // Share selected verses
  const handleShareSelected = () => {
    if (selectedVerses.length === 0) return;
    const firstV = selectedVerses[0].verseNumber;
    const lastV = selectedVerses[selectedVerses.length - 1].verseNumber;
    const ref =
      selectedVerses.length === 1
        ? `${bookName} ${chapterNumber}:${firstV}`
        : `${bookName} ${chapterNumber}:${firstV}–${lastV}`;

    const versesText = selectedVerses.map((v) => `${v.verseNumber}. ${v.text}`).join('\n');
    const full = `« ${versesText} »\n\n— ${ref} (Baiboly Protestanta 1865)`;

    if (navigator.share) {
      navigator.share({ title: ref, text: full }).catch(() => {});
    } else {
      navigator.clipboard.writeText(full);
    }
  };

  // Open note editor
  const handleOpenNoteModal = () => {
    if (selectedVerses.length === 0) return;
    const firstKey = `b${bookNumber}_c${chapterNumber}_v${selectedVerses[0].verseNumber}`;
    setNoteContent(notes[firstKey]?.content || '');
    setNoteModalOpen(true);
  };

  const handleSaveNoteSubmit = () => {
    if (selectedVerses.length > 0 && noteContent.trim()) {
      selectedVerses.forEach((v) => {
        const key = `b${bookNumber}_c${chapterNumber}_v${v.verseNumber}`;
        onSaveNote(key, noteContent.trim(), v.text, bookNumber, bookName, chapterNumber, v.verseNumber);
      });
      setNoteModalOpen(false);
      handleClearSelection();
    }
  };

  const colorStyles: Record<HighlightColor, { bg: string; border: string }> = {
    gold: { bg: 'rgba(212, 175, 55, 0.22)', border: '#D4AF37' },
    emerald: { bg: 'rgba(16, 185, 129, 0.22)', border: '#10B981' },
    blue: { bg: 'rgba(59, 130, 246, 0.22)', border: '#3B82F6' },
    rose: { bg: 'rgba(244, 63, 94, 0.22)', border: '#F43F5E' },
    purple: { bg: 'rgba(168, 85, 247, 0.22)', border: '#A855F7' },
  };

  const firstSelectedKey =
    selectedVerses.length > 0
      ? `b${bookNumber}_c${chapterNumber}_v${selectedVerses[0].verseNumber}`
      : undefined;
  const currentHighlight = firstSelectedKey ? highlights[firstSelectedKey] : undefined;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Bible.com Floating Subheader Bar */}
      <div
        className="h-12 border-b px-4 sm:px-8 flex items-center justify-between select-none z-10 flex-shrink-0"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Chapter selector pill button */}
          <button
            onClick={onOpenChapterPicker}
            className="px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all hover:border-[var(--gold)]"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            <span>
              {bookName} {chapterNumber}
            </span>
            <span className="text-[10px] opacity-60">▾</span>
          </button>

          {/* Bible Version Pill */}
          <button
            onClick={onOpenChapterPicker}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-medium hidden sm:flex items-center gap-1 transition-all opacity-80 hover:opacity-100"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--gold)',
            }}
            title="Baiboly Protestanta Malagasy 1865"
          >
            <span>BPM</span>
            <span className="text-[10px] opacity-60">▾</span>
          </button>
        </div>

        {/* Audio Listen Button (Bible.com headphones icon) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartAudio(0)}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all hover:border-[var(--gold)]"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
            title="Hihaino feo an’ity toko ity"
          >
            <Headphones size={14} style={{ color: 'var(--gold)' }} />
            <span className="hidden sm:inline">Hihaino</span>
          </button>
        </div>
      </div>

      {/* Main Scripture Scroll Area with Floating Prev/Next arrows */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Floating Left Arrow (Previous Chapter) */}
        {canPrev && (
          <button
            onClick={onPrevChapter}
            title="Toko teo aloha"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border shadow-lg items-center justify-center transition-all hover:scale-105 hover:border-[var(--gold)] opacity-70 hover:opacity-100"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Floating Right Arrow (Next Chapter) */}
        {canNext && (
          <button
            onClick={onNextChapter}
            title="Toko manaraka"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border shadow-lg items-center justify-center transition-all hover:scale-105 hover:border-[var(--gold)] opacity-70 hover:opacity-100"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Reading Canvas Container */}
        <main ref={readerScrollRef} className="flex-1 overflow-y-auto min-w-0 scroll-smooth">
          <div className="max-w-[720px] mx-auto px-5 sm:px-10 py-10 sm:py-16">
            {/* Header */}
            <div className="text-center mb-12 select-none">
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: 'var(--fg-dim)' }}
              >
                {testamentName}
              </div>
              <h1
                className="text-4xl sm:text-5xl font-semibold tracking-tight mb-2 leading-none"
                style={{
                  fontFamily: fontFamily === 'serif' ? 'var(--font-display)' : 'var(--font-ui)',
                  color: 'var(--fg)',
                }}
              >
                {bookName}
              </h1>
              <p
                className="text-xl sm:text-2xl italic font-normal"
                style={{
                  fontFamily: fontFamily === 'serif' ? 'var(--font-display)' : 'var(--font-ui)',
                  color: 'var(--gold)',
                }}
              >
                Toko {chapterNumber}
              </p>
            </div>

            {/* Verses List (Bible.com clean reading canvas) */}
            <div
              className="space-y-2 leading-relaxed selection:bg-amber-500/20"
              style={{
                fontFamily:
                  fontFamily === 'serif' ? 'var(--font-body-serif)' : 'var(--font-body-sans)',
                fontSize: `${fontSize}px`,
                lineHeight: '1.9',
              }}
            >
              {verses.map((verse) => {
                const verseKey = `b${bookNumber}_c${chapterNumber}_v${verse.verseNumber}`;
                const highlight = highlights[verseKey];
                const note = notes[verseKey];
                const isSelected = selectedVerses.some((v) => v.verseNumber === verse.verseNumber);
                const isTarget = targetVerse === verse.verseNumber;

                const highlightStyle = highlight && colorStyles[highlight.color];

                return (
                  <div
                    key={verse.verseNumber}
                    id={`verse-${verse.verseNumber}`}
                    onClick={() => handleToggleVerseSelection(verse.verseNumber, verse.text)}
                    className={`group relative flex items-baseline gap-2.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[var(--gold)] bg-amber-500/10'
                        : highlight
                        ? 'border-l-4'
                        : isTarget
                        ? 'bg-amber-500/15'
                        : 'hover:bg-[var(--surface2)]/40'
                    }`}
                    style={{
                      backgroundColor: highlightStyle && !isSelected ? highlightStyle.bg : undefined,
                      borderLeftColor: highlightStyle && !isSelected ? highlightStyle.border : undefined,
                    }}
                  >
                    {/* Verse Number (Bible.com superscript style) */}
                    <span
                      className="select-none font-mono text-[11px] font-semibold w-5 text-right flex-shrink-0 tabular-nums self-start pt-1"
                      style={{
                        color: isSelected || highlight ? 'var(--gold)' : 'var(--fg-dim)',
                      }}
                    >
                      {verse.verseNumber}
                    </span>

                    {/* Verse Text */}
                    <div className="flex-1">
                      <span style={{ color: 'var(--fg)' }}>{verse.text}</span>

                      {/* Note indicator badge */}
                      {note && (
                        <span
                          className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-500 select-none align-middle"
                          title={`Fanamarihana: ${note.content}`}
                        >
                          <FileText size={10} />
                          <span className="hidden sm:inline italic max-w-[120px] truncate">
                            {note.content}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Bottom Chapter Navigation Arrows */}
            <div
              className="flex items-center justify-between gap-4 mt-16 pt-8 border-t select-none md:hidden"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={onPrevChapter}
                disabled={!canPrev}
                className="px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 disabled:opacity-30"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <ChevronLeft size={16} />
                <span>Teo aloha</span>
              </button>

              <button
                onClick={onNextChapter}
                disabled={!canNext}
                className="px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 disabled:opacity-30"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <span>Manaraka</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Bible.com Floating Verse Action Dock */}
      <FloatingVerseDock
        bookName={bookName}
        chapterNumber={chapterNumber}
        selectedVerses={selectedVerses}
        currentHighlight={currentHighlight}
        hasNote={selectedVerses.some((v) => !!notes[`b${bookNumber}_c${chapterNumber}_v${v.verseNumber}`])}
        isBookmarked={isBookmarked}
        onClearSelection={handleClearSelection}
        onSetHighlight={handleApplyHighlight}
        onOpenNote={handleOpenNoteModal}
        onToggleBookmark={onToggleBookmark}
        onPlayAudio={() => {
          if (selectedVerses.length > 0) {
            onStartAudio(selectedVerses[0].verseNumber - 1);
          }
        }}
        onOpenImageCard={() => setShareModalOpen(true)}
        onCopy={handleCopySelected}
        onShare={handleShareSelected}
      />

      {/* Note Editor Modal */}
      {noteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none"
          onClick={() => setNoteModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-5"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Fanamarihana d’Etude
              </h3>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                Aoka ihany
              </button>
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Soraty eto ny hevitrao, fampianarana na vavaka..."
              rows={4}
              className="w-full p-3 rounded-xl border text-xs sm:text-sm outline-none resize-none mb-3"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveNoteSubmit}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--bg)',
                }}
              >
                Tehirizo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verse Share Modal (Image Card Generator) */}
      {shareModalOpen && selectedVerses.length > 0 && (
        <VerseShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          bookName={bookName}
          chapterNumber={chapterNumber}
          verseNumber={selectedVerses[0].verseNumber}
          verseText={selectedVerses.map((v) => v.text).join(' ')}
        />
      )}
    </div>
  );
};
