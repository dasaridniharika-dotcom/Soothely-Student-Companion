import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Moon, 
  Sun, 
  Palette, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Volume2, 
  Flame, 
  Check, 
  HeartHandshake
} from 'lucide-react';
import { StudentProfile, MoodEntry } from '../types';
import { soundManager } from '../utils/audio';

interface ProfilePageProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  journalEntries: MoodEntry[];
  onResetData: () => void;
  onOpenCrisis: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  journalEntries,
  onResetData,
  onOpenCrisis,
}) => {
  const [nickname, setNickname] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel);
  const [themePref, setThemePref] = useState<'lavender' | 'warm_cream' | 'dark'>(profile.themePreference);
  const [dailyHours, setDailyHours] = useState(profile.dailyGoalHours);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const avatars = [
    { id: 'sprout', name: 'Pip the Sprout', emoji: '🌱', desc: 'Curious & patient learner' },
    { id: 'cloud', name: 'Kumo the Cloud', emoji: '☁️', desc: 'Soft & forgiving presence' },
    { id: 'owl', name: 'Luna the Owl', emoji: '🦉', desc: 'Calm evening focus' },
    { id: 'cat', name: 'Sol the Cat', emoji: '🐱', desc: 'Cozy & nap-positive' },
    { id: 'turtle', name: 'Zen the Turtle', emoji: '🐢', desc: 'Slow, steady, unhurried' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playWarmChime(528);

    const updated: StudentProfile = {
      ...profile,
      name: nickname.trim() || 'Student',
      gradeLevel,
      themePreference: themePref,
      dailyGoalHours: dailyHours,
    };

    // Toggle dark class on root html if theme is dark
    if (themePref === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    onUpdateProfile(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const handleSelectAvatar = (avatarId: string) => {
    soundManager.playWarmChime(440);
    onUpdateProfile({ ...profile, avatarId });
  };

  const handleExportJournal = () => {
    soundManager.playSoftCompletion();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journalEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `soothely_journal_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
          <User className="w-4 h-4" />
          <span>Student Profile & Settings</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
          Customize your sanctuary.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Configure how Soothely greets you, select your companion spirit, and adjust comfort themes.
        </p>
      </div>

      {isSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile and sanctuary preferences updated!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Student Avatar Selector */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-4">
          <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
            Choose Your Companion Avatar
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A small comforting presence that travels across your sessions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {avatars.map((av) => {
              const isSelected = profile.avatarId === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAvatar(av.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDE7FF] dark:bg-[#342C4E] border-[#7C3AED] shadow-sm scale-105'
                      : 'border-[#EDE7FF] dark:border-[#322A47] hover:bg-[#FFF9F1] dark:hover:bg-[#252036]'
                  }`}
                >
                  <span className="text-3xl mb-1">{av.emoji}</span>
                  <span className="text-xs font-bold text-[#292638] dark:text-white text-center">
                    {av.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-neutral-400 text-center mt-0.5 line-clamp-1">
                    {av.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Identity Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-5">
          <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
            Student Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Your Preferred Name / Nickname
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Maya"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-sm text-[#292638] dark:text-white focus:outline-hidden focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Current Academic Stage
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-sm text-[#292638] dark:text-white focus:outline-hidden focus:border-[#7C3AED]"
              >
                <option value="High School">High School</option>
                <option value="College Freshman">College Freshman</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Graduate Student">Graduate / Professional Student</option>
                <option value="Self-Learner">Self-Directed Learner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme & Atmosphere */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
              Visual Theme & Night Pacing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setThemePref('lavender');
                document.documentElement.classList.remove('dark');
                soundManager.playWarmChime(440);
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                themePref === 'lavender'
                  ? 'border-[#7C3AED] bg-[#EDE7FF] dark:bg-[#342C4E]'
                  : 'border-[#EDE7FF] dark:border-[#322A47] hover:bg-[#FFF9F1]'
              }`}
            >
              <span className="text-xs font-bold text-[#292638] dark:text-white block">
                Soft Lavender
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                Default comforting pastel palette (#EDE7FF & #FFF9F1)
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setThemePref('warm_cream');
                document.documentElement.classList.remove('dark');
                soundManager.playWarmChime(480);
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                themePref === 'warm_cream'
                  ? 'border-[#7C3AED] bg-[#EDE7FF] dark:bg-[#342C4E]'
                  : 'border-[#EDE7FF] dark:border-[#322A47] hover:bg-[#FFF9F1]'
              }`}
            >
              <span className="text-xs font-bold text-[#292638] dark:text-white block">
                Warm Cream
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                Subtle cozy tones with minimal eye strain
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setThemePref('dark');
                document.documentElement.classList.add('dark');
                soundManager.playWarmChime(528);
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                themePref === 'dark'
                  ? 'border-[#7C3AED] bg-[#342C4E] text-white'
                  : 'border-[#EDE7FF] dark:border-[#322A47] hover:bg-[#252037]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold block">Midnight Cozy</span>
                <Moon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Deep charcoal and soft twilight glow for night study
              </span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Privacy, Export, and Data Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
            Data Privacy & Student Sanctuary Promise
          </h3>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Your journal notes, study topics, and companion chats are stored directly in your local browser sandbox. They are never sold to advertisers or broadcast to schools or parents.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJournal}
            className="px-4 py-2 rounded-xl bg-[#EDE7FF] dark:bg-[#342C4E] text-[#5B21B6] dark:text-[#DDD6FE] text-xs font-semibold hover:bg-[#DCD0FF] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Journal ({journalEntries.length} entries)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-center justify-between text-xs">
            <span className="text-red-900 dark:text-red-200">
              Reset all goals, journal entries, and conversations to fresh initial state?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
