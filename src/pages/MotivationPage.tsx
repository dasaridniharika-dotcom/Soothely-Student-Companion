import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Flame, 
  CheckCircle, 
  Circle, 
  Heart, 
  Share2, 
  Volume2, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { AffirmationCard, DailyChallenge } from '../types';
import { AFFIRMATIONS, DAILY_CHALLENGES } from '../data/initialData';
import { soundManager } from '../utils/audio';

export const MotivationPage: React.FC = () => {
  const [affirmations, setAffirmations] = useState<AffirmationCard[]>(AFFIRMATIONS);
  const [challenges, setChallenges] = useState<DailyChallenge[]>(DAILY_CHALLENGES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    soundManager.playWarmChime(660);
    setAffirmations((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const next = !card.bookmarked;
          showToast(next ? 'Affirmation bookmarked to your heart collection' : 'Bookmark removed');
          return { ...card, bookmarked: next };
        }
        return card;
      })
    );
  };

  const toggleChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const next = !ch.completed;
          if (next) soundManager.playSoftCompletion();
          return { ...ch, completed: next };
        }
        return ch;
      })
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredAffirmations = affirmations.filter((aff) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'bookmarked') return aff.bookmarked;
    return aff.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All Affirmations' },
    { id: 'bookmarked', label: 'Saved ❤️' },
    { id: 'failure', label: 'Overcoming Setbacks' },
    { id: 'burnout', label: 'Rest & Burnout' },
    { id: 'comparison', label: 'Anti-Comparison' },
    { id: 'anxiety', label: 'Calming Dread' },
    { id: 'growth', label: 'Small Momentum' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
          <Sparkles className="w-4 h-4" />
          <span>Daily Student Motivation & Affirmations</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
          Gentle truths when the pressure mounts.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
          Reframe high-stress academic scenarios with cognitive science, self-compassion, and low-friction daily rituals.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-[#EDE7FF] dark:bg-[#342C4E] border border-[#DCD0FF] dark:border-[#463B6A] text-[#5B21B6] dark:text-[#DDD6FE] text-xs font-semibold text-center animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Daily Micro-Habits Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EDE7FF]/60 via-[#FFF9F1] to-[#DCD0FF]/40 dark:from-[#251F3A] dark:via-[#1C182B] dark:to-[#2F254B] border border-[#DCD0FF] dark:border-[#382F52] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-current" />
              <span>Today’s 2-Minute Nervous System Anchors</span>
            </div>
            <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white mt-1">
              Low-energy micro-habits before you open your notes
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#7C3AED] dark:text-[#C4B5FD]">
            {challenges.filter((c) => c.completed).length} of {challenges.length} Done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              onClick={() => toggleChallenge(ch.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                ch.completed
                  ? 'bg-neutral-50/80 dark:bg-[#201B30]/80 border-neutral-200/50 dark:border-neutral-800/50 opacity-60'
                  : 'bg-white dark:bg-[#241F38] border-[#EDE7FF] dark:border-[#3A3254] hover:border-[#7C3AED] hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {ch.duration}
                  </span>
                  {ch.completed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
                <h4
                  className={`text-sm font-bold font-display ${
                    ch.completed ? 'line-through text-neutral-400' : 'text-[#292638] dark:text-white'
                  }`}
                >
                  {ch.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <span className="text-[11px] font-semibold text-[#7C3AED] dark:text-[#C4B5FD] mt-3">
                {ch.completed ? 'Completed ✨' : 'Tap to complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Affirmations Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] border-[#292638] dark:border-[#EDE7FF] shadow-xs'
                : 'bg-white dark:bg-[#201C31] text-neutral-600 dark:text-neutral-300 border-[#EDE7FF] dark:border-[#332A4B] hover:bg-[#FFF9F1]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Affirmations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAffirmations.map((card) => (
          <div
            key={card.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] hover:border-[#DCD0FF] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-mono">
                {card.category}
              </span>
              <button
                onClick={() => toggleBookmark(card.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-[#EDE7FF]/40 transition-colors"
                title={card.bookmarked ? 'Remove bookmark' : 'Save affirmation'}
              >
                {card.bookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-red-500 fill-red-100" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            <p className="text-base sm:text-lg font-medium text-[#292638] dark:text-[#ECE9F8] leading-relaxed italic">
              "{card.text}"
            </p>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>{card.author || 'Soothely AI'}</span>
              <button
                onClick={() => soundManager.playWarmChime(528)}
                className="text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD] flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Mindful Chime</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supportive Closing Note */}
      <div className="p-6 rounded-3xl bg-[#FFF9F1] dark:bg-[#252037] border border-[#EDE7FF] dark:border-[#382F50] text-center max-w-xl mx-auto space-y-2">
        <h4 className="text-sm font-bold font-display text-[#292638] dark:text-white">
          Remember when exams are over:
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The sum of your human dignity does not fluctuate with test curves. You are allowed to be tired. You are allowed to take rest.
        </p>
      </div>
    </div>
  );
};
