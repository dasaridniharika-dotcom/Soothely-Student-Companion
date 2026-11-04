import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Radio, 
  Sliders, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const MusicStudioPage: React.FC = () => {
  const [prompt, setPrompt] = useState('Gentle lo-fi ambient piano with soft rain for late night studying');
  const [duration, setDuration] = useState<'clip' | 'full'>('clip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Active Soundscape Player State
  const [activeSoundscape, setActiveSoundscape] = useState<'lofi' | 'binaural' | 'rain' | 'tibetan' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<any[]>([]);

  const presets = [
    {
      title: 'Midnight Lo-Fi Library',
      prompt: 'Lo-fi chill hip-hop study beat, warm rhodes piano, vinyl dust, gentle 70bpm cadence',
      category: 'Focus',
      type: 'lofi' as const,
    },
    {
      title: '432Hz Alpha Waves',
      prompt: 'Pure 432Hz restorative binaural frequency drone with ambient synthesizer wash',
      category: 'Calm',
      type: 'binaural' as const,
    },
    {
      title: 'Dorm Room Rainfall',
      prompt: 'Continuous peaceful rain on window glass with distant comforting thunder',
      category: 'Sleep & Study',
      type: 'rain' as const,
    },
    {
      title: 'Tibetan Mindful Singing Bowl',
      prompt: 'Deep harmonic resonance of copper singing bowls and wind chimes for meditation',
      category: 'Breathing',
      type: 'tibetan' as const,
    },
  ];

  // Stop active synthesis
  const stopSynthesis = () => {
    soundNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore
      }
    });
    soundNodesRef.current = [];
    setIsPlaying(false);
    setActiveSoundscape(null);
  };

  // Play procedural soundscapes via Web Audio API
  const playSoundscape = (type: 'lofi' | 'binaural' | 'rain' | 'tibetan') => {
    stopSynthesis();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'binaural') {
        // Binaural 432Hz + 440Hz warm beat frequency
        const freqs = [216, 432, 438, 648];
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 500;
          osc.type = 'sine';
          osc.frequency.value = f;
          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          soundNodesRef.current.push(osc);
        });
      } else if (type === 'rain') {
        // Filtered pink noise rain simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.12;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 750;
        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        soundNodesRef.current.push(noise);
      } else if (type === 'tibetan') {
        // Harmonic bell chime pads
        const bells = [264, 528, 792, 1056];
        bells.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          const bellGain = ctx.createGain();
          bellGain.gain.setValueAtTime(0.04, ctx.currentTime);
          osc.connect(bellGain);
          bellGain.connect(masterGain);
          osc.start();
          soundNodesRef.current.push(osc);
        });
      } else {
        // Lo-Fi warm chord progression (Fmaj7 - Am7)
        const chordFreqs = [174.61, 220, 261.63, 329.63];
        chordFreqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 450;
          osc.type = 'triangle';
          osc.frequency.value = f;
          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          soundNodesRef.current.push(osc);
        });
      }

      soundNodesRef.current.push(masterGain);
      setActiveSoundscape(type);
      setIsPlaying(true);
    } catch {
      // ignore
    }
  };

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatusMessage('Contacting sound generator...');
    soundManager.playWarmChime(528);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration }),
      });

      const data = await res.json();
      if (data.audioDataUrl) {
        setGeneratedAudioUrl(data.audioDataUrl);
        setStatusMessage('AI Music generated successfully with Lyria!');
      } else {
        // Default to procedural synthesizer
        setStatusMessage(data.message || 'Procedural study soundscape activated for your session.');
        playSoundscape('lofi');
      }
    } catch (err: any) {
      console.warn('Music API fallback:', err);
      setStatusMessage('Procedural ambient study soundscape loaded.');
      playSoundscape('lofi');
    } finally {
      setIsGenerating(false);
    }
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      if (isPlaying) {
        phase += 0.05;
        ctx.beginPath();
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2.5;

        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.03 + phase) * 16 * Math.sin(x * 0.01) + Math.cos(x * 0.06 - phase * 0.7) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#DCD0FF';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.04 - phase * 0.5) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Calm flatline
        ctx.strokeStyle = 'rgba(220, 208, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#EDE7FF] dark:border-[#2C2740]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-[#C4B5FD] font-display">
          <Music className="w-4 h-4" />
          <span>Generative Music & Soundscape Studio</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#292638] dark:text-white mt-1">
          Bespoke audio environments for deep study.
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
          Generate custom AI study tracks with Lyria or activate procedural ambient soundscapes to dissolve background noise and calm exam anxiety.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-[#EDE7FF] dark:bg-[#322A4E] border border-[#DCD0FF] dark:border-[#453A66] text-[#5B21B6] dark:text-[#DDD6FE] text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Visualizer & Now Playing Console */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#292638] via-[#352D4C] to-[#292638] text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>{isPlaying ? 'AUDIO ACTIVE' : 'STUDIO READY'}</span>
            </div>
            <h3 className="text-xl font-bold font-display mt-1">
              {activeSoundscape
                ? `${activeSoundscape.toUpperCase()} Ambient Soundscape`
                : 'Select or generate a track below'}
            </h3>
          </div>

          {/* Master Controls */}
          <div className="flex items-center gap-3">
            {isPlaying ? (
              <button
                onClick={stopSynthesis}
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Studio</span>
              </button>
            ) : (
              <button
                onClick={() => playSoundscape('lofi')}
                className="px-6 py-2.5 rounded-full bg-[#DCD0FF] text-[#1E192D] text-xs font-bold hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Soundscape</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Frequency Visualizer Canvas */}
        <div className="w-full h-24 bg-[#1E192D]/70 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
          <canvas
            ref={visualizerCanvasRef}
            width={700}
            height={90}
            className="w-full h-full block"
          />
        </div>

        {/* Embedded HTML audio element if Lyria returned encoded MP3 */}
        {generatedAudioUrl && (
          <div className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between">
            <span className="text-xs font-mono">Lyria Track Player</span>
            <audio src={generatedAudioUrl} controls autoPlay className="h-8 max-w-xs" />
          </div>
        )}
      </div>

      {/* Preset Study Soundscapes */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white">
          Instant Mindful Soundscapes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((preset) => {
            const isActive = activeSoundscape === preset.type && isPlaying;
            return (
              <div
                key={preset.title}
                onClick={() => {
                  if (isActive) stopSynthesis();
                  else playSoundscape(preset.type);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-[#EDE7FF] dark:bg-[#342C4E] border-[#7C3AED] shadow-sm'
                    : 'bg-white dark:bg-[#201C31] border-[#EDE7FF] dark:border-[#352E4E] hover:border-[#DCD0FF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-mono text-[#7C3AED] dark:text-[#C4B5FD] font-semibold uppercase">
                      {preset.category}
                    </span>
                    <Headphones className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h4 className="text-base font-bold font-display text-[#292638] dark:text-white">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {preset.prompt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                  <span className={isActive ? 'text-[#7C3AED] dark:text-white' : 'text-neutral-500'}>
                    {isActive ? 'Playing now ✦' : 'Click to stream'}
                  </span>
                  <div className={`p-1.5 rounded-full ${isActive ? 'bg-[#7C3AED] text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'}`}>
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Music Generation Prompt Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201C31] border border-[#EDE7FF] dark:border-[#332A4C] shadow-xs space-y-5">
        <div>
          <h3 className="text-lg font-bold font-display text-[#292638] dark:text-white">
            Generate Custom Music
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Prompt Lyria or procedural models to craft the exact auditory mood your brain requires.
          </p>
        </div>

        <form onSubmit={handleGenerateMusic} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
              Music Style & Acoustic Description
            </label>
            <input
              type="text"
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Atmospheric cello and rainy coffee shop ambient drone"
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE7FF] dark:border-[#382F50] bg-[#FFF9F1] dark:bg-[#252037] text-sm text-[#292638] dark:text-white focus:outline-hidden focus:border-[#7C3AED]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Duration:</span>
              <div className="flex items-center p-1 bg-[#FFF9F1] dark:bg-[#262038] rounded-xl border border-[#EDE7FF] dark:border-[#372E4C] text-xs">
                <button
                  type="button"
                  onClick={() => setDuration('clip')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    duration === 'clip'
                      ? 'bg-white dark:bg-[#1E192D] text-[#7C3AED] dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  30s Study Clip
                </button>
                <button
                  type="button"
                  onClick={() => setDuration('full')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    duration === 'full'
                      ? 'bg-white dark:bg-[#1E192D] text-[#7C3AED] dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  Full-Length Track
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-7 py-3 rounded-full bg-[#292638] text-white dark:bg-[#EDE7FF] dark:text-[#292638] text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Music'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
