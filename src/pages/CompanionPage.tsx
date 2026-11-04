import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Plus, 
  Sparkles, 
  MessageCircle, 
  Heart, 
  ShieldAlert, 
  Mic, 
  Clock, 
  Smile, 
  Volume2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { ChatSession, ChatMessage, StudentProfile } from '../types';
import { CONVERSATION_STARTERS } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface CompanionPageProps {
  profile: StudentProfile;
  sessions: ChatSession[];
  onUpdateSessions: (sessions: ChatSession[]) => void;
  onOpenCrisis: () => void;
}

export const CompanionPage: React.FC<CompanionPageProps> = ({
  profile,
  sessions,
  onUpdateSessions,
  onOpenCrisis,
}) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessions[0]?.id || 'session-1'
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toneMode, setToneMode] = useState<'gentle' | 'coach' | 'problem_solve'>('gentle');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mascotAvatar = '/src/assets/images/companion_avatar_mascot_1793784461508.jpg';

  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    soundManager.playSoftCompletion();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...(activeSession?.messages || []), userMsg];
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === activeSession.id) {
        return {
          ...sess,
          preview: text.trim().slice(0, 36) + '...',
          messages: updatedMessages,
        };
      }
      return sess;
    });

    onUpdateSessions(updatedSessions);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Multi-turn conversation history for Gemini API
      const conversationPayload = updatedMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationPayload,
          model: selectedModel,
          persona: toneMode,
          studentName: profile.name,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || generateEmpathicResponse(text.trim(), toneMode, profile.name).text;

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone: toneMode === 'coach' ? 'action' : toneMode === 'problem_solve' ? 'clarity' : 'comfort',
      };

      const finalSessions = updatedSessions.map((sess) => {
        if (sess.id === activeSession.id) {
          return {
            ...sess,
            messages: [...sess.messages, aiMsg],
          };
        }
        return sess;
      });

      onUpdateSessions(finalSessions);
      setIsTyping(false);
      soundManager.playWarmChime(528);
    } catch (err) {
      console.warn('Gemini chat client fallback:', err);
      const fallbackReply = generateEmpathicResponse(text.trim(), toneMode, profile.name);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: fallbackReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone: fallbackReply.tone,
      };

      const finalSessions = updatedSessions.map((sess) => {
        if (sess.id === activeSession.id) {
          return {
            ...sess,
            messages: [...sess.messages, aiMsg],
          };
        }
        return sess;
      });

      onUpdateSessions(finalSessions);
      setIsTyping(false);
      soundManager.playWarmChime(528);
    }
  };

  const handleStartNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      date: 'Just now',
      preview: 'Starting a new conversation...',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Hi ${profile.name}, I am right here with you. What is on your mind today? We can break down big assignments, de-escalate anxiety, or just vent without pressure.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tone: 'comfort',
        },
      ],
    };
    onUpdateSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleClearCurrentSession = () => {
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === activeSession.id) {
        return {
          ...sess,
          preview: 'Conversation reset',
          messages: [],
        };
      }
      return sess;
    });
    onUpdateSessions(updatedSessions);
    setShowClearConfirm(false);
  };

  const generateEmpathicResponse = (
    query: string,
    mode: 'gentle' | 'coach' | 'problem_solve',
    name: string
  ): { text: string; tone: 'comfort' | 'clarity' | 'action' | 'listening' } => {
    const lower = query.toLowerCase();

    // Check for crisis indicators
    if (
      lower.includes('hurt myself') ||
      lower.includes('suicide') ||
      lower.includes('end it all') ||
      lower.includes('want to die') ||
      lower.includes('cannot go on living')
    ) {
      return {
        text: `Maya, I hear how deeply exhausted and in pain you are right now, but please know that you do not have to carry this alone. Your life has immense value.\n\nPlease connect immediately with someone trained who can support you right now:\n• Call or text 988 (free, confidential 24/7)\n• Text HOME to 741741 for the Crisis Text Line.\nI am an AI companion, but real human care is waiting for you right this second.`,
        tone: 'comfort',
      };
    }

    if (lower.includes('fail') || lower.includes('grade') || lower.includes('exam') || lower.includes('test')) {
      return {
        text: `I know how gut-wrenching that number feels right now, ${name}. When you've poured energy into something and the result doesn't reflect your effort, it is completely normal to feel wounded.\n\nHere is what I want you to remember: A test score measures how well you regurgitated specific data points under artificial time constraints on one single day. It does NOT measure your capacity to learn, your curiosity, or who you will become.\n\nCan we take 3 slow breaths, let the initial adrenaline dissipate, and then look at just 1 problem together in the Comeback Planner?`,
        tone: 'comfort',
      };
    }

    if (lower.includes('paralyz') || lower.includes('overwhelm') || lower.includes('procrastinat') || lower.includes('start')) {
      return {
        text: `Procrastination is rarely laziness—it is almost always emotional regulation in response to high anxiety. Your brain is trying to protect you from failure by refusing to engage.\n\nLet's apply the 'Absurdly Small Step' rule:\n1. Close all 20 open browser tabs except one.\n2. Set a timer for just 7 minutes.\n3. Write the worst, messiest sentence or problem attempt you can think of.\nYou don't have to finish the whole essay or problem set; you only need to break the inertia. Will you try 7 minutes with me?`,
        tone: 'action',
      };
    }

    if (lower.includes('imposter') || lower.includes('everyone else') || lower.includes('smarter') || lower.includes('behind')) {
      return {
        text: `You are comparing your behind-the-scenes messy bloopers with other people's highlight reels in lectures. Everyone around you feels insecure about something—some just hide it behind louder voices.\n\nYou didn't slip into this school or class by mistake. You belong in this room, questions and all. What is one thing you actually find interesting about what you are studying, separate from grades?`,
        tone: 'clarity',
      };
    }

    if (mode === 'coach') {
      return {
        text: `I hear you, ${name}. Let's look at this through a growth lens. What is the single biggest bottleneck standing in your path in the next 2 hours? Let's isolate that one piece and conquer it.`,
        tone: 'action',
      };
    }

    if (mode === 'problem_solve') {
      return {
        text: `Understood. Let's engineer a solution step-by-step: First, let's categorize what is Urgent vs what is simply Loud. Which part of this has an unmovable deadline?`,
        tone: 'clarity',
      };
    }

    // Default empathetic companion response
    return {
      text: `Thank you for sharing that with me, ${name}. It takes real courage to put heavy thoughts into words. I'm right here beside you. You don't have to solve everything today; taking things five minutes at a time is more than enough. How is your body feeling right now—is your jaw clenched or shoulders tense?`,
      tone: 'comfort',
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Safety Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-[#EDE7FF]/60 dark:bg-[#25203A] border border-[#DCD0FF] dark:border-[#382F50] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
          <Info className="w-4 h-4 text-[#7C3AED] shrink-0" />
          <span>
            <strong>Soothely AI Companion:</strong> An empathetic student listening & study reflection partner. Not a licensed therapist.
          </span>
        </div>
        <button
          onClick={onOpenCrisis}
          className="text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center gap-1 shrink-0"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Crisis Support (988)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Sidebar: Chat Sessions & Starters */}
        <div className="hidden lg:flex lg:col-span-4 flex-col bg-white dark:bg-[#1E1A2D] rounded-3xl border border-[#EDE7FF] dark:border-[#332C4A] p-4 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2C2740]">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 font-display">
                Conversations
              </span>
            </div>
            <button
              onClick={handleStartNewChat}
              className="p-1.5 rounded-xl bg-[#EDE7FF] dark:bg-[#322A4E] text-[#7C3AED] dark:text-[#DDD6FE] hover:bg-[#DCD0FF] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Start New Chat"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSession?.id;
              return (
                <button
                  key={sess.id}
                  onClick={() => setCurrentSessionId(sess.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-[#EDE7FF] dark:bg-[#332A50] border-[#7C3AED] shadow-xs'
                      : 'border-transparent hover:bg-[#FFF9F1] dark:hover:bg-[#252037]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#292638] dark:text-white truncate">
                      {sess.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                      {sess.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {sess.preview}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Suggested Quick Starters Box */}
          <div className="pt-3 border-t border-[#EDE7FF] dark:border-[#2C2740] space-y-2">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-display">
              Quick Conversation Starters
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {CONVERSATION_STARTERS.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="w-full text-left p-2 rounded-xl text-xs bg-[#FFF9F1] dark:bg-[#252036] hover:bg-[#EDE7FF]/60 text-neutral-700 dark:text-neutral-200 transition-colors line-clamp-1 border border-[#EDE7FF]/60 dark:border-[#362E4D]"
                >
                  "{item.prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Viewport: Chat Window */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#1E1A2D] rounded-3xl border border-[#EDE7FF] dark:border-[#332C4A] shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#EDE7FF] dark:border-[#2C2740] flex items-center justify-between bg-[#FFF9F1]/40 dark:bg-[#241F36]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#DCD0FF] overflow-hidden bg-white shrink-0">
                <img
                  src={mascotAvatar}
                  alt="Soothely"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-display text-[#292638] dark:text-white">
                    Soothely AI
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium px-2 py-0.5 rounded-full">
                    Empathetic Companion
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Always here to listen, reframe, and guide.
                </p>
              </div>
            </div>

            {/* Model & Tone selector */}
            <div className="flex items-center gap-2">
              {/* Gemini Model Selector */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDE7FF]/60 dark:bg-[#31294A] border border-[#DCD0FF] dark:border-[#3E345C] text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-transparent border-none text-[11px] font-semibold text-[#5B21B6] dark:text-[#DDD6FE] focus:outline-hidden cursor-pointer"
                  title="Choose Gemini Model"
                >
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (General Tasks)</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center bg-[#EDE7FF] dark:bg-[#31294A] rounded-xl p-1 text-xs">
                <button
                  onClick={() => setToneMode('gentle')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    toneMode === 'gentle'
                      ? 'bg-white dark:bg-[#221C35] text-[#7C3AED] dark:text-[#DDD6FE] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Gentle
                </button>
                <button
                  onClick={() => setToneMode('problem_solve')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    toneMode === 'problem_solve'
                      ? 'bg-white dark:bg-[#221C35] text-[#7C3AED] dark:text-[#DDD6FE] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Step-by-Step
                </button>
                <button
                  onClick={() => setToneMode('coach')}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    toneMode === 'coach'
                      ? 'bg-white dark:bg-[#221C35] text-[#7C3AED] dark:text-[#DDD6FE] shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Coach
                </button>
              </div>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Clear Conversation"
                aria-label="Clear Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confirm clear dialog overlay */}
          {showClearConfirm && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 text-xs flex items-center justify-between">
              <span className="text-amber-900 dark:text-amber-200">
                Are you sure you want to clear this conversation?
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearCurrentSession}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeSession && activeSession.messages.length > 0 ? (
              activeSession.messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-full border border-[#DCD0FF] overflow-hidden bg-white shrink-0 mt-0.5">
                        <img
                          src={mascotAvatar}
                          alt="Soothely"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isAi
                          ? 'bg-[#EDE7FF]/60 dark:bg-[#28213D] border border-[#DCD0FF] dark:border-[#3A3157] text-[#292638] dark:text-[#E8E4F8]'
                          : 'bg-[#292638] dark:bg-[#DCD0FF] text-white dark:text-[#292638] rounded-br-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <div
                        className={`mt-2 flex items-center justify-between text-[10px] ${
                          isAi ? 'text-neutral-400' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      >
                        {isAi && msg.tone && (
                          <span className="uppercase tracking-wider font-semibold text-[#7C3AED] dark:text-[#C4B5FD]">
                            {msg.tone}
                          </span>
                        )}
                        <span className="ml-auto font-mono">{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE7FF] dark:bg-[#32294F] flex items-center justify-center text-[#7C3AED]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold font-display text-[#292638] dark:text-white">
                    How can Soothely support you right now?
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                    Choose a starter below or type what you are experiencing. No thought is too small or messy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full pt-2">
                  {CONVERSATION_STARTERS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="text-left p-2.5 rounded-xl text-xs bg-[#FFF9F1] dark:bg-[#241F37] border border-[#EDE7FF] dark:border-[#382F52] hover:border-[#7C3AED] text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer"
                    >
                      <span className="font-semibold text-[#7C3AED] block mb-0.5">
                        {item.category}
                      </span>
                      <span className="line-clamp-2">{item.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#DCD0FF] overflow-hidden bg-white shrink-0">
                  <img
                    src={mascotAvatar}
                    alt="Soothely"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-[#EDE7FF]/60 dark:bg-[#28213D] border border-[#DCD0FF] dark:border-[#3A3157] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-1">
                    Soothely is reflecting
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-[#EDE7FF] dark:border-[#2C2740] bg-[#FFF9F1]/40 dark:bg-[#201B31]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Share what is on your mind or what you're dreading today..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-[#27223C] border border-[#EDE7FF] dark:border-[#3A3254] text-sm text-[#292638] dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-[#7C3AED] transition-colors"
              />

              <button
                type="button"
                onClick={() => {
                  soundManager.playWarmChime(440);
                  setInputMessage(
                    "I just feel like everyone else in my class understands the material except me."
                  );
                }}
                className="hidden sm:inline-flex p-3 rounded-2xl border border-[#EDE7FF] dark:border-[#382F52] text-neutral-500 hover:text-[#7C3AED] hover:bg-[#EDE7FF]/50 transition-colors"
                title="Simulate student thought starter"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-3 rounded-2xl bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-2 text-center">
              Responses are empathetic student support prompts. In acute distress, please reach out to crisis resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
