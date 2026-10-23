import React, { useState } from 'react';
import { DAILY_VERSES, READING_PLANS } from '../data/bpmData';
import { Calendar, ArrowRight, Share2, Copy, Check, BookOpen, RefreshCw } from 'lucide-react';

interface ReadingPlanViewProps {
  onSelectPassage: (bookNumber: number, chapterNumber: number, verseNumber?: number) => void;
  onOpenShare: (bookName: string, chapter: number, verse: number, text: string) => void;
}

export const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({
  onSelectPassage,
  onOpenShare,
}) => {
  const [dailyIndex, setDailyIndex] = useState(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return dayOfYear % DAILY_VERSES.length;
  });

  const [copied, setCopied] = useState(false);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('baiboly_completed_days');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const currentDaily = DAILY_VERSES[dailyIndex];

  const handleNextDaily = () => {
    setDailyIndex((prev) => (prev + 1) % DAILY_VERSES.length);
  };

  const handleCopyDaily = () => {
    const text = `« ${currentDaily.text} »\n— ${currentDaily.bookName} ${currentDaily.chapterNumber}:${currentDaily.verseNumber}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDayCompletion = (day: number) => {
    setCompletedDays((prev) => {
      const next = { ...prev, [day]: !prev[day] };
      try {
        localStorage.setItem('baiboly_completed_days', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[880px] mx-auto px-5 sm:px-10 py-10 sm:py-14">
        {/* Page Title */}
        <div className="mb-8 select-none text-center sm:text-left">
          <div
            className="text-xs uppercase font-semibold tracking-[0.2em] mb-1"
            style={{ color: 'var(--primary)' }}
          >
            Andininy anio & Fandaharana
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            Famelombelomana Isan'andro
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Saintsaino ny Tenin'Andriamanitra ary araho ny fandaharam-pamakiana
          </p>
        </div>

        {/* Bible.com Style: Verse of the Day Card */}
        <div
          className="relative rounded-3xl border p-6 sm:p-10 mb-14 shadow-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Subtle warm glow backdrop */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--gold)' }}
          />

          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--gold)' }}
            >
              Andininy ho an’ny Andro
            </span>

            <span className="text-xs" style={{ color: 'var(--fg-dim)' }}>
              {currentDaily.theme}
            </span>
          </div>

          <blockquote
            className="text-xl sm:text-3xl leading-relaxed italic my-6 sm:my-8"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--fg)',
            }}
          >
            “{currentDaily.text}”
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <div
              className="font-bold text-base sm:text-lg tracking-wide"
              style={{ color: 'var(--gold)' }}
            >
              {currentDaily.bookName} {currentDaily.chapterNumber}:{currentDaily.verseNumber}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyDaily}
                className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 hover:border-[var(--gold)] transition-colors"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Voakapika' : 'Adikao'}</span>
              </button>

              <button
                onClick={() =>
                  onOpenShare(
                    currentDaily.bookName,
                    currentDaily.chapterNumber,
                    currentDaily.verseNumber,
                    currentDaily.text
                  )
                }
                className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 hover:border-[var(--gold)] transition-colors"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
              >
                <Share2 size={14} />
                <span>Hizara</span>
              </button>

              <button
                onClick={() =>
                  onSelectPassage(
                    currentDaily.bookNumber,
                    currentDaily.chapterNumber,
                    currentDaily.verseNumber
                  )
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                }}
              >
                <BookOpen size={14} />
                <span>Vakio ny toko</span>
              </button>

              <button
                onClick={handleNextDaily}
                className="p-2 rounded-xl border text-xs opacity-70 hover:opacity-100 transition-opacity ml-auto sm:ml-0"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg)',
                }}
                title="Hampiseho andininy hafa"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bible Plans Section */}
        <section>
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b select-none" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: 'var(--gold)' }} />
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
              >
                Fandaharam-pamakiana Baiboly (Plans)
              </h2>
            </div>
            <span className="text-xs" style={{ color: 'var(--fg-dim)' }}>
              {READING_PLANS.length} andro
            </span>
          </div>

          <div className="space-y-3">
            {READING_PLANS.map((plan) => {
              const isCompleted = !!completedDays[plan.day];
              return (
                <div
                  key={plan.day}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted ? 'opacity-60' : 'hover:border-[var(--gold)]'
                  }`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleDayCompletion(plan.day)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'hover:border-[var(--gold)]'
                      }`}
                      style={{
                        borderColor: isCompleted ? '#10B981' : 'var(--border)',
                        backgroundColor: isCompleted ? '#10B981' : 'var(--surface2)',
                      }}
                      title={isCompleted ? 'Efa vita' : 'Tsindrio rehefa vita'}
                    >
                      {isCompleted && <Check size={14} />}
                    </button>

                    <div className="min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-semibold leading-snug ${
                          isCompleted ? 'line-through' : ''
                        }`}
                        style={{ color: 'var(--fg)' }}
                      >
                        {plan.title}
                      </h3>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--fg-dim)' }}>
                        {plan.testament}
                      </div>
                    </div>
                  </div>

                  {/* Passage Badges */}
                  <div className="flex items-center gap-2 flex-wrap pl-9 sm:pl-0">
                    {plan.passages.map((p) => (
                      <button
                        key={`${p.bookNumber}-${p.chapterNumber}`}
                        onClick={() => onSelectPassage(p.bookNumber, p.chapterNumber)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all hover:scale-102 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        style={{
                          backgroundColor: 'var(--surface2)',
                          borderColor: 'var(--border)',
                          color: 'var(--fg)',
                        }}
                      >
                        <span>{p.label}</span>
                        <ArrowRight size={12} className="opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
