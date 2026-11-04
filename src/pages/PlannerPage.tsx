import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Sparkles, 
  Clock, 
  Zap, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ComebackGoal, ChecklistTask } from '../types';
import { soundManager } from '../utils/audio';

interface PlannerPageProps {
  goals: ComebackGoal[];
  onUpdateGoals: (goals: ComebackGoal[]) => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ goals, onUpdateGoals }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || 'goal-1');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newChallengeType, setNewChallengeType] = useState('Recovering from poor test scores');
  const [newTargetDate, setNewTargetDate] = useState('Nov 25, 2026');
  const [newEmotionalFocus, setNewEmotionalFocus] = useState('');

  // New task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'grounding' | 'study' | 'selfcare' | 'winddown'>('study');
  const [newTaskEnergy, setNewTaskEnergy] = useState<'low' | 'medium' | 'high'>('low');
  const [newTaskMinutes, setNewTaskMinutes] = useState(15);

  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const handleToggleTask = (taskId: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === activeGoal.id) {
        const updatedTasks = g.tasks.map((t) => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) soundManager.playSoftCompletion();
            return { ...t, completed: nextCompleted };
          }
          return t;
        });

        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);

        return {
          ...g,
          progressPercent: progress,
          tasks: updatedTasks,
        };
      }
      return g;
    });

    onUpdateGoals(updatedGoals);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playWarmChime(528);

    const created: ComebackGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      challengeType: newChallengeType,
      targetDate: newTargetDate,
      progressPercent: 0,
      emotionalFocus: newEmotionalFocus.trim() || 'One small micro-habit each day with kindness',
      tasks: [
        {
          id: `t-${Date.now()}-1`,
          title: '3-minute calming breath before starting study notes',
          category: 'grounding',
          energyLevel: 'low',
          completed: false,
          estimatedMinutes: 3,
        },
        {
          id: `t-${Date.now()}-2`,
          title: 'Review first core concept for 20 minutes',
          category: 'study',
          energyLevel: 'medium',
          completed: false,
          estimatedMinutes: 20,
        },
        {
          id: `t-${Date.now()}-3`,
          title: 'Hydrate and stretch away from your desk',
          category: 'selfcare',
          energyLevel: 'low',
          completed: false,
          estimatedMinutes: 5,
        },
      ],
    };

    onUpdateGoals([created, ...goals]);
    setSelectedGoalId(created.id);
    setIsCreatingGoal(false);
    setNewTitle('');
    setNewEmotionalFocus('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    soundManager.playWarmChime(440);

    const task: ChecklistTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      energyLevel: newTaskEnergy,
      completed: false,
      estimatedMinutes: newTaskMinutes,
    };

    const updatedGoals = goals.map((g) => {
      if (g.id === activeGoal.id) {
        const nextTasks = [...g.tasks, task];
        const completed = nextTasks.filter((t) => t.completed).length;
        return {
          ...g,
          progressPercent: Math.round((completed / nextTasks.length) * 100),
          tasks: nextTasks,
        };
      }
      return g;
    });

    onUpdateGoals(updatedGoals);
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  const filteredTasks = activeGoal?.tasks.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  }) || [];

  const completedCount = activeGoal?.tasks.filter((t) => t.completed).length || 0;
  const totalCount = activeGoal?.tasks.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header and Challenge Strategy Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
            <Target className="w-4 h-4" />
            <span>Academic & Emotional Comeback Planner</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
            Turn setbacks into steady steps forward.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
            Rebounding isn’t about 14-hour marathon cramming. It’s about emotional de-escalation, lowering the barrier to entry, and scoring quick wins.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingGoal(true)}
          className="px-5 py-2.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Comeback Goal</span>
        </button>
      </div>

      {/* Goal creation modal */}
      {isCreatingGoal && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#DCD0FF] dark:border-[#383053] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-[#292638] dark:text-white">
              Create a Gentle Comeback Goal
            </h3>
            <button
              onClick={() => setIsCreatingGoal(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Goal Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Physics Midterm Rebound or Thesis Reset"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Challenge Situation
              </label>
              <select
                value={newChallengeType}
                onChange={(e) => setNewChallengeType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white"
              >
                <option value="Recovering from poor test scores">Recovering from poor test scores</option>
                <option value="Overcoming lecture anxiety & missed classes">Overcoming lecture anxiety & missed classes</option>
                <option value="Escaping severe procrastination freeze">Escaping severe procrastination freeze</option>
                <option value="Post-burnout gentle stamina rebuild">Post-burnout gentle stamina rebuild</option>
                <option value="Finals week calm survival">Finals week calm survival</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Target Milestone Date
              </label>
              <input
                type="text"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                placeholder="e.g. Dec 5, 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                Emotional Focus / Kindness Mantra
              </label>
              <input
                type="text"
                value={newEmotionalFocus}
                onChange={(e) => setNewEmotionalFocus(e.target.value)}
                placeholder="e.g. No all-nighters. Progress over perfection."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold shadow-md hover:opacity-90"
              >
                Save Comeback Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goal Selector Ribbon */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {goals.map((g) => {
          const isSelected = g.id === activeGoal?.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGoalId(g.id);
                soundManager.playWarmChime(440);
              }}
              className={`p-4 rounded-2xl border transition-all text-left shrink-0 min-w-[260px] cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#EDE7FF] to-white dark:from-[#2B2344] dark:to-[#1E1A2C] border-[#7C3AED] shadow-sm'
                  : 'bg-white dark:bg-[#201C31] border-[#EDE7FF] dark:border-[#332A4C] hover:border-[#DCD0FF]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#7C3AED] dark:text-[#C4B5FD] uppercase tracking-wider">
                  Goal Roadmap
                </span>
                <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  {g.progressPercent}%
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#292638] dark:text-white line-clamp-1 font-display">
                {g.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                {g.challengeType}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Goal Overview Card */}
      {activeGoal && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EDE7FF] dark:border-[#2C2640]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-[#7C3AED] dark:text-[#C4B5FD]">{activeGoal.challengeType}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  Target: {activeGoal.targetDate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#292638] dark:text-white">
                {activeGoal.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span>Emotional Focus: "{activeGoal.emotionalFocus}"</span>
              </p>
            </div>

            {/* Visual Meter */}
            <div className="flex items-center gap-4 bg-[#FFF9F1] dark:bg-[#252037] p-4 rounded-2xl border border-[#EDE7FF] dark:border-[#383052] shrink-0">
              <div className="w-16 h-16 rounded-full border-4 border-[#DCD0FF] dark:border-[#4B406A] flex items-center justify-center font-mono font-bold text-base text-[#7C3AED] dark:text-[#C4B5FD]">
                {activeGoal.progressPercent}%
              </div>
              <div>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">
                  Tasks Finished
                </span>
                <span className="text-base font-bold font-display text-[#292638] dark:text-white">
                  {completedCount} of {totalCount} completed
                </span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeGoal.progressPercent >= 50
                    ? '🎉 Incredible progress! Momentum is building.'
                    : '🌱 Just one micro-task unlocks the comeback.'}
                </p>
              </div>
            </div>
          </div>

          {/* Filter tabs & Add Task Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-[#FFF9F1] dark:bg-[#272138] rounded-xl border border-[#EDE7FF] dark:border-[#382F50] overflow-x-auto">
              {['all', 'grounding', 'study', 'selfcare', 'winddown'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-white dark:bg-[#1C182B] text-[#7C3AED] dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {cat === 'all' ? 'All Tasks' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 rounded-xl bg-[#EDE7FF] dark:bg-[#342C4E] text-[#7C3AED] dark:text-[#DDD6FE] text-xs font-bold hover:bg-[#DCD0FF] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Task</span>
            </button>
          </div>

          {/* Add task inline modal */}
          {isAddingTask && (
            <form
              onSubmit={handleAddTask}
              className="p-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#252038] border border-[#DCD0FF] dark:border-[#382F52] space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                New Actionable Task
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Read 2 summary pages)"
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-white dark:bg-[#1E1A2C] text-xs text-[#292638] dark:text-white"
                />
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-[#EDE7FF] dark:border-[#383151] bg-white dark:bg-[#1E1A2C] text-xs text-[#292638] dark:text-white"
                >
                  <option value="study">Study Sprint</option>
                  <option value="grounding">Grounding / Breath</option>
                  <option value="selfcare">Self-Care / Water</option>
                  <option value="winddown">Evening Wind-Down</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neutral-500">Est. Time:</span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-[#EDE7FF] dark:border-[#383151] bg-white dark:bg-[#1E1A2C] text-xs text-center font-mono"
                  />
                  <span className="text-neutral-500">minutes</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Interactive Checklist Cards */}
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-start sm:items-center justify-between gap-4 cursor-pointer ${
                    task.completed
                      ? 'bg-neutral-50/70 dark:bg-[#1D192B]/70 border-neutral-200/50 dark:border-neutral-800/50 opacity-60'
                      : 'bg-white dark:bg-[#241F37] border-[#EDE7FF] dark:border-[#362E4E] hover:border-[#DCD0FF] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <button
                      className="mt-0.5 sm:mt-0 text-neutral-400 hover:text-[#7C3AED] transition-colors shrink-0"
                      aria-label="Toggle task"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-[#292638] dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-neutral-400">
                        <span className="capitalize">{task.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            task.energyLevel === 'low'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : task.energyLevel === 'medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                          }`}
                        >
                          {task.energyLevel.toUpperCase()} ENERGY
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-neutral-400 shrink-0 hidden sm:inline">
                    {task.completed ? 'Finished' : 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400">
                No tasks under the "{filterCategory}" filter. Select "All Tasks" or add a new one.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
