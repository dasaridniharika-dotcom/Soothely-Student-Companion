import React from 'react';
import { Sparkles, Heart, Shield, ArrowUpRight } from 'lucide-react';
import { NavigationPage } from '../types';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenCrisis: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCrisis }) => {
  return (
    <footer className="w-full bg-[#EDE7FF]/40 dark:bg-[#151320] border-t border-[#EDE7FF] dark:border-[#2A253D] pt-12 pb-8 text-[#292638] dark:text-neutral-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#DCD0FF]/60 dark:border-[#2C2740]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#DCD0FF] dark:bg-[#393252] flex items-center justify-center text-[#7C3AED] dark:text-[#C4B5FD]">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-[#292638] dark:text-white">
                Soothely AI
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              "Your feelings matter. Your journey continues." An emotional support and personal growth platform engineered to help students decompress, overcome exam panic, and rebuild academic momentum with warmth and kindness.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Student Privacy First · No Clinical Judgments · Local-First Data</span>
            </div>
          </div>

          {/* Quick Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 font-display">
              Sanctuary Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('companion')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  AI Companion Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Comeback Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('journal')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Mood Journal & Charts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Study Recovery & Timer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('music')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Generative Music Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('game')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Soothely Game (Stillness)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('motivation')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Daily Affirmations
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Emergency Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 font-display">
              Support & Safety
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenCrisis}
                  className="text-red-600 dark:text-red-400 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <span>Crisis Helplines (988)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] transition-colors"
                >
                  Preferences & Themes
                </button>
              </li>
              <li className="pt-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 block leading-tight">
                  Late-night studying? Remember: 1 hour of sleep often yields more exam marks than 1 hour of exhausted skimming.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-3">
          <p>© 2026 Soothely AI. Dedicated to students everywhere navigating heavy moments.</p>
          <div className="flex items-center gap-1">
            <span>Built with kindness for learners</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-current ml-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
