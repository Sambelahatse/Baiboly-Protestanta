import React, { useState, useEffect, useRef } from 'react';
import { SearchHit } from '../types/bible';
import { searchBible } from '../services/bibleService';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (bookNumber: number, chapterNumber: number, verseNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const hits = await searchBible(trimmed, 80);
        setResults(hits);
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  // Highlight matching terms safely
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {isSearching ? (
            <Loader2 size={18} className="animate-spin" style={{ color: 'var(--gold)' }} />
          ) : (
            <Search size={18} style={{ color: 'var(--fg-dim)' }} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Karohy andininy (oh: fitiavana, famonjena, lanitra)..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base"
            style={{ color: 'var(--fg)' }}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded opacity-60 hover:opacity-100"
              style={{ color: 'var(--fg-muted)' }}
            >
              <X size={16} />
            </button>
          )}

          <kbd
            className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded border font-mono select-none"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--fg-dim)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-xs sm:text-sm select-none" style={{ color: 'var(--fg-dim)' }}>
              Soraty ny teny hikarohana (2 litera farafahakeliny)
            </div>
          ) : isSearching && results.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm select-none" style={{ color: 'var(--fg-dim)' }}>
              Eo am-pikarohana amin’ny Baiboly manontolo…
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm select-none" style={{ color: 'var(--fg-dim)' }}>
              Tsy nisy andininy hita tamin’ny hoe « <strong style={{ color: 'var(--fg)' }}>{query}</strong> »
            </div>
          ) : (
            <>
              <div
                className="px-4 py-2 text-[11px] uppercase tracking-wider font-semibold select-none flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface2)',
                  color: 'var(--fg-dim)',
                }}
              >
                <span>Vokatry ny fikarohana</span>
                <span className="tabular-nums font-mono">{results.length} hita</span>
              </div>

              {results.map((hit, idx) => (
                <button
                  key={`${hit.bookNumber}-${hit.chapterNumber}-${hit.verseNumber}-${idx}`}
                  onClick={() => {
                    onSelectResult(hit.bookNumber, hit.chapterNumber, hit.verseNumber);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 sm:px-4 sm:py-3 hover:bg-[var(--surface2)] transition-colors group flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-semibold mb-1 flex items-center gap-2"
                      style={{ color: 'var(--gold)' }}
                    >
                      <span>
                        {hit.bookName} {hit.chapterNumber}:{hit.verseNumber}
                      </span>
                    </div>
                    <p
                      className="text-xs sm:text-sm line-clamp-2 leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {renderHighlightedSnippet(hit.text, query)}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0"
                    style={{ color: 'var(--gold)' }}
                  />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
