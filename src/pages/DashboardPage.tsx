import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircleHeart, 
  Target, 
  Smile, 
  BookOpen, 
  Flame, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ShieldAlert,
  Clock,
  Compass
} from 'lucide-react';
import { NavigationPage, MoodType, ChecklistTask, StudentProfile } from '../types';
import { DAILY_QUOTES } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface DashboardPageProps {
  profile: StudentProfile;
  activeMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  tasks: ChecklistTask[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (page: NavigationPage) => void;
  onOpenCrisis: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  activeMood,
  onSelectMood,
  tasks,
  onToggleTask,
  onNavigate,
  onOpenCrisis,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const mascotAvatar = '/src/assets/images/companion_avatar_mascot_1793784461508.jpg';

  const currentQuote = DAILY_QUOTES[quoteIndex % DAILY_QUOTES.length];

  const shuffleQuote = () => {
    setQuoteIndex((prev) => prev + 1);
    soundManager.playWarmChime(660);
  };

  const toggleSound = () => {
    const playing = soundManager.toggleAmbientSound('calm_drone');
    setIsAudioPlaying(playing);
  };

  const handleMoodClick = (mood: MoodType) => {
    onSelectMood(mood);
    soundManager.playWarmChime(528);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const moodOptions: { type: MoodType; emoji: string; label: string; desc: string }[] = [
    { type: 'radiant', emoji: '🌟', label: 'Radiant', desc: 'Feeling capable & energized' },
    { type: 'content', emoji: '🌸', label: 'Content', desc: 'Grounded & calm' },
    { type: 'neutral', emoji: '☁️', label: 'Okay', desc: 'Floating through the day' },
    { type: 'overwhelmed', emoji: '🌊', label: 'Overwhelmed', desc: 'Chest tight, brain full' },
    { type: 'exhausted', emoji: '🌙', label: 'Exhausted', desc: 'Running on empty reserves' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner: Personalized Greeting & Companion Mascot */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#EDE7FF] via-[#FFF9F1] to-[#DCD0FF]/60 dark:from-[#252038] dark:via-[#1B1829] dark:to-[#2F2648] border border-[#DCD0FF] dark:border-[#3B3354] p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
              <span>{profile.gradeLevel}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {profile.dailyStreak}-day mindful streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white">
              Welcome back, {profile.name} ✨
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl">
              Take a slow, deep breath. Whatever yesterday looked like, you get to start unhurried today.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('companion')}
                className="px-5 py-2.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageCircleHeart className="w-4 h-4" />
                <span>Talk with Companion</span>
              </button>

              <button
                onClick={toggleSound}
                className="px-4 py-2.5 rounded-full bg-white dark:bg-[#2A233F] border border-[#DCD0FF] dark:border-[#42385E] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-[#EDE7FF]/50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#7C3AED] animate-pulse" />
                    <span>Drone Playing</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                    <span>Play Ambient Drone</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mascot Companion Illustration */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-[#2D2742] shadow-xl overflow-hidden bg-[#FFF9F1] p-1">
                <img
                  src={mascotAvatar}
                  alt="Soothely Companion Mascot"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-1 px-3 py-1 rounded-full bg-white dark:bg-[#29223D] border border-[#DCD0FF] dark:border-[#423961] shadow-md flex items-center gap-1.5 text-[11px] font-semibold text-[#7C3AED] dark:text-[#C4B5FD]">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>Listening</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Motivational Quote & Quick Mood Check-in Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quote Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332C4A] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2E2843]">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
              Daily Perspective
            </span>
            <button
              onClick={shuffleQuote}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#7C3AED] dark:hover:text-[#DDD6FE] hover:bg-[#EDE7FF]/40 transition-colors"
              title="New Quote"
              aria-label="Shuffle daily quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-4 space-y-2">
            <p className="text-base sm:text-lg font-medium text-[#292638] dark:text-[#ECE9F8] italic leading-snug">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              — {currentQuote.author}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
            <span>Reflect on this as you study today</span>
            <button
              onClick={() => onNavigate('motivation')}
              className="text-[#7C3AED] dark:text-[#C4B5FD] font-semibold hover:underline"
            >
              More cards →
            </button>
          </div>
        </div>

        {/* Mood Check-In Widget */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332C4A] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2E2843]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
                Immediate Check-In
              </span>
              <h3 className="text-sm font-bold text-[#292638] dark:text-white">
                How does your mind feel right now?
              </h3>
            </div>
            {activeMood && (
              <span className="text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD] bg-[#EDE7FF] dark:bg-[#342D4D] px-2.5 py-0.5 rounded-full">
                Recorded today
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 my-4">
            {moodOptions.map((opt) => {
              const isSelected = activeMood === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => handleMoodClick(opt.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDE7FF] dark:bg-[#352D50] border-[#7C3AED] shadow-sm scale-105'
                      : 'border-[#EDE7FF] dark:border-[#312B47] hover:bg-[#FFF9F1] dark:hover:bg-[#27223B]'
                  }`}
                  title={opt.desc}
                >
                  <span className="text-2xl sm:text-3xl mb-1">{opt.emoji}</span>
                  <span className={`text-[11px] font-semibold truncate ${isSelected ? 'text-[#7C3AED] dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>
              {activeMood
                ? `Current state: ${activeMood.charAt(0).toUpperCase() + activeMood.slice(1)}`
                : 'Click an icon to quickly check in'}
            </span>
            <button
              onClick={() => onNavigate('journal')}
              className="text-[#7C3AED] dark:text-[#C4B5FD] font-semibold hover:underline"
            >
              Open Mood Journal →
            </button>
          </div>
        </div>
      </div>

      {/* Daily Goals & Gentle Pacing Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Checklist & Progress */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332C4A] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE7FF] dark:border-[#2C2642]">
            <div>
              <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white">
                Daily Gentle Checklist
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Paced to prevent overwhelm. Celebrate small, steady accomplishments.
              </p>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">
                  {completedCount} of {tasks.length} tasks
                </span>
                <span className="text-sm font-bold font-mono tabular-nums text-[#7C3AED] dark:text-[#C4B5FD]">
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#EDE7FF] dark:border-[#322A4C] flex items-center justify-center font-mono text-xs font-bold text-[#292638] dark:text-white">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#EDE7FF] dark:bg-[#2B253F] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  onToggleTask(task.id);
                  if (!task.completed) soundManager.playSoftCompletion();
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  task.completed
                    ? 'bg-neutral-50/80 dark:bg-[#1D192B]/80 border-neutral-200/60 dark:border-neutral-800/60 opacity-70'
                    : 'bg-white dark:bg-[#231E37] border-[#EDE7FF] dark:border-[#383151] hover:border-[#DCD0FF]'
                }`}
              >
                <button
                  className="mt-0.5 text-neutral-400 hover:text-[#7C3AED] transition-colors shrink-0"
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : 'text-[#292638] dark:text-[#EAE6F8]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400 font-medium">
                    <span className="capitalize">{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes}m
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{task.energyLevel} Energy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD] hover:underline flex items-center gap-1"
            >
              <span>Manage full Comeback Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-xs text-neutral-400">
              Tip: Click any task to toggle completion
            </span>
          </div>
        </div>

        {/* Right: Quick Tool Launchpad */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-display">
            Sanctuary Shortcuts
          </h3>

          <div
            onClick={() => onNavigate('companion')}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#EDE7FF] to-white dark:from-[#29223F] dark:to-[#1E1A2D] border border-[#DCD0FF] dark:border-[#382F50] hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#342C4E] text-[#7C3AED] dark:text-[#DDD6FE] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                AI Companion Chat
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Talk out exam anxiety or confusion
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate('study')}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF9F1] to-white dark:from-[#282236] dark:to-[#1E1A2A] border border-[#EDE7FF] dark:border-[#372E49] hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#342C47] text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                Study Recovery Pacer
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                25m study + 5m breathing timer
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate('music')}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#EDE7FF]/60 to-white dark:from-[#251F3A] dark:to-[#1B1828] border border-[#EDE7FF] dark:border-[#362E4F] hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#342950] text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                Generative Music Studio
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                AI ambient study soundscapes & beats
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate('game')}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF9F1] to-[#EDE7FF]/50 dark:from-[#221C35] dark:to-[#1B1728] border border-[#DCD0FF] dark:border-[#382F52] hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#322A4E] text-[#7C3AED] dark:text-[#DDD6FE] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-lg">
              🎮
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                Soothely: Journey to Stillness
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                60fps calm platformer & mindful sparks
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={onOpenCrisis}
            className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 hover:bg-red-100/60 transition-colors cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900 dark:text-red-200 font-display">
                Crisis Support Lifeline
              </h4>
              <p className="text-xs text-red-700/80 dark:text-red-300/80">
                Call or text 988 anytime · Free & 24/7
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
