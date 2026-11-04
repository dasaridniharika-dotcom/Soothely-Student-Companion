import React from 'react';
import { X, HeartHandshake, PhoneCall, MessageSquare, ExternalLink, ShieldAlert } from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/initialData';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-[#FFF9F1] dark:bg-[#1E1C2B] rounded-2xl border border-[#DCD0FF] dark:border-[#38334E] shadow-2xl p-6 text-[#292638] dark:text-[#E8E4F8] transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-modal-title"
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#EDE7FF] dark:border-[#2C2740]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EDE7FF] dark:bg-[#2F2A47] text-[#7C3AED]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 id="crisis-modal-title" className="text-lg font-semibold font-display">
                You Are Not Alone
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Immediate, free, and confidential student support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-[#EDE7FF]/50 transition-colors"
            aria-label="Close crisis support modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-purple-900 dark:text-purple-200">
            Soothely AI is an emotional wellness and study companion, not a crisis or healthcare provider. If you are experiencing thoughts of self-harm, severe distress, or an emergency, please reach out directly to trained human counselors below:
          </p>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {CRISIS_RESOURCES.map((res, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-white dark:bg-[#252236] border border-[#EDE7FF] dark:border-[#35304C] hover:border-[#DCD0FF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-semibold text-[#292638] dark:text-white">
                  {res.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {res.detail}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
                  {res.number.includes('Text') ? (
                    <MessageSquare className="w-3.5 h-3.5" />
                  ) : (
                    <PhoneCall className="w-3.5 h-3.5" />
                  )}
                  <span>{res.number}</span>
                </div>
              </div>

              {res.url && (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#EDE7FF] dark:bg-[#342F4D] text-[#5B21B6] dark:text-[#DDD6FE] hover:bg-[#DCD0FF] transition-colors whitespace-nowrap"
                >
                  <span>Visit site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#EDE7FF] dark:border-[#2C2740] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#292638] dark:bg-[#DCD0FF] dark:text-[#292638] rounded-xl hover:opacity-90 transition-opacity"
          >
            I Understand & Return
          </button>
        </div>
      </div>
    </div>
  );
};
