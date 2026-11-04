import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  BookOpen, 
  MessageCircleHeart, 
  Target, 
  Smile, 
  Clock, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Compass
} from 'lucide-react';
import { NavigationPage } from '../types';
import { BreathingWidget } from '../components/BreathingWidget';

interface LandingPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenCrisis: () => void;
  studentName: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenCrisis,
  studentName,
}) => {
  const heroImage = '/src/assets/images/hero_companion_peaceful_1793784461671.jpg';
  const mascotImage = '/src/assets/images/companion_avatar_mascot_1793784461508.jpg';

  const features = [
    {
      icon: MessageCircleHeart,
      title: 'Empathic AI Companion',
      description: 'A 24/7 compassionate space to vent, de-escalate panic attacks, and break down paralyzing workloads without judgment.',
      page: 'companion' as NavigationPage,
      color: 'from-purple-500/10 to-indigo-500/10',
      badge: 'Always Here',
    },
    {
      icon: Target,
      title: 'Academic Comeback Planner',
      description: 'Step-by-step roadmaps to bounce back from low test grades, missed deadlines, or prolonged burnout with manageable micro-tasks.',
      page: 'planner' as NavigationPage,
      color: 'from-amber-500/10 to-orange-500/10',
      badge: 'Low-Stress Action',
    },
    {
      icon: Smile,
      title: 'Mindful Mood Journal',
      description: 'Track feelings across high-pressure exam cycles, uncover your mental energy trends, and celebrate subtle emotional wins.',
      page: 'journal' as NavigationPage,
      color: 'from-pink-500/10 to-rose-500/10',
      badge: 'Visual Trends',
    },
    {
      icon: BookOpen,
      title: 'Gentle Study Recovery',
      description: 'Organize intimidating coursework into bite-sized chapters, track confidence, and study with an integrated 25/5 pacing timer.',
      page: 'study' as NavigationPage,
      color: 'from-emerald-500/10 to-teal-500/10',
      badge: 'Focus Pacing',
    },
    {
      icon: Sparkles,
      title: 'Daily Student Motivation',
      description: 'Cognitive reframing cards, anti-imposter-syndrome affirmations, and 2-minute micro-habits to rebuild your inner belief.',
      page: 'motivation' as NavigationPage,
      color: 'from-violet-500/10 to-purple-500/10',
      badge: 'Daily Grounding',
    },
    {
      icon: ShieldCheck,
      title: 'Private & Safe Sanctuary',
      description: 'Your notes and thoughts stay local. Immediate 1-tap connection to verified student crisis lifelines and 988 support whenever needed.',
      page: 'dashboard' as NavigationPage,
      color: 'from-blue-500/10 to-cyan-500/10',
      badge: 'Confidential',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
        {/* Soft background pastel gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#EDE7FF]/70 via-[#DCD0FF]/40 to-transparent dark:from-[#352F4F]/40 dark:via-[#221D35]/20 dark:to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Clean Tagline Kicker (Zero-Pill discipline) */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold tracking-wide text-[#7C3AED] dark:text-[#C4B5FD] uppercase">
                <span>Soothely AI</span>
                <span aria-hidden="true">·</span>
                <span>Your feelings matter. Your journey continues.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-[#292638] dark:text-white leading-[1.15] text-balance">
                It's okay not to be okay.{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent">
                  Let's take one step together.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
                The emotional support and personal growth sanctuary for school and college students. Decompress from exam anxiety, recover from academic setbacks, and find calm with a gentle companion by your side.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Get Started with Soothely</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('companion')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#EDE7FF] dark:bg-[#2F2944] text-[#5B21B6] dark:text-[#DDD6FE] border border-[#DCD0FF] dark:border-[#433A62] text-sm font-semibold hover:bg-[#DCD0FF]/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircleHeart className="w-4 h-4 text-[#7C3AED]" />
                  <span>Meet Your AI Companion</span>
                </button>
              </div>

              {/* Subtle Trust & Reassurance Info */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Free for students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>No judgment ever</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Safe & confidential</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#EDE7FF] dark:border-[#383151] shadow-2xl bg-white dark:bg-[#201C30] group">
                <img
                  src={heroImage}
                  alt="Student peacefully studying in a cozy room with companion"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container in case image error
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Overlay Card: Instant Breathing Reminder */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 dark:bg-[#1C182B]/95 backdrop-blur-md border border-[#EDE7FF] dark:border-[#383050] shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE7FF] dark:bg-[#322A4C] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-[#7C3AED] fill-[#DCD0FF]/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#292638] dark:text-white truncate">
                      Feeling overwhelmed right now?
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Take 3 physiological sighs. You are safe here.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('companion')}
                    className="ml-auto text-xs font-bold text-[#7C3AED] hover:underline whitespace-nowrap"
                  >
                    Chat now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warm Welcome Section with Interactive Breathing Sanctuary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#EDE7FF]/60 via-[#FFF9F1] to-[#DCD0FF]/40 dark:from-[#252037] dark:via-[#1B1829] dark:to-[#2B2342] p-8 sm:p-12 border border-[#DCD0FF] dark:border-[#3C3456] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>A Warm Welcome to Your Sanctuary</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white">
                School is demanding. Your mental peace comes first.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Whether you just received a disappointing midterm grade, missed lectures because of anxiety, or feel paralyzed by a mountain of deadlines, Soothely AI meets you exactly where you are. We don't preach toxic hustle culture; we engineer calm, actionable paths forward.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#201C31]/80 border border-[#EDE7FF] dark:border-[#352E4E]">
                  <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                    No "Toxic Productivity"
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    We replace 12-hour cram guilt with 20-minute restorative micro-sprints.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#201C31]/80 border border-[#EDE7FF] dark:border-[#352E4E]">
                  <h4 className="text-sm font-bold text-[#292638] dark:text-white font-display">
                    Academic Comeback Method
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Structured plans to recover your GPA without sacrificing your sleep.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Breathing Tool in Welcome Section */}
            <div className="lg:col-span-5">
              <BreathingWidget compact={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white">
            Designed for the Real Student Experience
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Every tool in Soothely AI was developed around real student hurdles: freeze states, exam dread, imposter syndrome, and sleep-deprived cramming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(feat.page)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#342D4C] hover:border-[#DCD0FF] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDE7FF] dark:bg-[#2E2745] text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-[#FFF9F1] dark:bg-[#28223B] px-2.5 py-1 rounded-full border border-[#EDE7FF] dark:border-[#3A3352]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white mb-2 group-hover:text-[#7C3AED] dark:group-hover:text-[#DDD6FE] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center text-xs font-semibold text-[#7C3AED] dark:text-[#C4B5FD] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Voices & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#EDE7FF]/40 dark:bg-[#1B1829] border border-[#DCD0FF] dark:border-[#312B47] space-y-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#7C3AED] dark:text-[#C4B5FD] uppercase tracking-wider font-display">
              Student Reflections
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#292638] dark:text-white mt-1">
              You are walking a path many have walked before.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#231F35] border border-[#EDE7FF] dark:border-[#383151] space-y-3">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                "When I failed my first Organic Chemistry exam, I was about to drop out. Soothely helped me stop spiraling, talk through the shame, and design an achievable 25-minute daily study comeback."
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Daniel K.</span> · Pre-Med Sophomore
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#231F35] border border-[#EDE7FF] dark:border-[#383151] space-y-3">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                "The 4-7-8 breathing circle and the gentle study timer literally rescued my finals week. It doesn't treat you like a study robot; it reminds you to breathe."
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Aisha M.</span> · Computer Science Senior
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#231F35] border border-[#EDE7FF] dark:border-[#383151] space-y-3">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                "Having an AI companion that doesn't say 'just work harder' but asks 'what is one tiny thing you can do right now?' was the exact mindset shift I needed."
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Liam P.</span> · High School Junior
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#292638] via-[#3C3556] to-[#292638] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-bold font-display">
              Ready to take your next gentle step?
            </h3>
            <p className="text-sm sm:text-base text-neutral-300">
              No subscription fees, no high-pressure gamification. Just an empathetic space to breathe, reflect, and thrive in your studies.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EDE7FF] text-[#292638] text-sm font-semibold hover:bg-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Open Student Dashboard
              </button>
              <button
                onClick={() => onNavigate('companion')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all cursor-pointer"
              >
                Talk to Soothely AI
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
