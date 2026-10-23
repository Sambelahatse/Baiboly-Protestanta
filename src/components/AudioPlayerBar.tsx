import React, { useState, useEffect, useRef } from 'react';
import { VerseItem } from '../types/bible';
import { Play, Pause, SkipForward, SkipBack, X, Headphones, Settings2 } from 'lucide-react';
import { formatMalagasyForSpeech } from '../utils/malagasySpeech';

interface AudioPlayerBarProps {
  bookName: string;
  chapterNumber: number;
  verses: VerseItem[];
  currentVerseIndex: number;
  onVerseChange: (index: number) => void;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  bookName,
  chapterNumber,
  verses,
  currentVerseIndex,
  onVerseChange,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(0.95); // Slightly calmer rate for clear Malagasy cadence
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Load available voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (!synthRef.current) return;
        const voices = synthRef.current.getVoices();
        setAvailableVoices(voices);

        // Prioritize Malagasy voice, then French/African, then default
        const mgVoice = voices.find((v) => v.lang.startsWith('mg') || v.name.toLowerCase().includes('malagasy'));
        const frVoice = voices.find((v) => v.lang.startsWith('fr'));
        const defaultVoice = mgVoice || frVoice || voices[0];

        if (defaultVoice && !selectedVoiceURI) {
          setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      };

      updateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const speakCurrentVerse = (index: number) => {
    if (!synthRef.current || !verses[index]) return;

    synthRef.current.cancel();

    const verse = verses[index];
    // Prepare phonetically optimized Malagasy spoken text
    const textToRead = formatMalagasyForSpeech(verse.text, verse.verseNumber);

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'mg-MG';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (selectedVoiceURI) {
      const matched = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onend = () => {
      if (index < verses.length - 1) {
        onVerseChange(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      speakCurrentVerse(currentVerseIndex);
    }
  }, [currentVerseIndex]);

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      speakCurrentVerse(currentVerseIndex);
    }
  };

  const handleNext = () => {
    if (currentVerseIndex < verses.length - 1) {
      onVerseChange(currentVerseIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentVerseIndex > 0) {
      onVerseChange(currentVerseIndex - 1);
    }
  };

  const currentVerse = verses[currentVerseIndex] || verses[0];

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex flex-col items-center px-4 select-none pointer-events-none animate-in slide-in-from-bottom duration-200">
      {/* Voice selection mini-drawer */}
      {showVoiceSettings && (
        <div
          className="w-full max-w-xl mb-2 p-3 rounded-2xl border shadow-xl pointer-events-auto backdrop-blur-md"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--fg)',
          }}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
              Safidy feo sy fanononana Malagasy
            </span>
            <button
              onClick={() => setShowVoiceSettings(false)}
              className="p-1 rounded opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] block mb-1 opacity-75">Feo (Voice):</label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => {
                  setSelectedVoiceURI(e.target.value);
                  if (isPlaying) {
                    setTimeout(() => speakCurrentVerse(currentVerseIndex), 50);
                  }
                }}
                className="w-full text-xs py-1.5 px-2.5 rounded-lg border outline-none"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[10px] italic leading-tight" style={{ color: 'var(--fg-dim)' }}>
              Fanamarihana: Namboarina manokana ny fanononana malagasy (« Andininy voalohany », « amin ny », « tamin ny »).
            </p>
          </div>
        </div>
      )}

      {/* Main Floating Audio Player */}
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl p-3 sm:p-4 pointer-events-auto backdrop-blur-md flex items-center justify-between gap-3 sm:gap-5"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
      >
        {/* Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
          >
            <Headphones size={18} className={isPlaying ? 'animate-pulse' : ''} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate flex items-center gap-1.5" style={{ color: 'var(--gold)' }}>
              <span>
                {bookName} {chapterNumber}:{currentVerse?.verseNumber}
              </span>
              <span className="text-[10px] font-normal px-1 rounded border opacity-75" style={{ borderColor: 'var(--border)' }}>
                Malagasy
              </span>
            </div>
            <div className="text-[11px] truncate opacity-70" style={{ color: 'var(--fg-muted)' }}>
              {currentVerse?.text}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentVerseIndex <= 0}
            className="p-1.5 rounded-full hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"
            style={{ color: 'var(--fg)' }}
            title="Andininy teo aloha"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
            }}
            title={isPlaying ? 'Atsaharo' : 'Alefaso ny famakiana malagasy'}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            disabled={currentVerseIndex >= verses.length - 1}
            className="p-1.5 rounded-full hover:bg-[var(--surface2)] disabled:opacity-30 transition-colors"
            style={{ color: 'var(--fg)' }}
            title="Andininy manaraka"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed, Voice Settings & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="text-[11px] font-mono py-1 px-1.5 rounded-lg border outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: 'var(--fg)',
            }}
            title="Hafainganam-piteny"
          >
            <option value="0.75">0.75x</option>
            <option value="0.95">1.0x</option>
            <option value="1.15">1.2x</option>
          </select>

          <button
            onClick={() => setShowVoiceSettings((prev) => !prev)}
            className="p-1.5 rounded-lg border hover:border-[var(--gold)] transition-colors opacity-80 hover:opacity-100"
            style={{
              backgroundColor: 'var(--surface2)',
              borderColor: 'var(--border)',
              color: showVoiceSettings ? 'var(--gold)' : 'var(--fg)',
            }}
            title="Fikirakirana ny feo"
          >
            <Settings2 size={15} />
          </button>

          <button
            onClick={() => {
              synthRef.current?.cancel();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[var(--surface2)] opacity-70 hover:opacity-100 transition-colors"
            style={{ color: 'var(--fg-muted)' }}
            title="Hakatona"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
