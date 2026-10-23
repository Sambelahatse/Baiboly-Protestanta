import React, { useState, useEffect, useRef } from 'react';
import { parseBibleReference } from '../data/bpmData';
import { X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface QuickJumpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJump: (bookNumber: number, chapterNumber: number, verseNumber?: number) => void;
}

export const QuickJumpDialog: React.FC<QuickJumpDialogProps> = ({
  isOpen,
  onClose,
  onJump,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
      setErrorMsg('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const parsed = parseBibleReference(inputVal);
    if (parsed) {
      onJump(parsed.bookNumber, parsed.chapterNumber, parsed.verseNumber);
      onClose();
    } else {
      setErrorMsg('Tsy fantatra io andininy io. Ohatra: Jao 3:16, Sal 23, Rom 8');
    }
  };

  const famousReferences = [
    { label: 'Jaona 3:16', ref: 'Jao 3:16' },
    { label: 'Salamo 23', ref: 'Sal 23' },
    { label: 'Romana 8:28', ref: 'Rom 8:28' },
    { label: '1 Korintiana 13', ref: '1Kor 13' },
    { label: 'Ohabolana 3:5', ref: 'Ohab 3:5' },
    { label: 'Genesisy 1:1', ref: 'Gen 1:1' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: 'var(--gold)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              Fitetezana Haingana (Quick Jump)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100"
            style={{ color: 'var(--fg-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border mb-2"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: errorMsg ? '#F43F5E' : 'var(--border)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Soraty ny boky sy toko (oh: Jao 3:16, Sal 23)..."
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base font-medium"
              style={{ color: 'var(--fg)' }}
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--gold)',
                color: 'var(--bg)',
              }}
              title="Mandehana"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 mb-3 ml-1">{errorMsg}</p>
          )}

          {/* Quick Suggestions */}
          <div className="mt-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--fg-dim)' }}>
              Tolo-kevitra malaza
            </span>
            <div className="flex flex-wrap gap-1.5">
              {famousReferences.map((item) => (
                <button
                  key={item.ref}
                  type="button"
                  onClick={() => {
                    const parsed = parseBibleReference(item.ref);
                    if (parsed) {
                      onJump(parsed.bookNumber, parsed.chapterNumber, parsed.verseNumber);
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 rounded-md border text-xs font-mono transition-all hover:border-[var(--gold)] hover:text-[var(--gold)] flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    color: 'var(--fg-muted)',
                  }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={10} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
