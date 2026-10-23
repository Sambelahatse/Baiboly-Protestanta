import React, { useState, useEffect } from 'react';
import { SearchHit } from '../types/bible';
import { searchBible } from '../services/bibleService';
import { BOOKS_META } from '../data/booksMeta';
import { Search, Loader2, ArrowRight, Filter } from 'lucide-react';

interface FullSearchViewProps {
  onSelectVerse: (bookNumber: number, chapterNumber: number, verseNumber: number) => void;
}

export const FullSearchView: React.FC<FullSearchViewProps> = ({ onSelectVerse }) => {
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<number | 'all'>('all');
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'ot' | 'nt'>('all');
  const [rawResults, setRawResults] = useState<SearchHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setRawResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const hits = await searchBible(trimmed, 200);
        setRawResults(hits);
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Apply local book & testament filters
  const filteredResults = rawResults.filter((hit) => {
    if (selectedTestament === 'ot' && hit.bookNumber > 39) return false;
    if (selectedTestament === 'nt' && hit.bookNumber <= 39) return false;
    if (selectedBook !== 'all' && hit.bookNumber !== selectedBook) return false;
    return true;
  });

  const renderHighlightedSnippet = (text: string, q: string) => {
    if (!q.trim()) return text;
    try {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-amber-400/30 text-inherit px-0.5 rounded-xs font-medium">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 select-none text-center sm:text-left">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--fg-dim)' }}>
            Fikarohana ao amin’ny Baiboly
          </div>
          <h1
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            Fikarohana Andininy
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Mitadiava teny na fehezan-teny amin’ny Testamenta Taloha sy Vaovao
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div
          className="p-4 rounded-xl border mb-8 shadow-xs"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border mb-4"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
            }}
          >
            {isSearching ? (
              <Loader2 size={18} className="animate-spin" style={{ color: 'var(--gold)' }} />
            ) : (
              <Search size={18} style={{ color: 'var(--fg-dim)' }} />
            )}
            <input
              type="text"
              placeholder="Soraty ny teny hokarohina (oh: fahasoavana, fitiavana, vavaka)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base"
              style={{ color: 'var(--fg)' }}
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--fg-dim)' }}>
              <Filter size={13} />
              <span>Sivana:</span>
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-md border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface2)' }}>
              <button
                onClick={() => setSelectedTestament('all')}
                className={`px-2 py-1 rounded-xs transition-colors ${
                  selectedTestament === 'all' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: selectedTestament === 'all' ? 'var(--gold)' : 'transparent',
                  color: selectedTestament === 'all' ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                Rehetra
              </button>
              <button
                onClick={() => setSelectedTestament('ot')}
                className={`px-2 py-1 rounded-xs transition-colors ${
                  selectedTestament === 'ot' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: selectedTestament === 'ot' ? 'var(--gold)' : 'transparent',
                  color: selectedTestament === 'ot' ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                Testamenta Taloha
              </button>
              <button
                onClick={() => setSelectedTestament('nt')}
                className={`px-2 py-1 rounded-xs transition-colors ${
                  selectedTestament === 'nt' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: selectedTestament === 'nt' ? 'var(--gold)' : 'transparent',
                  color: selectedTestament === 'nt' ? 'var(--bg)' : 'var(--fg-muted)',
                }}
              >
                Testamenta Vaovao
              </button>
            </div>

            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="py-1 px-2 rounded-md border outline-none text-xs"
              style={{
                backgroundColor: 'var(--surface2)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }}
            >
              <option value="all">Boky rehetra</option>
              {BOOKS_META.map((b) => (
                <option key={b.book_number} value={b.book_number}>
                  {b.book_number}. {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-3">
          {query.trim().length < 2 ? (
            <div
              className="p-12 text-center rounded-xl border select-none"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--fg-dim)',
              }}
            >
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Soraty eo ambony ny teny hikarohana</p>
              <p className="text-xs mt-1">Hikaroka andininy amin’ny Baiboly Malagasy feno 1865</p>
            </div>
          ) : isSearching && filteredResults.length === 0 ? (
            <div className="p-12 text-center rounded-xl border select-none" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: 'var(--gold)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-dim)' }}>
                Eo am-pikarohana…
              </p>
            </div>
          ) : hasSearched && filteredResults.length === 0 ? (
            <div
              className="p-12 text-center rounded-xl border select-none"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--fg-dim)',
              }}
            >
              <p className="text-base font-semibold" style={{ color: 'var(--fg)' }}>
                Tsy nisy andininy hita
              </p>
              <p className="text-xs mt-1">
                Tsy nahitana vokatra ny teny hoe « {query} »
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs px-1 select-none" style={{ color: 'var(--fg-dim)' }}>
                <span>Andininy hita</span>
                <span className="font-mono font-medium">{filteredResults.length} valiny</span>
              </div>

              <div className="space-y-2.5">
                {filteredResults.map((hit, idx) => (
                  <div
                    key={`${hit.bookNumber}-${hit.chapterNumber}-${hit.verseNumber}-${idx}`}
                    onClick={() => onSelectVerse(hit.bookNumber, hit.chapterNumber, hit.verseNumber)}
                    className="p-4 rounded-xl border transition-all hover:border-[var(--gold)] cursor-pointer group flex items-start justify-between gap-4"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: 'var(--gold)' }}
                        >
                          {hit.bookName} {hit.chapterNumber}:{hit.verseNumber}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-sm border uppercase tracking-wider"
                          style={{
                            backgroundColor: 'var(--surface2)',
                            borderColor: 'var(--border)',
                            color: 'var(--fg-dim)',
                          }}
                        >
                          {hit.bookNumber <= 39 ? 'Taloha' : 'Vaovao'}
                        </span>
                      </div>

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--fg)',
                        }}
                      >
                        {renderHighlightedSnippet(hit.text, query)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs opacity-60 group-hover:opacity-100 group-hover:text-[var(--gold)] transition-all flex-shrink-0 pt-1">
                      <span className="hidden sm:inline">Hamaky</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
