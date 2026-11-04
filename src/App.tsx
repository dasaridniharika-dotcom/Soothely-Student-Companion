/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationPage, 
  MoodType, 
  MoodEntry, 
  ChatSession, 
  ComebackGoal, 
  SubjectRecovery, 
  StudentProfile, 
  ChecklistTask 
} from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_MOOD_ENTRIES, 
  INITIAL_CHAT_SESSIONS, 
  INITIAL_COMEBACK_GOALS, 
  INITIAL_SUBJECTS 
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CrisisModal } from './components/CrisisModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CompanionPage } from './pages/CompanionPage';
import { PlannerPage } from './pages/PlannerPage';
import { JournalPage } from './pages/JournalPage';
import { StudyRecoveryPage } from './pages/StudyRecoveryPage';
import { MotivationPage } from './pages/MotivationPage';
import { ProfilePage } from './pages/ProfilePage';
import { MusicStudioPage } from './pages/MusicStudioPage';
import { SoothelyGame } from './game/SoothelyGame';

export default function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavigationPage>('landing');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  // Persistent user state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('soothely_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [activeMood, setActiveMood] = useState<MoodType | null>(() => {
    try {
      const saved = localStorage.getItem('soothely_today_mood');
      return (saved as MoodType) || 'content';
    } catch {
      return 'content';
    }
  });

  const [journalEntries, setJournalEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem('soothely_journal_entries');
      return saved ? JSON.parse(saved) : INITIAL_MOOD_ENTRIES;
    } catch {
      return INITIAL_MOOD_ENTRIES;
    }
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('soothely_chat_sessions');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_SESSIONS;
    } catch {
      return INITIAL_CHAT_SESSIONS;
    }
  });

  const [goals, setGoals] = useState<ComebackGoal[]>(() => {
    try {
      const saved = localStorage.getItem('soothely_goals');
      return saved ? JSON.parse(saved) : INITIAL_COMEBACK_GOALS;
    } catch {
      return INITIAL_COMEBACK_GOALS;
    }
  });

  const [subjects, setSubjects] = useState<SubjectRecovery[]>(() => {
    try {
      const saved = localStorage.getItem('soothely_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('soothely_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (activeMood) {
      localStorage.setItem('soothely_today_mood', activeMood);
    }
  }, [activeMood]);

  useEffect(() => {
    localStorage.setItem('soothely_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('soothely_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('soothely_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('soothely_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Synchronize dark theme class
  useEffect(() => {
    if (profile.themePreference === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.themePreference]);

  // Handlers
  const handleSelectMood = (mood: MoodType) => {
    setActiveMood(mood);
    // Also create a quick journal log
    const now = new Date();
    const quickEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood,
      intensity: 6,
      tags: ['Dashboard Check-In'],
      note: `Quick mood pulse logged as ${mood}.`,
    };
    setJournalEntries([quickEntry, ...journalEntries]);
  };

  const handleToggleTaskInGoal = (taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        const hasTask = g.tasks.some((t) => t.id === taskId);
        if (!hasTask) return g;

        const updatedTasks = g.tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, completed: !t.completed };
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
      })
    );
  };

  const handleAddJournalEntry = (entry: MoodEntry) => {
    setJournalEntries([entry, ...journalEntries]);
    setActiveMood(entry.mood);
  };

  const handleResetData = () => {
    setProfile(INITIAL_PROFILE);
    setActiveMood('content');
    setJournalEntries(INITIAL_MOOD_ENTRIES);
    setChatSessions(INITIAL_CHAT_SESSIONS);
    setGoals(INITIAL_COMEBACK_GOALS);
    setSubjects(INITIAL_SUBJECTS);
    localStorage.clear();
  };

  // Extract all daily tasks across goals for dashboard
  const allDailyTasks: ChecklistTask[] = goals[0]?.tasks || [];

  // If game mode is active, render full-viewport Game Shell (no navbar or footer)
  if (currentPage === 'game') {
    return (
      <SoothelyGame
        onExit={() => {
          setCurrentPage('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        studentName={profile.name}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F1] dark:bg-[#161422] text-[#292638] dark:text-[#E8E4F8] transition-colors duration-200">
      {/* Top Navbar adhering to the strict 3-zone contract */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        studentName={profile.name}
        streak={profile.dailyStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
            studentName={profile.name}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            profile={profile}
            activeMood={activeMood}
            onSelectMood={handleSelectMood}
            tasks={allDailyTasks}
            onToggleTask={handleToggleTaskInGoal}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentPage === 'companion' && (
          <CompanionPage
            profile={profile}
            sessions={chatSessions}
            onUpdateSessions={setChatSessions}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentPage === 'planner' && (
          <PlannerPage
            goals={goals}
            onUpdateGoals={setGoals}
          />
        )}

        {currentPage === 'journal' && (
          <JournalPage
            entries={journalEntries}
            onAddEntry={handleAddJournalEntry}
          />
        )}

        {currentPage === 'study' && (
          <StudyRecoveryPage
            subjects={subjects}
            onUpdateSubjects={setSubjects}
          />
        )}

        {currentPage === 'motivation' && (
          <MotivationPage />
        )}

        {currentPage === 'music' && (
          <MusicStudioPage />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            profile={profile}
            onUpdateProfile={setProfile}
            journalEntries={journalEntries}
            onResetData={handleResetData}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}
      </main>

      {/* Warm Supportive Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
      />

      {/* Safety & Crisis Helplines Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
