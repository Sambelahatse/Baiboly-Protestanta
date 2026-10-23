import React from 'react';
import { ActiveTab, AppTheme, AppFontFamily, FontSizeLevel } from '../types/bible';
import {
  Search,
  BookOpen,
  Library,
  Bookmark,
  Calendar,
  Sparkles,
  Type,
} from 'lucide-react';

interface TopbarProps {
  activeView: ActiveTab;
  fontSize: FontSizeLevel;
  theme: AppTheme;
  fontFamily: AppFontFamily;
  onToggleSearch: () => void;
  onToggleQuickJump: () => void;
  onToggleDisplayPopover: () => void;
  onSetView: (view: ActiveTab) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeView,
  onToggleSearch,
  onToggleQuickJump,
  onToggleDisplayPopover,
  onSetView,
}) => {
  const navTabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'reader', label: 'Hamaky', icon: <BookOpen size={14} /> },
    { id: 'books', label: 'Boky', icon: <Library size={14} /> },
    { id: 'plan', label: 'Perikopa', icon: <Calendar size={14} /> },
    { id: 'study', label: 'Fianarana', icon: <Bookmark size={14} /> },
  ];

  return (
    <header
      className="h-[56px] sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 border-b select-none flex-shrink-0 transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--fg)',
      }}
    >
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSetView('reader')}
          className="flex items-center gap-2 group text-left"
        >
          {/* Bible.com icon mark */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
            }}
          >
            B
          </div>
          <div>
            <span
              className="text-lg sm:text-xl font-bold tracking-tight block leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
            >
              Baiboly
            </span>
          </div>
        </button>
      </div>

      {/* Center Navigation Links (Bible.com clean style) */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {navTabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSetView(tab.id)}
              className={`px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'font-semibold shadow-xs'
                  : 'hover:bg-[var(--surface2)] opacity-75 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--surface2)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--fg)',
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Quick Jump, Search, Display Settings (Aa) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onToggleQuickJump}
          title="Fitetezana haingana (oh: Jao 3:16)"
          className="h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1.5 border transition-all hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--gold)',
          }}
        >
          <Sparkles size={13} />
          <span className="text-xs hidden md:inline font-medium">Tsambikina</span>
        </button>

        <button
          onClick={onToggleSearch}
          title="Fikarohana (Ctrl+K)"
          className="h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1.5 border transition-all hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }}
        >
          <Search size={14} />
          <span className="text-xs hidden lg:inline">Karohy...</span>
        </button>

        {/* Display Settings Button (Bible.com Aa button) */}
        <button
          onClick={onToggleDisplayPopover}
          title="Fisehoana sy Habean'ny soratra (Display settings)"
          className="h-8 px-2.5 rounded-lg flex items-center gap-1 border transition-all hover:border-[var(--gold)]"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--fg)',
          }}
        >
          <Type size={14} style={{ color: 'var(--gold)' }} />
          <span className="text-xs font-semibold">Aa</span>
        </button>
      </div>
    </header>
  );
};
