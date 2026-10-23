import React from 'react';
import { FontSizeLevel, AppTheme, AppFontFamily } from '../types/bible';
import { Sun, Moon, BookOpen } from 'lucide-react';

interface DisplaySettingsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: FontSizeLevel;
  theme: AppTheme;
  fontFamily: AppFontFamily;
  onChangeFontSize: (size: FontSizeLevel) => void;
  onChangeTheme: (theme: AppTheme) => void;
  onChangeFontFamily: (font: AppFontFamily) => void;
}

export const DisplaySettingsPopover: React.FC<DisplaySettingsPopoverProps> = ({
  isOpen,
  onClose,
  fontSize,
  theme,
  fontFamily,
  onChangeFontSize,
  onChangeTheme,
  onChangeFontFamily,
}) => {
  if (!isOpen) return null;

  const fontSizes: FontSizeLevel[] = [15, 17, 19, 22];

  const themes: Array<{ id: AppTheme; label: string; icon: React.ReactNode; bg: string; border: string; text: string }> = [
    {
      id: 'light',
      label: 'Mazava',
      icon: <Sun size={14} />,
      bg: '#FFFFFF',
      border: '#E5E7EB',
      text: '#111827',
    },
    {
      id: 'sepia',
      label: 'Sepia',
      icon: <BookOpen size={14} />,
      bg: '#F8F5EE',
      border: '#DDD4BF',
      text: '#2C2621',
    },
    {
      id: 'dark',
      label: 'Maizina',
      icon: <Moon size={14} />,
      bg: '#1A1F26',
      border: '#2D3744',
      text: '#F3F4F6',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover */}
      <div
        className="absolute right-2 sm:right-4 top-14 z-50 w-72 rounded-2xl border shadow-2xl p-4 select-none animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--fg-dim)' }}>
          Fisehoana (Display)
        </div>

        {/* Font Size Tier Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--fg-muted)' }}>
            <span>Habean'ny soratra</span>
            <span className="font-mono">{fontSize}px</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ backgroundColor: 'var(--surface2)' }}>
            {fontSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => onChangeFontSize(sz)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  fontSize === sz ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: fontSize === sz ? 'var(--bg)' : 'transparent',
                  color: fontSize === sz ? 'var(--gold)' : 'var(--fg)',
                }}
              >
                {sz === 15 ? 'A⁻' : sz === 17 ? 'A' : sz === 19 ? 'A⁺' : 'A⁺⁺'}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family Toggle */}
        <div className="mb-4">
          <div className="text-xs mb-1.5" style={{ color: 'var(--fg-muted)' }}>
            Karazana soratra
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl" style={{ backgroundColor: 'var(--surface2)' }}>
            <button
              onClick={() => onChangeFontFamily('serif')}
              className={`py-1.5 px-3 rounded-lg text-xs font-serif transition-all ${
                fontFamily === 'serif' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: fontFamily === 'serif' ? 'var(--bg)' : 'transparent',
                color: fontFamily === 'serif' ? 'var(--gold)' : 'var(--fg)',
              }}
            >
              Serif (Klasika)
            </button>
            <button
              onClick={() => onChangeFontFamily('sans')}
              className={`py-1.5 px-3 rounded-lg text-xs font-sans transition-all ${
                fontFamily === 'sans' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: fontFamily === 'sans' ? 'var(--bg)' : 'transparent',
                color: fontFamily === 'sans' ? 'var(--gold)' : 'var(--fg)',
              }}
            >
              Sans (Maoderina)
            </button>
          </div>
        </div>

        {/* Theme Palette */}
        <div>
          <div className="text-xs mb-1.5" style={{ color: 'var(--fg-muted)' }}>
            Loko fototra
          </div>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeTheme(t.id)}
                  className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected ? 'ring-2 ring-[var(--gold)] scale-102' : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: t.bg,
                    borderColor: isSelected ? 'var(--gold)' : t.border,
                    color: t.text,
                  }}
                >
                  {t.icon}
                  <span className="text-[11px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
