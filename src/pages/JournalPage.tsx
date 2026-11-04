import React, { useState } from 'react';
import { 
  Smile, 
  Plus, 
  Calendar, 
  Tag, 
  Heart, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  BarChart2, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { MoodEntry, MoodType } from '../types';
import { soundManager } from '../utils/audio';

interface JournalPageProps {
  entries: MoodEntry[];
  onAddEntry: (entry: MoodEntry) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ entries, onAddEntry }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('content');
  const [intensity, setIntensity] = useState<number>(7);
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Study', 'Midterms']);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [filterMood, setFilterMood] = useState<string>('all');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const prompts = [
    'What took the most cognitive energy out of you today?',
    'What is one small thing you survived or accomplished today?',
    'What gave your mind even a 30-second pocket of peace?',
    'If you were talking to your best friend feeling this way, what gentle words would you say to them?',
  ];

  const availableTags = [
    'Midterms',
    'Exams',
    'Sleep Deficit',
    'Library',
    'Study Group',
    'Rest',
    'Family',
    'Burnout',
    'Confidence',
    'Procrastination',
  ];

  const moodDetails: Record<MoodType, { emoji: string; label: string; color: string; desc: string }> = {
    radiant: { emoji: '🌟', label: 'Radiant', color: '#8B5CF6', desc: 'Energized, confident, aligned' },
    content: { emoji: '🌸', label: 'Content', color: '#EC4899', desc: 'Peaceful, calm, steady' },
    neutral: { emoji: '☁️', label: 'Neutral', color: '#6B7280', desc: 'Floating, surviving the day' },
    overwhelmed: { emoji: '🌊', label: 'Overwhelmed', color: '#3B82F6', desc: 'Chest tight, brain buzzing' },
    exhausted: { emoji: '🌙', label: 'Exhausted', color: '#4B5563', desc: 'Out of battery, need deep rest' },
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playWarmChime(528);

    const now = new Date();
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      intensity,
      tags: selectedTags,
      note: note.trim() || 'Logged without extra notes.',
      promptQuestion: prompts[activePromptIndex],
    };

    onAddEntry(newEntry);
    setNote('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const filteredEntries = entries.filter((ent) => {
    if (filterMood === 'all') return true;
    return ent.mood === filterMood;
  });

  // Calculate 7-day trend
  const last7Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const moodScoreMap: Record<MoodType, number> = {
    radiant: 5,
    content: 4,
    neutral: 3,
    overwhelmed: 2,
    exhausted: 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
          <Smile className="w-4 h-4" />
          <span>Reflective Mood Journal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
          A judgment-free space to unpack your days.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
          Writing down what feels heavy transfers the weight from your amygdala onto paper. Notice your cycles without shame.
        </p>
      </div>

      {/* Success Notification */}
      {isSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Entry saved to your personal mood journal timeline!</span>
        </div>
      )}

      {/* 2-Column Split: Log Entry vs Weekly Visual Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Log Today's Mood */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white">
              Log Today’s Emotional Pulse
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select what best represents your mental state right now.
            </p>
          </div>

          {/* Emoji Selection Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {(Object.keys(moodDetails) as MoodType[]).map((m) => {
              const item = moodDetails[m];
              const isSelected = selectedMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMood(m);
                    soundManager.playWarmChime(480);
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDE7FF] dark:bg-[#342C4E] border-[#7C3AED] shadow-sm scale-105'
                      : 'border-[#EDE7FF] dark:border-[#322A47] hover:bg-[#FFF9F1] dark:hover:bg-[#262038]'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-[#7C3AED] dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Intensity Slider */}
          <div className="p-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#262038] border border-[#EDE7FF] dark:border-[#382F50] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-neutral-600 dark:text-neutral-300">
                Emotional Intensity:
              </span>
              <span className="text-[#7C3AED] dark:text-[#C4B5FD] font-mono tabular-nums">
                {intensity} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#7C3AED] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Mild whisper</span>
              <span>Moderate</span>
              <span>Intense storm</span>
            </div>
          </div>

          {/* Guided Prompt Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                Guided Reflection Question
              </span>
              <button
                type="button"
                onClick={() => setActivePromptIndex((p) => (p + 1) % prompts.length)}
                className="text-[#7C3AED] hover:underline"
              >
                Change prompt →
              </button>
            </div>
            <p className="text-xs p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 italic">
              "{prompts[activePromptIndex]}"
            </p>
          </div>

          {/* Journal Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">
              Reflections & Unfiltered Thoughts (Optional)
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dump whatever thoughts are lingering in your head right now. No grammar rules, no grading..."
              className="w-full p-3.5 rounded-2xl border border-[#EDE7FF] dark:border-[#382F50] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-[#7C3AED]"
            />
          </div>

          {/* Context Tags */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">
              Context Influences:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDE7FF] dark:bg-[#382F52] border-[#7C3AED] text-[#7C3AED] dark:text-white'
                        : 'border-[#EDE7FF] dark:border-[#332A4A] text-neutral-600 dark:text-neutral-400 hover:bg-[#FFF9F1]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveEntry}
            className="w-full py-3.5 rounded-2xl bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold shadow-md hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Entry to Journal</span>
          </button>
        </div>

        {/* Right Column: Weekly Mood Chart & Insights */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2C2640]">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold font-display text-[#292638] dark:text-white">
                  Weekly Mood Pattern
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">Past 7 Days</span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
              {entries.slice(0, 7).reverse().map((item, idx) => {
                const score = moodScoreMap[item.mood];
                const heightPercent = score * 20;
                return (
                  <div key={item.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-xs transition-transform group-hover:scale-125">
                      {moodDetails[item.mood].emoji}
                    </span>
                    <div className="w-full bg-[#EDE7FF] dark:bg-[#2B2342] rounded-t-xl overflow-hidden h-28 flex items-end">
                      <div
                        className="w-full rounded-t-xl transition-all duration-700"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: moodDetails[item.mood].color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pattern Insight */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F1] dark:bg-[#262038] border border-[#EDE7FF] dark:border-[#382F50] text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
              <span className="font-bold text-[#7C3AED] dark:text-[#C4B5FD] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Soothely Pattern Insight
              </span>
              <p className="leading-relaxed">
                Your highest grounding scores correlate with taking 15-minute screen breaks and logging before 10 PM. Exam days naturally dip, which is biological—not a personal failing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood History Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE7FF] dark:border-[#2C2640]">
          <div>
            <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white">
              Mood History & Past Reflections
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Browse through your saved check-ins and notes.
            </p>
          </div>

          {/* Filter by mood */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#EDE7FF] dark:border-[#382F52] bg-[#FFF9F1] dark:bg-[#252037] text-xs text-[#292638] dark:text-white"
            >
              <option value="all">All Moods</option>
              <option value="radiant">Radiant 🌟</option>
              <option value="content">Content 🌸</option>
              <option value="neutral">Neutral ☁️</option>
              <option value="overwhelmed">Overwhelmed 🌊</option>
              <option value="exhausted">Exhausted 🌙</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEntries.map((ent) => {
            const detail = moodDetails[ent.mood];
            return (
              <div
                key={ent.id}
                className="p-5 rounded-2xl bg-[#FFF9F1]/60 dark:bg-[#241F37] border border-[#EDE7FF] dark:border-[#362D4E] hover:border-[#DCD0FF] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{detail.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#292638] dark:text-white">
                          {detail.label}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          Intensity {ent.intensity}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                        <span>{ent.date}</span>
                        <span>·</span>
                        <span>{ent.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tag strip */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {ent.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E192D] border border-[#EDE7FF] dark:border-[#382F50] text-neutral-600 dark:text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {ent.promptQuestion && (
                  <p className="text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD]">
                    Q: {ent.promptQuestion}
                  </p>
                )}

                <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">
                  {ent.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
