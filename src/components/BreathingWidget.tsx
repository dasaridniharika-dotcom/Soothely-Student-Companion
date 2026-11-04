import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BreathingWidgetProps {
  compact?: boolean;
}

type Phase = 'inhale' | 'hold' | 'exhale';

export const BreathingWidget: React.FC<BreathingWidgetProps> = ({ compact = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  const phaseInstructions = {
    inhale: 'Breathe in slowly through your nose...',
    hold: 'Hold gently and soften your shoulders...',
    exhale: 'Release slowly through your mouth...',
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // transition to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              if (soundEnabled) soundManager.playWarmChime(440);
              return phaseDurations.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              if (soundEnabled) soundManager.playWarmChime(392);
              return phaseDurations.exhale;
            } else {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              if (soundEnabled) soundManager.playWarmChime(528);
              return phaseDurations.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, soundEnabled]);

  const toggleActive = () => {
    if (!isActive && soundEnabled) {
      soundManager.playWarmChime(528);
    }
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const circleScale = !isActive
    ? 'scale-100'
    : phase === 'inhale'
    ? 'scale-125'
    : phase === 'hold'
    ? 'scale-125'
    : 'scale-90';

  return (
    <div className={`flex flex-col items-center justify-center ${compact ? 'p-4' : 'p-6 sm:p-8'} bg-[#FFF9F1] dark:bg-[#1E1C2B] rounded-3xl border border-[#EDE7FF] dark:border-[#352F4B] shadow-sm relative overflow-hidden transition-all`}>
      {/* Soft ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#DCD0FF]/30 dark:bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#EDE7FF]/40 dark:bg-[#6D28D9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header info */}
      <div className="flex items-center justify-between w-full mb-4 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 font-display">
            4-7-8 Breathing Reset
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title={soundEnabled ? 'Mute tone' : 'Enable soft chime tone'}
            aria-label="Toggle breathing sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            {cyclesCompleted} {cyclesCompleted === 1 ? 'cycle' : 'cycles'}
          </span>
        </div>
      </div>

      {/* Breathing circle interactive canvas */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Animated outer ring */}
        <div
          className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-[#DCD0FF] dark:border-[#4E4472] bg-gradient-to-tr from-[#EDE7FF]/80 to-[#FFF9F1] dark:from-[#2A2440] dark:to-[#1B1827] flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ease-in-out ${circleScale}`}
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#7C3AED] dark:text-[#C4B5FD]">
            {phase}
          </span>
          <span className="text-4xl font-bold font-mono tabular-nums text-[#292638] dark:text-white mt-1">
            {secondsLeft}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-[120px] text-center leading-tight">
            {phase === 'inhale' ? 'Inhale 4s' : phase === 'hold' ? 'Hold 7s' : 'Exhale 8s'}
          </span>
        </div>
      </div>

      {/* Prompt guidance text */}
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 text-center font-medium my-3 z-10 transition-all h-6">
        {isActive ? phaseInstructions[phase] : 'Press start to ground your nervous system before study.'}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 z-10 mt-1">
        <button
          onClick={toggleActive}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{cyclesCompleted > 0 ? 'Resume' : 'Begin Breathing'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetBreathing}
          className="p-2.5 rounded-full border border-[#DCD0FF] dark:border-[#3E3858] text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-[#EDE7FF]/40 transition-colors"
          title="Reset timer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
