import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { NavigationPage } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenCrisis: () => void;
  studentName: string;
  streak: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenCrisis,
  studentName,
  streak,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleSound = () => {
    const playing = soundManager.toggleAmbientSound('calm_drone');
    setIsAudioPlaying(playing);
  };

  const navLinks: { page: NavigationPage; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'companion', label: 'AI Companion' },
    { page: 'planner', label: 'Comeback Planner' },
    { page: 'journal', label: 'Mood Journal' },
    { page: 'study', label: 'Study Recovery' },
    { page: 'music', label: 'Music Studio' },
  ];

  const handleLinkClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF9F1]/90 dark:bg-[#1A1827]/90 backdrop-blur-md border-b border-[#EDE7FF] dark:border-[#2C2740] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element with icon) */}
          <button
            onClick={() => handleLinkClick('landing')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus-visible:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DCD0FF] to-[#EDE7FF] dark:from-[#3B3456] dark:to-[#554C78] flex items-center justify-center text-[#7C3AED] dark:text-[#DDD6FE] shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-current opacity-80" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display tracking-tight text-[#292638] dark:text-[#F3F0FF] whitespace-nowrap">
                Soothely AI
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleLinkClick(item.page)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#7C3AED] dark:hover:text-[#C4B5FD] ${
                    isActive
                      ? 'text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                      : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] dark:bg-[#C4B5FD] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + helper utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Ambient Sound synth toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                isAudioPlaying
                  ? 'bg-[#EDE7FF] dark:bg-[#342D4E] border-[#DCD0FF] text-[#7C3AED] dark:text-[#DDD6FE]'
                  : 'border-[#EDE7FF] dark:border-[#2E2844] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
              title={isAudioPlaying ? 'Mute background drone' : 'Play calming focus sound'}
              aria-label="Ambient sound"
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px] font-medium">
                {isAudioPlaying ? 'Drone On' : 'Calm Sound'}
              </span>
            </button>

            {/* Streak & Student Profile Pill */}
            <button
              onClick={() => handleLinkClick('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
                currentPage === 'profile'
                  ? 'border-[#7C3AED] bg-[#EDE7FF]/60 dark:bg-[#322A4C]'
                  : 'border-[#EDE7FF] dark:border-[#2E2844] hover:bg-[#EDE7FF]/30 dark:hover:bg-[#252037]'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#DCD0FF] dark:bg-[#483F67] flex items-center justify-center text-xs font-bold text-[#5B21B6] dark:text-[#EDE7FF]">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                <span>{studentName}</span>
                <span className="text-amber-500 flex items-center gap-0.5 ml-1 font-mono tabular-nums">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {streak}d
                </span>
              </div>
            </button>

            {/* Play Game Button */}
            <button
              onClick={() => handleLinkClick('game')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-[#EDE7FF] dark:bg-[#322A4E] border border-[#DCD0FF] dark:border-[#433A62] rounded-xl hover:bg-[#DCD0FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Play Soothely: Journey to Stillness"
            >
              <span>🎮 Play Game</span>
            </button>

            {/* Crisis Support Help Button */}
            <button
              onClick={onOpenCrisis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl hover:bg-red-100 transition-colors whitespace-nowrap shrink-0"
              title="Crisis Helplines & Safety Support"
            >
              <HeartHandshake className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Crisis Support</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-[#EDE7FF]/50"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#EDE7FF] dark:border-[#2C2740] space-y-1">
            <button
              onClick={() => handleLinkClick('landing')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === 'landing'
                  ? 'bg-[#EDE7FF] dark:bg-[#342D4E] text-[#7C3AED]'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              Home (Landing)
            </button>
            {navLinks.map((item) => (
              <button
                key={item.page}
                onClick={() => handleLinkClick(item.page)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === item.page
                    ? 'bg-[#EDE7FF] dark:bg-[#342D4E] text-[#7C3AED]'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('profile')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === 'profile'
                  ? 'bg-[#EDE7FF] dark:bg-[#342D4E] text-[#7C3AED]'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              Profile & Settings
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
