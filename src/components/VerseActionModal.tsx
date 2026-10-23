import React, { useState, useEffect } from 'react';
import { HighlightColor, HighlightItem, UserNote } from '../types/bible';
import { X, Copy, Check, Share2, Volume2, Bookmark, BookmarkCheck, FileText, Trash2 } from 'lucide-react';

interface VerseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  currentHighlight?: HighlightItem;
  currentNote?: UserNote;
  isBookmarked: boolean;
  onSetHighlight: (color: HighlightColor | null) => void;
  onSaveNote: (content: string) => void;
  onDeleteNote: () => void;
  onToggleBookmark: () => void;
  onPlayAudio: () => void;
  onOpenShare: () => void;
}

export const VerseActionModal: React.FC<VerseActionModalProps> = ({
  isOpen,
  onClose,
  bookName,
  chapterNumber,
  verseNumber,
  verseText,
  currentHighlight,
  currentNote,
  isBookmarked,
  onSetHighlight,
  onSaveNote,
  onDeleteNote,
  onToggleBookmark,
  onPlayAudio,
  onOpenShare,
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNoteContent(currentNote?.content || '');
      setIsEditingNote(false);
    }
  }, [isOpen, currentNote]);

  if (!isOpen) return null;

  const colorPalette: Array<{ id: HighlightColor; name: string; bg: string; border: string }> = [
    { id: 'gold', name: 'Mavo', bg: 'rgba(201, 168, 76, 0.4)', border: 'rgb(201, 168, 76)' },
    { id: 'emerald', name: 'Maitso', bg: 'rgba(16, 185, 129, 0.35)', border: 'rgb(16, 185, 129)' },
    { id: 'blue', name: 'Manga', bg: 'rgba(59, 130, 246, 0.35)', border: 'rgb(59, 130, 246)' },
    { id: 'rose', name: 'Mena', bg: 'rgba(244, 63, 94, 0.35)', border: 'rgb(244, 63, 94)' },
    { id: 'purple', name: 'Volomparasy', bg: 'rgba(168, 85, 247, 0.35)', border: 'rgb(168, 85, 247)' },
  ];

  const handleCopy = () => {
    const text = `${bookName} ${chapterNumber}:${verseNumber} - « ${verseText} »`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNoteContent = () => {
    if (noteContent.trim()) {
      onSaveNote(noteContent.trim());
      setIsEditingNote(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--gold)' }}>
              Andininy
            </div>
            <h3
              className="text-lg font-semibold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
            >
              {bookName} {chapterNumber}:{verseNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface2)] opacity-70 hover:opacity-100 transition-colors"
            style={{ color: 'var(--fg-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Verse preview */}
        <div className="p-4 border-b text-xs sm:text-sm leading-relaxed max-h-28 overflow-y-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface2)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg)' }}>
            « {verseText} »
          </p>
        </div>

        {/* Main Actions */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Highlight Color Palette */}
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--fg-dim)' }}>
              Fanamarihana miloko (Highlight)
            </label>
            <div className="flex items-center gap-2.5">
              {colorPalette.map((c) => {
                const isSelected = currentHighlight?.color === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSetHighlight(isSelected ? null : c.id)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-offset-2 ring-[var(--gold)] scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: c.bg,
                      borderColor: c.border,
                    }}
                  >
                    {isSelected && <Check size={14} className="text-white drop-shadow-sm" />}
                  </button>
                );
              })}

              {currentHighlight && (
                <button
                  onClick={() => onSetHighlight(null)}
                  className="px-2 py-1 text-[11px] rounded-md border hover:bg-[var(--surface2)] transition-colors opacity-70 hover:opacity-100 ml-auto"
                  style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
                >
                  Esory
                </button>
              )}
            </div>
          </div>

          {/* Quick Toolbar (Audio, Share, Bookmark, Copy) */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => {
                onClose();
                onPlayAudio();
              }}
              className="p-2.5 rounded-lg border flex flex-col items-center gap-1 hover:border-[var(--gold)] transition-colors text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            >
              <Volume2 size={16} style={{ color: 'var(--gold)' }} />
              <span className="text-[10px]">Hihaino</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenShare();
              }}
              className="p-2.5 rounded-lg border flex flex-col items-center gap-1 hover:border-[var(--gold)] transition-colors text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            >
              <Share2 size={16} style={{ color: 'var(--gold)' }} />
              <span className="text-[10px]">Hizara</span>
            </button>

            <button
              onClick={onToggleBookmark}
              className="p-2.5 rounded-lg border flex flex-col items-center gap-1 hover:border-[var(--gold)] transition-colors text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: isBookmarked ? 'var(--gold)' : 'var(--fg)',
              }}
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} style={{ color: 'var(--gold)' }} />
              ) : (
                <Bookmark size={16} />
              )}
              <span className="text-[10px]">{isBookmarked ? 'Voatahiry' : 'Mari-pamantarana'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-lg border flex flex-col items-center gap-1 hover:border-[var(--gold)] transition-colors text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              <span className="text-[10px]">{copied ? 'Voakapika' : 'Adikao'}</span>
            </button>
          </div>

          {/* Personal Note Section */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: 'var(--fg-dim)' }}>
                <FileText size={13} />
                <span>Fanamarihana manokana (Study Note)</span>
              </label>
              {currentNote && !isEditingNote && (
                <button
                  onClick={onDeleteNote}
                  className="p-1 rounded text-red-400 hover:text-red-500 transition-colors"
                  title="Fafao ny fanamarihana"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            {currentNote && !isEditingNote ? (
              <div
                onClick={() => setIsEditingNote(true)}
                className="p-3 rounded-lg border text-xs leading-relaxed cursor-pointer hover:border-[var(--gold)] transition-colors"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <p className="whitespace-pre-wrap">{currentNote.content}</p>
                <div className="text-[10px] opacity-60 text-right mt-1">Tsindrio raha hanova</div>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Soraty eto ny hevitrao, fampianarana, na vavaka mifandray amin’ity andininy ity..."
                  rows={3}
                  className="w-full p-2.5 rounded-lg border text-xs outline-none focus:border-[var(--gold)] resize-none"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    color: 'var(--fg)',
                  }}
                />
                <div className="flex items-center justify-end gap-2">
                  {isEditingNote && (
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-2.5 py-1 text-xs rounded-md opacity-70 hover:opacity-100"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      Aoka ihany
                    </button>
                  )}
                  <button
                    onClick={handleSaveNoteContent}
                    disabled={!noteContent.trim()}
                    className="px-3 py-1 text-xs rounded-md font-medium disabled:opacity-40 transition-all"
                    style={{
                      backgroundColor: 'var(--gold)',
                      color: 'var(--bg)',
                    }}
                  >
                    Tehirizo ny fanamarihana
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
