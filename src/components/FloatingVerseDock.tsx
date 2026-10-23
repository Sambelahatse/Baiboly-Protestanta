import React from 'react';
import { HighlightColor, HighlightItem } from '../types/bible';
import { X, Copy, Share2, Volume2, Bookmark, FileText, Image, Check } from 'lucide-react';

interface SelectedVerseInfo {
  verseNumber: number;
  text: string;
}

interface FloatingVerseDockProps {
  bookName: string;
  chapterNumber: number;
  selectedVerses: SelectedVerseInfo[];
  currentHighlight?: HighlightItem;
  hasNote?: boolean;
  isBookmarked?: boolean;
  onClearSelection: () => void;
  onSetHighlight: (color: HighlightColor | null) => void;
  onOpenNote: () => void;
  onToggleBookmark: () => void;
  onPlayAudio: () => void;
  onOpenImageCard: () => void;
  onCopy: () => void;
  onShare: () => void;
}

export const FloatingVerseDock: React.FC<FloatingVerseDockProps> = ({
  bookName,
  chapterNumber,
  selectedVerses,
  currentHighlight,
  onClearSelection,
  onSetHighlight,
  onOpenNote,
  onToggleBookmark,
  onPlayAudio,
  onOpenImageCard,
  onCopy,
  onShare,
}) => {
  if (selectedVerses.length === 0) return null;

  const colorPalette: Array<{ id: HighlightColor; name: string; bg: string; border: string }> = [
    { id: 'gold', name: 'Mavo', bg: 'rgba(212, 175, 55, 0.5)', border: '#D4AF37' },
    { id: 'emerald', name: 'Maitso', bg: 'rgba(16, 185, 129, 0.45)', border: '#10B981' },
    { id: 'blue', name: 'Manga', bg: 'rgba(59, 130, 246, 0.45)', border: '#3B82F6' },
    { id: 'rose', name: 'Mena', bg: 'rgba(244, 63, 94, 0.45)', border: '#F43F5E' },
    { id: 'purple', name: 'Volomparasy', bg: 'rgba(168, 85, 247, 0.45)', border: '#A855F7' },
  ];

  const firstVerseNum = selectedVerses[0].verseNumber;
  const lastVerseNum = selectedVerses[selectedVerses.length - 1].verseNumber;
  const referenceLabel =
    selectedVerses.length === 1
      ? `${bookName} ${chapterNumber}:${firstVerseNum}`
      : `${bookName} ${chapterNumber}:${firstVerseNum}–${lastVerseNum}`;

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none animate-in slide-in-from-bottom duration-200">
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl p-3 sm:p-4 pointer-events-auto backdrop-blur-md"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
      >
        {/* Top: Reference and Close */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: 'var(--gold)' }}
            >
              {referenceLabel}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--fg-dim)' }}>
              ({selectedVerses.length} voafidy)
            </span>
          </div>

          <button
            onClick={onClearSelection}
            className="p-1 rounded-full hover:bg-[var(--surface2)] opacity-70 hover:opacity-100 transition-colors"
            style={{ color: 'var(--fg-muted)' }}
            title="Ajanony ny safidy"
          >
            <X size={15} />
          </button>
        </div>

        {/* Middle: Color Highlights Palette */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {colorPalette.map((c) => {
              const isSelected = currentHighlight?.color === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSetHighlight(isSelected ? null : c.id)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-offset-2 ring-[var(--gold)] scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: c.bg,
                    borderColor: c.border,
                  }}
                  title={c.name}
                >
                  {isSelected && <Check size={12} className="text-white drop-shadow-sm" />}
                </button>
              );
            })}

            {currentHighlight && (
              <button
                onClick={() => onSetHighlight(null)}
                className="text-[11px] px-2 py-0.5 rounded-md border hover:bg-[var(--surface2)] transition-colors opacity-70 hover:opacity-100 ml-1"
                style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
              >
                Esory
              </button>
            )}
          </div>
        </div>

        {/* Bottom Actions Row (Bible.com icons style) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1">
          <button
            onClick={onOpenImageCard}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Mamorona sary misy andininy"
          >
            <Image size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Sary</span>
          </button>

          <button
            onClick={onOpenNote}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Manorata fanamarihana"
          >
            <FileText size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Fanamarihana</span>
          </button>

          <button
            onClick={onToggleBookmark}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Mari-pamantarana"
          >
            <Bookmark size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Marika</span>
          </button>

          <button
            onClick={onPlayAudio}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Hihaino feo"
          >
            <Volume2 size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Hihaino</span>
          </button>

          <button
            onClick={onCopy}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Adikao"
          >
            <Copy size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Adikao</span>
          </button>

          <button
            onClick={onShare}
            className="flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center gap-1 hover:bg-[var(--surface2)] transition-colors text-center"
            title="Hizara"
          >
            <Share2 size={15} style={{ color: 'var(--gold)' }} />
            <span className="text-[10px]">Hizara</span>
          </button>
        </div>
      </div>
    </div>
  );
};
