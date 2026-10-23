import React, { useState } from 'react';
import { HighlightItem, UserNote, UserBookmark, HistoryItem, HighlightColor } from '../types/bible';
import { Bookmark, FileText, Highlighter, History, Trash2, ArrowRight, Download, Filter } from 'lucide-react';

interface StudyDrawerViewProps {
  highlights: Record<string, HighlightItem>;
  notes: Record<string, UserNote>;
  bookmarks: UserBookmark[];
  history: HistoryItem[];
  onSelectVerse: (bookNumber: number, chapterNumber: number, verseNumber?: number) => void;
  onRemoveHighlight: (verseKey: string) => void;
  onRemoveNote: (id: string) => void;
  onRemoveBookmark: (id: string) => void;
  onClearHistory: () => void;
}

export const StudyDrawerView: React.FC<StudyDrawerViewProps> = ({
  highlights,
  notes,
  bookmarks,
  history,
  onSelectVerse,
  onRemoveHighlight,
  onRemoveNote,
  onRemoveBookmark,
  onClearHistory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'highlights' | 'notes' | 'bookmarks' | 'history'>('highlights');
  const [selectedColor, setSelectedColor] = useState<HighlightColor | 'all'>('all');

  const highlightList = Object.values(highlights).sort((a, b) => b.timestamp - a.timestamp);
  const noteList = Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);

  const filteredHighlights = highlightList.filter((h) => {
    if (selectedColor === 'all') return true;
    return h.color === selectedColor;
  });

  const colorMap: Record<HighlightColor, { label: string; bg: string; text: string; border: string }> = {
    gold: { label: 'Mavo', bg: 'rgba(201,168,76,0.2)', text: '#C9A84C', border: '#C9A84C' },
    emerald: { label: 'Maitso', bg: 'rgba(16,185,129,0.2)', text: '#10B981', border: '#10B981' },
    blue: { label: 'Manga', bg: 'rgba(59,130,246,0.2)', text: '#3B82F6', border: '#3B82F6' },
    rose: { label: 'Mena', bg: 'rgba(244,63,94,0.2)', text: '#F43F5E', border: '#F43F5E' },
    purple: { label: 'Volomparasy', bg: 'rgba(168,85,247,0.2)', text: '#A855F7', border: '#A855F7' },
  };

  const handleExportNotes = () => {
    if (noteList.length === 0) return;
    const content = noteList
      .map(
        (n) =>
          `### ${n.bookName} ${n.chapterNumber}:${n.verseNumber}\n*« ${n.verseText} »*\n\n**Fanamarihana:**\n${n.content}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Baiboly_Fanamarihana_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[880px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 select-none">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--fg-dim)' }}>
              Fianarana Manokana
            </div>
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
            >
              Fianarana Baiboly
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
              Ireo andininy voamarika, fanamarihana nosoratanao, ary mari-pamantarana
            </p>
          </div>

          {noteList.length > 0 && activeSubTab === 'notes' && (
            <button
              onClick={handleExportNotes}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 hover:border-[var(--gold)] transition-colors self-start sm:self-auto"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            >
              <Download size={14} style={{ color: 'var(--gold)' }} />
              <span>Avoahy ho rakitra (.md)</span>
            </button>
          )}
        </div>

        {/* Sub-tabs Navigation */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border mb-6 select-none flex-wrap"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={() => setActiveSubTab('highlights')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'highlights' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeSubTab === 'highlights' ? 'var(--gold)' : 'transparent',
              color: activeSubTab === 'highlights' ? 'var(--bg)' : 'var(--fg-muted)',
            }}
          >
            <Highlighter size={14} />
            <span>Voamarika ({highlightList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notes')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'notes' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeSubTab === 'notes' ? 'var(--gold)' : 'transparent',
              color: activeSubTab === 'notes' ? 'var(--bg)' : 'var(--fg-muted)',
            }}
          >
            <FileText size={14} />
            <span>Fanamarihana ({noteList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'bookmarks' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeSubTab === 'bookmarks' ? 'var(--gold)' : 'transparent',
              color: activeSubTab === 'bookmarks' ? 'var(--bg)' : 'var(--fg-muted)',
            }}
          >
            <Bookmark size={14} />
            <span>Mari-pamantarana ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'history' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeSubTab === 'history' ? 'var(--gold)' : 'transparent',
              color: activeSubTab === 'history' ? 'var(--bg)' : 'var(--fg-muted)',
            }}
          >
            <History size={14} />
            <span>Tantara</span>
          </button>
        </div>

        {/* Tab 1: Highlights */}
        {activeSubTab === 'highlights' && (
          <div>
            {/* Color Filter */}
            {highlightList.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-xs flex-wrap select-none">
                <span className="flex items-center gap-1" style={{ color: 'var(--fg-dim)' }}>
                  <Filter size={12} />
                  Loko:
                </span>
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors ${
                    selectedColor === 'all' ? 'font-semibold' : 'opacity-70'
                  }`}
                  style={{
                    backgroundColor: selectedColor === 'all' ? 'var(--surface2)' : 'transparent',
                    borderColor: selectedColor === 'all' ? 'var(--gold)' : 'var(--border)',
                    color: 'var(--fg)',
                  }}
                >
                  Rehetra ({highlightList.length})
                </button>
                {(Object.keys(colorMap) as HighlightColor[]).map((c) => {
                  const count = highlightList.filter((h) => h.color === c).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors flex items-center gap-1.5 ${
                        selectedColor === c ? 'font-semibold' : 'opacity-70'
                      }`}
                      style={{
                        backgroundColor: selectedColor === c ? colorMap[c].bg : 'transparent',
                        borderColor: colorMap[c].border,
                        color: colorMap[c].text,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[c].border }} />
                      <span>
                        {colorMap[c].label} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredHighlights.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl border select-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                <Highlighter size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Tsy mbola misy andininy voamarika</p>
                <p className="text-xs mt-1">Tsindrio ny andininy iray rehefa mamaky mba hanamarihana azy amin'ny loko tianao.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHighlights.map((h) => {
                  const cInfo = colorMap[h.color] || colorMap.gold;
                  return (
                    <div
                      key={h.verseKey}
                      onClick={() => onSelectVerse(h.bookNumber, h.chapterNumber, h.verseNumber)}
                      className="p-4 rounded-xl border transition-all hover:border-[var(--gold)] cursor-pointer group flex items-start justify-between gap-4"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderLeftWidth: '4px',
                        borderLeftColor: cInfo.border,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                            {h.bookName} {h.chapterNumber}:{h.verseNumber}
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                            style={{
                              backgroundColor: cInfo.bg,
                              color: cInfo.text,
                            }}
                          >
                            {cInfo.label}
                          </span>
                        </div>
                        <p
                          className="text-xs sm:text-sm leading-relaxed"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--fg)',
                          }}
                        >
                          « {h.text} »
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveHighlight(h.verseKey);
                          }}
                          title="Esory ny fanamarihana"
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                          style={{ color: 'var(--fg-dim)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <ArrowRight size={14} className="opacity-60 group-hover:opacity-100 text-[var(--gold)]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Study Notes */}
        {activeSubTab === 'notes' && (
          <div>
            {noteList.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl border select-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                <FileText size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Tsy mbola misy fanamarihana nosoratana</p>
                <p className="text-xs mt-1">Afaka manoratra hevitra, fampianarana, na vavaka amin'ny andininy tsirairay ianao.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {noteList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onSelectVerse(n.bookNumber, n.chapterNumber, n.verseNumber)}
                    className="p-4 sm:p-5 rounded-xl border transition-all hover:border-[var(--gold)] cursor-pointer group"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                        {n.bookName} {n.chapterNumber}:{n.verseNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: 'var(--fg-dim)' }}>
                          {new Date(n.updatedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveNote(n.id);
                          }}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                          style={{ color: 'var(--fg-dim)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p
                      className="text-xs italic mb-3 opacity-80 border-l-2 pl-2"
                      style={{
                        fontFamily: 'var(--font-body)',
                        borderColor: 'var(--border)',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      « {n.verseText} »
                    </p>

                    <div
                      className="text-xs sm:text-sm p-3 rounded-lg leading-relaxed whitespace-pre-wrap"
                      style={{
                        backgroundColor: 'var(--surface2)',
                        color: 'var(--fg)',
                      }}
                    >
                      {n.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bookmarks */}
        {activeSubTab === 'bookmarks' && (
          <div>
            {bookmarks.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl border select-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                <Bookmark size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Tsy misy mari-pamantarana</p>
                <p className="text-xs mt-1">Mariho ny toko sy andininy tianao hiverenana haingana.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectVerse(b.bookNumber, b.chapterNumber, b.verseNumber)}
                    className="p-4 rounded-xl border transition-all hover:border-[var(--gold)] cursor-pointer group flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>
                        {b.label}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--fg-dim)' }}>
                        {new Date(b.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(b.id);
                        }}
                        className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                        style={{ color: 'var(--fg-dim)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <ArrowRight size={15} style={{ color: 'var(--gold)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: History */}
        {activeSubTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs" style={{ color: 'var(--fg-dim)' }}>
                Toko novakiana farany
              </span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs opacity-70 hover:opacity-100 hover:text-red-400 transition-colors"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  Fafao ny tantara
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl border select-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-dim)',
                }}
              >
                <History size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Tsy misy tantara voarakitra</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={`${h.bookNumber}-${h.chapterNumber}-${i}`}
                    onClick={() => onSelectVerse(h.bookNumber, h.chapterNumber)}
                    className="px-4 py-3 rounded-lg border transition-all hover:bg-[var(--surface2)] cursor-pointer flex items-center justify-between text-xs sm:text-sm"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--fg)',
                    }}
                  >
                    <span className="font-medium">
                      {h.bookName} Toko {h.chapterNumber}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px]" style={{ color: 'var(--fg-dim)' }}>
                        {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                      <ArrowRight size={14} style={{ color: 'var(--gold)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
