import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface VerseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
}

export const VerseShareModal: React.FC<VerseShareModalProps> = ({
  isOpen,
  onClose,
  bookName,
  chapterNumber,
  verseNumber,
  verseText,
}) => {
  const [copied, setCopied] = useState(false);
  const [cardStyle, setCardStyle] = useState<'gold' | 'light' | 'midnight'>('gold');

  if (!isOpen) return null;

  const fullTextToShare = `« ${verseText} »\n\n— ${bookName} ${chapterNumber}:${verseNumber} (Baiboly Protestanta 1865)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTextToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${bookName} ${chapterNumber}:${verseNumber}`,
          text: fullTextToShare,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  const cardThemes = {
    gold: {
      bg: 'linear-gradient(135deg, #1C2430 0%, #0F1722 100%)',
      border: '#D4AF37',
      text: '#EDE8DC',
      quote: '#D4AF37',
      sub: '#9CA3AF',
    },
    light: {
      bg: 'linear-gradient(135deg, #FDFBF7 0%, #F5EFEB 100%)',
      border: '#E2DDD1',
      text: '#1F2937',
      quote: '#B91C1C',
      sub: '#6B7280',
    },
    midnight: {
      bg: 'linear-gradient(135deg, #090B0E 0%, #151922 100%)',
      border: '#374151',
      text: '#F9FAFB',
      quote: '#F59E0B',
      sub: '#9CA3AF',
    },
  };

  const currentTheme = cardThemes[cardStyle];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Share2 size={16} style={{ color: 'var(--gold)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              Sary Misy Andininy (Verse Image)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface2)] opacity-70 hover:opacity-100 transition-colors"
            style={{ color: 'var(--fg-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="px-6 pt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCardStyle('gold')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              cardStyle === 'gold' ? 'border-[var(--gold)] font-semibold' : 'opacity-60'
            }`}
            style={{
              backgroundColor: cardStyle === 'gold' ? 'var(--surface2)' : 'transparent',
              borderColor: cardStyle === 'gold' ? 'var(--gold)' : 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            Volamena (Gold)
          </button>
          <button
            onClick={() => setCardStyle('light')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              cardStyle === 'light' ? 'border-[var(--gold)] font-semibold' : 'opacity-60'
            }`}
            style={{
              backgroundColor: cardStyle === 'light' ? 'var(--surface2)' : 'transparent',
              borderColor: cardStyle === 'light' ? 'var(--gold)' : 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            Mazava (Light)
          </button>
          <button
            onClick={() => setCardStyle('midnight')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              cardStyle === 'midnight' ? 'border-[var(--gold)] font-semibold' : 'opacity-60'
            }`}
            style={{
              backgroundColor: cardStyle === 'midnight' ? 'var(--surface2)' : 'transparent',
              borderColor: cardStyle === 'midnight' ? 'var(--gold)' : 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            Maizina (Midnight)
          </button>
        </div>

        {/* Visual Verse Card (YouVersion Bible image style) */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center">
          <div
            className="w-full p-8 sm:p-10 rounded-2xl border relative shadow-2xl text-center transition-all duration-300"
            style={{
              background: currentTheme.bg,
              borderColor: currentTheme.border,
            }}
          >
            {/* Ornament */}
            <div
              className="text-xs tracking-[0.4em] mb-6 font-serif"
              style={{ color: currentTheme.quote }}
            >
              ✦ ✦ ✦
            </div>

            <p
              className="text-lg sm:text-2xl leading-relaxed italic mb-8 font-serif"
              style={{
                fontFamily: 'var(--font-display)',
                color: currentTheme.text,
              }}
            >
              “{verseText}”
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 opacity-40" style={{ backgroundColor: currentTheme.border }} />
              <span
                className="font-bold text-sm tracking-wide font-sans uppercase"
                style={{ color: currentTheme.quote }}
              >
                {bookName} {chapterNumber}:{verseNumber}
              </span>
              <div className="h-[1px] w-8 opacity-40" style={{ backgroundColor: currentTheme.border }} />
            </div>

            <div
              className="text-[10px] uppercase tracking-widest mt-3 opacity-60 font-sans"
              style={{ color: currentTheme.sub }}
            >
              Baiboly Protestanta Malagasy 1865
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t flex items-center justify-end gap-2.5" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 transition-all hover:border-[var(--gold)]"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-500" />
                <span>Voakapika!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Adikao ny soratra</span>
              </>
            )}
          </button>

          <button
            onClick={handleNativeShare}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
            }}
          >
            <Share2 size={15} />
            <span>Hizara</span>
          </button>
        </div>
      </div>
    </div>
  );
};
