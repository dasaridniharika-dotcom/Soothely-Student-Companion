import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { SubjectRecovery, TopicItem } from '../types';
import { soundManager } from '../utils/audio';

interface StudyRecoveryPageProps {
  subjects: SubjectRecovery[];
  onUpdateSubjects: (subjects: SubjectRecovery[]) => void;
}

export const StudyRecoveryPage: React.FC<StudyRecoveryPageProps> = ({
  subjects,
  onUpdateSubjects,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newExamDate, setNewExamDate] = useState('2026-12-10');
  const [newGradeGoal, setNewGradeGoal] = useState('B+');

  // New topic state
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  // Gentle Pacing Study Timer (25 min study / 5 min breathe)
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            soundManager.playWarmChime(528);
            if (timerMode === 'study') {
              setTimerMode('break');
              return 5 * 60;
            } else {
              setTimerMode('study');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  const toggleTimer = () => {
    if (!isTimerRunning) soundManager.playWarmChime(440);
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTopicStatusChange = (topicId: string) => {
    soundManager.playSoftCompletion();
    const updated = subjects.map((sub) => {
      if (sub.id === activeSubject.id) {
        const nextTopics = sub.topics.map((top) => {
          if (top.id === topicId) {
            const nextStatus: TopicItem['status'] =
              top.status === 'needs_review'
                ? 'in_progress'
                : top.status === 'in_progress'
                ? 'mastered'
                : 'needs_review';
            return { ...top, status: nextStatus };
          }
          return top;
        });
        return { ...sub, topics: nextTopics };
      }
      return sub;
    });
    onUpdateSubjects(updated);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    soundManager.playWarmChime(480);

    const newTopic: TopicItem = {
      id: `top-${Date.now()}`,
      name: newTopicName.trim(),
      status: 'needs_review',
    };

    const updated = subjects.map((sub) => {
      if (sub.id === activeSubject.id) {
        return { ...sub, topics: [...sub.topics, newTopic] };
      }
      return sub;
    });

    onUpdateSubjects(updated);
    setNewTopicName('');
    setIsAddingTopic(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    soundManager.playWarmChime(528);

    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];
    const randomColor = colors[subjects.length % colors.length];

    const created: SubjectRecovery = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim() || 'ACAD 101',
      color: randomColor,
      examDate: newExamDate,
      targetScoreGrade: newGradeGoal,
      topics: [
        { id: `t-${Date.now()}-1`, name: 'Core Foundations (Chapter 1)', status: 'in_progress' },
        { id: `t-${Date.now()}-2`, name: 'Midterm Review Problems', status: 'needs_review' },
      ],
    };

    onUpdateSubjects([...subjects, created]);
    setSelectedSubjectId(created.id);
    setIsAddingSubject(false);
    setNewSubjectName('');
    setNewSubjectCode('');
  };

  // Days left calculation
  const getDaysLeft = (examDateStr: string) => {
    const examDate = new Date(examDateStr);
    const today = new Date('2026-11-04');
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Exam season';
  };

  const calculateMastery = (topics: TopicItem[]) => {
    if (topics.length === 0) return 0;
    const masteredCount = topics.filter((t) => t.status === 'mastered').length;
    const inProgressCount = topics.filter((t) => t.status === 'in_progress').length;
    const points = masteredCount * 1.0 + inProgressCount * 0.5;
    return Math.round((points / topics.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
            <BookOpen className="w-4 h-4" />
            <span>Gentle Study Recovery System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
            Reclaim confidence, one topic at a time.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
            Overcoming exam panic starts by segmenting overwhelming syllabi into clear, bite-sized checkpoints.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSubject(true)}
          className="px-5 py-2.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course / Subject</span>
        </button>
      </div>

      {/* Add Subject Modal */}
      {isAddingSubject && (
        <form
          onSubmit={handleAddSubject}
          className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#DCD0FF] dark:border-[#3A3254] shadow-xl space-y-4"
        >
          <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
            Add Subject for Recovery Pacing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Subject Name
              </label>
              <input
                type="text"
                required
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Molecular Biology"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-xs text-[#292638] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="e.g. BIO 201"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-xs text-[#292638] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={newExamDate}
                onChange={(e) => setNewExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-xs text-[#292638] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Kind Target Grade
              </label>
              <input
                type="text"
                value={newGradeGoal}
                onChange={(e) => setNewGradeGoal(e.target.value)}
                placeholder="e.g. Solid Pass (B)"
                className="w-full px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#262038] text-xs text-[#292638] dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingSubject(false)}
              className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold"
            >
              Save Course
            </button>
          </div>
        </form>
      )}

      {/* Subjects Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const isSelected = sub.id === activeSubject?.id;
          const mastery = calculateMastery(sub.topics);
          const daysLeft = getDaysLeft(sub.examDate);

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-5 rounded-3xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#EDE7FF] dark:bg-[#2B2342] border-[#7C3AED] shadow-sm'
                  : 'bg-white dark:bg-[#201C31] border-[#EDE7FF] dark:border-[#342D4B] hover:border-[#DCD0FF]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-semibold text-neutral-500 dark:text-neutral-400">
                    {sub.code}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                    {daysLeft}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-[#292638] dark:text-white line-clamp-1">
                  {sub.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Target: {sub.targetScoreGrade}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-[#DCD0FF]/60 dark:border-[#352D4D]">
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-neutral-500">Recovery Mastery</span>
                  <span className="text-[#7C3AED] dark:text-[#C4B5FD] font-mono tabular-nums">
                    {mastery}%
                  </span>
                </div>
                <div className="w-full bg-white/70 dark:bg-[#1C182A] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${mastery}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split: Active Subject Topics + Built-in Gentle Study Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Topics Management */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE7FF] dark:border-[#2C2640]">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeSubject?.color }}
                />
                <h2 className="text-lg font-bold font-display text-[#292638] dark:text-white">
                  {activeSubject?.name} · Topic Checklist
                </h2>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Click any topic to cycle status: Needs Review → In Progress → Mastered
              </p>
            </div>

            <button
              onClick={() => setIsAddingTopic(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#EDE7FF] dark:bg-[#342C4E] text-[#7C3AED] dark:text-[#DDD6FE] text-xs font-semibold hover:bg-[#DCD0FF] transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
          </div>

          {/* Add topic form */}
          {isAddingTopic && (
            <form
              onSubmit={handleAddTopic}
              className="p-3.5 rounded-2xl bg-[#FFF9F1] dark:bg-[#252037] border border-[#DCD0FF] dark:border-[#382F50] flex items-center gap-2"
            >
              <input
                type="text"
                required
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Topic or chapter name (e.g. Chapter 4 Reactions)"
                className="flex-1 px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-white dark:bg-[#1E1A2C] text-xs text-[#292638] dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold whitespace-nowrap"
              >
                Add Topic
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTopic(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 px-1"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Topics List */}
          <div className="space-y-2.5">
            {activeSubject?.topics.map((top) => {
              const statusBadge =
                top.status === 'mastered'
                  ? {
                      label: 'Mastered ✨',
                      bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
                      icon: CheckCircle2,
                    }
                  : top.status === 'in_progress'
                  ? {
                      label: 'In Progress ⏳',
                      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
                      icon: AlertCircle,
                    }
                  : {
                      label: 'Needs Review 🔍',
                      bg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300',
                      icon: HelpCircle,
                    };

              const Icon = statusBadge.icon;

              return (
                <div
                  key={top.id}
                  onClick={() => handleTopicStatusChange(top.id)}
                  className="p-3.5 rounded-2xl bg-[#FFF9F1]/60 dark:bg-[#241F37] border border-[#EDE7FF] dark:border-[#352D4E] hover:border-[#DCD0FF] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                    <span className="text-sm font-medium text-[#292638] dark:text-white truncate">
                      {top.name}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusBadge.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{statusBadge.label}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-neutral-400 text-center">
            Tip: Pacing yourself with 1 topic per sprint creates lasting neural pathways.
          </div>
        </div>

        {/* Right Column: Built-in Gentle Study Timer */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2C2640]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-sm font-bold font-display text-[#292638] dark:text-white">
                Gentle Pacing Timer
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE7FF] dark:bg-[#332A4E] text-[#7C3AED] dark:text-[#C4B5FD] uppercase">
              {timerMode === 'study' ? '25m Focus Sprint' : '5m Breath & Reset'}
            </span>
          </div>

          {/* Big Timer Display */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-48 h-48 rounded-full border-4 border-[#DCD0FF] dark:border-[#4B3F6E] bg-gradient-to-tr from-[#EDE7FF]/60 to-[#FFF9F1] dark:from-[#29223D] dark:to-[#1C182B] flex flex-col items-center justify-center shadow-inner">
              <span className="text-5xl font-mono font-bold tabular-nums text-[#292638] dark:text-white">
                {formatTimer(timerSecondsLeft)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                {timerMode === 'study' ? 'Deep gentle study' : 'Close eyes, breathe'}
              </span>
            </div>

            {/* Timer Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={toggleTimer}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Sprint</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-full border border-[#EDE7FF] dark:border-[#382F50] text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-[#EDE7FF]/40 transition-colors"
                title="Reset Sprint"
                aria-label="Reset Sprint"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Soothing Advice Callout */}
          <div className="p-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#252037] border border-[#EDE7FF] dark:border-[#382F50] text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
            <span className="font-bold text-[#7C3AED] dark:text-[#C4B5FD] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Cognitive Science Principle
            </span>
            <p className="leading-relaxed">
              When you stop studying 5 minutes BEFORE you collapse from exhaustion, your subconscious remains curious rather than terrified of opening the book again tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
