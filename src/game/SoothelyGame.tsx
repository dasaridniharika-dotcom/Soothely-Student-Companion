import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Trophy, RotateCcw, ArrowLeft, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface SoothelyGameProps {
  onExit: () => void;
  studentName: string;
}

type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export const SoothelyGame: React.FC<SoothelyGameProps> = ({ onExit, studentName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState(0);
  const [calmHealth, setCalmHealth] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('soothely_game_high') || 0);
    } catch {
      return 0;
    }
  });

  // Mutable Game Loop State (kept outside React state to maintain solid 60fps)
  const engineRef = useRef({
    gameState: 'title' as GameState,
    isMuted: false,
    score: 0,
    health: 3,
    distance: 0,
    targetDistance: 500,
    cameraX: 0,
    cameraShake: 0,
    hitstopTimer: 0,
    // Player
    player: {
      x: 100,
      y: 350,
      vx: 0,
      vy: 0,
      radius: 20,
      grounded: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      squashX: 1,
      squashY: 1,
      calmShieldTimer: 0,
      facing: 1,
    },
    // Entities
    platforms: [] as { x: number; y: number; w: number; h: number; type: 'normal' | 'cloud' | 'spring' }[],
    sparks: [] as { x: number; y: number; collected: boolean; angle: number }[],
    orbs: [] as { x: number; y: number; collected: boolean }[],
    hazards: [] as {
      x: number;
      y: number;
      vx: number;
      radius: number;
      windupTimer: number;
      isAttacking: boolean;
      active: boolean;
    }[],
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }[],
    // Input state
    heldKeys: {} as Record<string, boolean>,
    justPressedKeys: {} as Record<string, boolean>,
  });

  // Web Audio Context for Procedural Game Sounds
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  const playSynth = (type: 'jump' | 'spark' | 'orb' | 'pulse' | 'hit' | 'victory') => {
    if (engineRef.current.isMuted) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'spark') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'orb') {
        // Binaural harmonic chord
        [528, 660, 792].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.85);
        });
      } else if (type === 'pulse') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(432, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'victory') {
        [440, 554, 659, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.08, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.65);
        });
      }
    } catch {
      // ignore
    }
  };

  const spawnParticles = (x: number, y: number, count: number, color = '#EDE7FF') => {
    const engine = engineRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      engine.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 0.4 + 0.4,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  };

  const initWorld = () => {
    const engine = engineRef.current;
    engine.score = 0;
    engine.health = 3;
    engine.distance = 0;
    engine.cameraX = 0;
    engine.cameraShake = 0;
    engine.hitstopTimer = 0;
    engine.particles = [];

    // Reset player
    engine.player.x = 120;
    engine.player.y = 300;
    engine.player.vx = 0;
    engine.player.vy = 0;
    engine.player.squashX = 1;
    engine.player.squashY = 1;
    engine.player.calmShieldTimer = 0;

    // Generate initial platforms
    engine.platforms = [
      { x: 0, y: 460, w: 400, h: 60, type: 'normal' },
      { x: 450, y: 400, w: 220, h: 40, type: 'cloud' },
      { x: 720, y: 340, w: 240, h: 40, type: 'cloud' },
      { x: 1020, y: 280, w: 200, h: 40, type: 'spring' },
      { x: 1280, y: 380, w: 260, h: 40, type: 'normal' },
      { x: 1600, y: 320, w: 240, h: 40, type: 'cloud' },
      { x: 1900, y: 260, w: 220, h: 40, type: 'cloud' },
      { x: 2200, y: 360, w: 300, h: 50, type: 'normal' },
      { x: 2560, y: 300, w: 220, h: 40, type: 'cloud' },
      { x: 2850, y: 240, w: 320, h: 60, type: 'spring' },
      { x: 3250, y: 400, w: 400, h: 80, type: 'normal' }, // Summit Platform
    ];

    // Generate sparks
    engine.sparks = [];
    for (let i = 0; i < 35; i++) {
      engine.sparks.push({
        x: 200 + i * 85 + (Math.random() * 40 - 20),
        y: 200 + Math.sin(i * 0.7) * 90,
        collected: false,
        angle: 0,
      });
    }

    // Generate Breathe Orbs (Sanctuary powerups)
    engine.orbs = [
      { x: 800, y: 240, collected: false },
      { x: 1720, y: 220, collected: false },
      { x: 2650, y: 180, collected: false },
    ];

    // Generate Hazards (Anxiety Wisps)
    engine.hazards = [
      { x: 600, y: 350, vx: -1.2, radius: 18, windupTimer: 0, isAttacking: false, active: true },
      { x: 1150, y: 230, vx: -1.4, radius: 18, windupTimer: 0, isAttacking: false, active: true },
      { x: 1780, y: 270, vx: -1.5, radius: 20, windupTimer: 0, isAttacking: false, active: true },
      { x: 2400, y: 310, vx: -1.6, radius: 22, windupTimer: 0, isAttacking: false, active: true },
    ];

    setScore(0);
    setCalmHealth(3);
  };

  const startGame = () => {
    initWorld();
    engineRef.current.gameState = 'playing';
    setGameState('playing');
    playSynth('spark');
  };

  const togglePause = () => {
    if (engineRef.current.gameState === 'playing') {
      engineRef.current.gameState = 'paused';
      setGameState('paused');
    } else if (engineRef.current.gameState === 'paused') {
      engineRef.current.gameState = 'playing';
      setGameState('playing');
    }
  };

  const toggleMute = () => {
    const next = !engineRef.current.isMuted;
    engineRef.current.isMuted = next;
    setIsMuted(next);
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      const engine = engineRef.current;

      if (e.key === 'Escape') {
        if (engine.gameState === 'playing' || engine.gameState === 'paused') {
          togglePause();
        }
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
        return;
      }

      if (engine.gameState === 'title' && (code === 'Space' || code === 'Enter')) {
        e.preventDefault();
        startGame();
        return;
      }

      if ((engine.gameState === 'gameover' || engine.gameState === 'victory') && (code === 'Space' || code === 'Enter')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (!engine.heldKeys[code]) {
        engine.justPressedKeys[code] = true;
      }
      engine.heldKeys[code] = true;

      if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        engine.player.jumpBufferTimer = 0.12;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      engineRef.current.heldKeys[e.code] = false;
    };

    const handleBlur = () => {
      engineRef.current.heldKeys = {};
      engineRef.current.justPressedKeys = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main 60fps Game Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Clamp frame delta time to prevent physics explosions
      const dt = Math.min(rawDt, 0.05);

      const engine = engineRef.current;

      // Handle hitstop
      if (engine.hitstopTimer > 0) {
        engine.hitstopTimer -= dt;
      } else {
        // Update simulation if playing
        if (engine.gameState === 'playing') {
          updateSimulation(dt);
        } else if (engine.gameState === 'title') {
          // Subtle camera pan on title screen
          engine.cameraX += dt * 25;
        }
      }

      // Render
      renderWorld(ctx, canvas);

      // Clear edge-triggered keys at end of frame
      engine.justPressedKeys = {};

      animationFrameId = requestAnimationFrame(loop);
    };

    const updateSimulation = (dt: number) => {
      const engine = engineRef.current;
      const p = engine.player;

      // Camera shake decay
      if (engine.cameraShake > 0) {
        engine.cameraShake = Math.max(0, engine.cameraShake - dt * 15);
      }

      // Squash and stretch decay back to 1
      p.squashX += (1 - p.squashX) * Math.min(1, dt * 10);
      p.squashY += (1 - p.squashY) * Math.min(1, dt * 10);

      // Calm shield timer
      if (p.calmShieldTimer > 0) {
        p.calmShieldTimer -= dt;
      }

      // Input Movement
      const moveLeft = engine.heldKeys['KeyA'] || engine.heldKeys['ArrowLeft'];
      const moveRight = engine.heldKeys['KeyD'] || engine.heldKeys['ArrowRight'];

      const accel = p.grounded ? 1200 : 800;
      const friction = p.grounded ? 0.82 : 0.94;

      if (moveLeft) {
        p.vx -= accel * dt;
        p.facing = -1;
      } else if (moveRight) {
        p.vx += accel * dt;
        p.facing = 1;
      } else {
        p.vx *= friction;
      }

      // Speed clamp
      const maxSpeed = 340;
      p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));

      // Gravity
      const gravity = 850;
      p.vy += gravity * dt;

      // Coyote time & Jump buffer
      if (p.grounded) {
        p.coyoteTimer = 0.12;
      } else {
        p.coyoteTimer -= dt;
      }

      if (p.jumpBufferTimer > 0) {
        p.jumpBufferTimer -= dt;
      }

      // Jump execution
      if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
        p.vy = -440;
        p.grounded = false;
        p.coyoteTimer = 0;
        p.jumpBufferTimer = 0;
        p.squashX = 0.75;
        p.squashY = 1.35;
        playSynth('jump');
        spawnParticles(p.x, p.y + p.radius, 6, '#DCD0FF');
      }

      // Calm Pulse Action (Key E or Space while in air)
      if (engine.justPressedKeys['KeyF'] || (engine.justPressedKeys['Space'] && !p.grounded && p.vy > 0)) {
        playSynth('pulse');
        spawnParticles(p.x, p.y, 16, '#EDE7FF');
        // Push hazards back
        engine.hazards.forEach((h) => {
          const dist = Math.hypot(h.x - p.x, h.y - p.y);
          if (dist < 180) {
            h.vx += (h.x - p.x) * 2;
            spawnParticles(h.x, h.y, 8, '#C4B5FD');
          }
        });
      }

      // Integrate player position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Platform collisions (AABB vs Circle)
      p.grounded = false;
      for (const plat of engine.platforms) {
        if (
          p.x + p.radius > plat.x &&
          p.x - p.radius < plat.x + plat.w &&
          p.y + p.radius >= plat.y &&
          p.y - p.radius < plat.y + 12 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.radius;
          p.vy = 0;
          p.grounded = true;

          // Spring bounce platform
          if (plat.type === 'spring') {
            p.vy = -620;
            p.grounded = false;
            p.squashX = 0.6;
            p.squashY = 1.5;
            playSynth('jump');
            spawnParticles(p.x, p.y + p.radius, 12, '#FDE047');
          }
          break;
        }
      }

      // Bottom fall boundary check
      if (p.y > 600) {
        // Fall reset
        engine.health -= 1;
        engine.cameraShake = 12;
        engine.hitstopTimer = 0.08;
        playSynth('hit');
        p.x = Math.max(100, p.x - 200);
        p.y = 200;
        p.vx = 0;
        p.vy = 0;

        setCalmHealth(engine.health);
        if (engine.health <= 0) {
          engine.gameState = 'gameover';
          setGameState('gameover');
        }
      }

      // Sparks pickup
      for (const s of engine.sparks) {
        if (!s.collected) {
          const dist = Math.hypot(s.x - p.x, s.y - p.y);
          if (dist < p.radius + 15) {
            s.collected = true;
            engine.score += 10;
            setScore(engine.score);
            playSynth('spark');
            spawnParticles(s.x, s.y, 8, '#FBBF24');
          }
        }
      }

      // Breathe Orb pickup
      for (const orb of engine.orbs) {
        if (!orb.collected) {
          const dist = Math.hypot(orb.x - p.x, orb.y - p.y);
          if (dist < p.radius + 20) {
            orb.collected = true;
            p.calmShieldTimer = 4.0;
            engine.score += 50;
            setScore(engine.score);
            playSynth('orb');
            spawnParticles(orb.x, orb.y, 20, '#A78BFA');
          }
        }
      }

      // Hazards Update & Collision
      for (const h of engine.hazards) {
        h.x += h.vx;
        // Bounce patrol
        if (h.x < 300 || h.x > 3200) {
          h.vx *= -1;
        }

        // Proximity Windup Telegraph
        const dist = Math.hypot(h.x - p.x, h.y - p.y);
        if (dist < 160 && !h.isAttacking) {
          h.windupTimer += dt;
          if (h.windupTimer > 0.6) {
            h.isAttacking = true;
            h.vx = (p.x - h.x) > 0 ? 3.5 : -3.5;
          }
        } else {
          h.windupTimer = Math.max(0, h.windupTimer - dt);
        }

        // Collision with player
        if (dist < p.radius + h.radius) {
          if (p.calmShieldTimer > 0) {
            // Calm shield dissolves the hazard!
            h.x = -9999;
            engine.score += 25;
            setScore(engine.score);
            playSynth('spark');
            spawnParticles(p.x, p.y, 14, '#C4B5FD');
          } else {
            // Player gets hit
            engine.health -= 1;
            engine.cameraShake = 16;
            engine.hitstopTimer = 0.08;
            p.vx = (p.x - h.x > 0 ? 1 : -1) * 280;
            p.vy = -220;
            playSynth('hit');
            spawnParticles(p.x, p.y, 12, '#EF4444');
            setCalmHealth(engine.health);

            // Push hazard back
            h.x += (h.x - p.x > 0 ? 1 : -1) * 80;

            if (engine.health <= 0) {
              engine.gameState = 'gameover';
              setGameState('gameover');
            }
          }
        }
      }

      // Particles update
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const pt = engine.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= dt / pt.maxLife;
        if (pt.life <= 0) {
          engine.particles.splice(i, 1);
        }
      }

      // Camera follows player smoothly
      const targetCamX = p.x - 300;
      engine.cameraX += (targetCamX - engine.cameraX) * Math.min(1, dt * 6);
      engine.distance = Math.round(p.x);

      // Victory Condition: Reached the Summit Sanctuary
      if (p.x >= 3280 && engine.gameState === 'playing') {
        engine.gameState = 'victory';
        setGameState('victory');
        playSynth('victory');
        spawnParticles(p.x, p.y, 35, '#FDE047');
        if (engine.score > highScore) {
          setHighScore(engine.score);
          try {
            localStorage.setItem('soothely_game_high', String(engine.score));
          } catch {
            // ignore
          }
        }
      }
    };

    const renderWorld = (c: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      const engine = engineRef.current;
      const w = cvs.width;
      const h = cvs.height;

      c.save();

      // Camera Shake offset
      let shakeX = 0;
      let shakeY = 0;
      if (engine.cameraShake > 0) {
        shakeX = (Math.random() - 0.5) * engine.cameraShake;
        shakeY = (Math.random() - 0.5) * engine.cameraShake;
      }

      // Atmospheric Twilight Gradient Canvas
      const bgGrad = c.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1E192D');
      bgGrad.addColorStop(0.5, '#2D2344');
      bgGrad.addColorStop(1, '#1A1428');
      c.fillStyle = bgGrad;
      c.fillRect(0, 0, w, h);

      // Parallax Distant Stars & Gentle Glowing Nebulae
      c.save();
      c.translate(shakeX, shakeY);

      // Distant stars
      c.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 123 - engine.cameraX * 0.15) % (w + 200)) - 100;
        const sy = (i * 47) % (h - 100);
        const sz = (i % 3) + 1;
        c.fillRect(sx, sy, sz, sz);
      }

      // World Camera Translation
      c.translate(-engine.cameraX, 0);

      // Render Platforms
      for (const plat of engine.platforms) {
        if (plat.type === 'normal') {
          c.fillStyle = '#392E54';
          c.strokeStyle = '#DCD0FF';
          c.lineWidth = 2;
          c.beginPath();
          c.roundRect(plat.x, plat.y, plat.w, plat.h, 12);
          c.fill();
          c.stroke();
          // Platform grassy soft top
          c.fillStyle = '#5B4B82';
          c.beginPath();
          c.roundRect(plat.x, plat.y, plat.w, 8, [12, 12, 0, 0]);
          c.fill();
        } else if (plat.type === 'cloud') {
          c.fillStyle = 'rgba(237, 231, 255, 0.85)';
          c.strokeStyle = '#FFFFFF';
          c.lineWidth = 1.5;
          c.beginPath();
          c.roundRect(plat.x, plat.y, plat.w, plat.h, 16);
          c.fill();
          c.stroke();
        } else if (plat.type === 'spring') {
          c.fillStyle = '#6D28D9';
          c.strokeStyle = '#FDE047';
          c.lineWidth = 2;
          c.beginPath();
          c.roundRect(plat.x, plat.y, plat.w, plat.h, 10);
          c.fill();
          c.stroke();
          // Spring icon glyph
          c.fillStyle = '#FDE047';
          c.font = 'bold 12px sans-serif';
          c.fillText('✦ BREEZE ✦', plat.x + plat.w / 2 - 35, plat.y + 24);
        }
      }

      // Render Sparks (Golden floating diamond stars)
      for (const s of engine.sparks) {
        if (!s.collected) {
          c.save();
          c.translate(s.x, s.y);
          s.angle += 0.04;
          c.rotate(s.angle);
          c.fillStyle = '#FBBF24';
          c.shadowColor = '#FDE047';
          c.shadowBlur = 8;
          c.beginPath();
          c.moveTo(0, -7);
          c.lineTo(6, 0);
          c.lineTo(0, 7);
          c.lineTo(-6, 0);
          c.closePath();
          c.fill();
          c.restore();
        }
      }

      // Render Breathe Orbs
      for (const orb of engine.orbs) {
        if (!orb.collected) {
          c.save();
          c.translate(orb.x, orb.y);
          c.fillStyle = 'rgba(167, 139, 250, 0.7)';
          c.shadowColor = '#C4B5FD';
          c.shadowBlur = 15;
          c.beginPath();
          c.arc(0, 0, 14, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#FFFFFF';
          c.beginPath();
          c.arc(0, 0, 6, 0, Math.PI * 2);
          c.fill();
          c.restore();
        }
      }

      // Render Hazards (Anxiety Wisps)
      for (const h of engine.hazards) {
        c.save();
        c.translate(h.x, h.y);
        // Telegraph indicator glow
        if (h.windupTimer > 0) {
          c.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          c.lineWidth = 3;
          c.beginPath();
          c.arc(0, 0, h.radius + 8 + Math.sin(Date.now() * 0.02) * 4, 0, Math.PI * 2);
          c.stroke();
        }
        c.fillStyle = h.isAttacking ? '#DC2626' : '#7C2D12';
        c.shadowColor = '#EA580C';
        c.shadowBlur = 10;
        c.beginPath();
        c.arc(0, 0, h.radius, 0, Math.PI * 2);
        c.fill();
        // Wisp eyes
        c.fillStyle = '#FEF08A';
        c.beginPath();
        c.arc(-5, -2, 2.5, 0, Math.PI * 2);
        c.arc(5, -2, 2.5, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }

      // Render Player (Soothely Companion Creature)
      const p = engine.player;
      c.save();
      c.translate(p.x, p.y);
      c.scale(p.squashX * p.facing, p.squashY);

      // Tranquility Shield Aura if active
      if (p.calmShieldTimer > 0) {
        c.strokeStyle = 'rgba(196, 181, 253, 0.9)';
        c.lineWidth = 3;
        c.shadowColor = '#8B5CF6';
        c.shadowBlur = 16;
        c.beginPath();
        c.arc(0, 0, p.radius + 8, 0, Math.PI * 2);
        c.stroke();
      }

      // Mascot Body: Cloud / marshmallow shape
      c.fillStyle = '#EDE7FF';
      c.shadowColor = '#DCD0FF';
      c.shadowBlur = 10;
      c.beginPath();
      c.arc(0, 0, p.radius, 0, Math.PI * 2);
      c.fill();

      // Cheeks & Eyes
      c.shadowBlur = 0;
      c.fillStyle = '#292638';
      c.beginPath();
      c.arc(4, -2, 2, 0, Math.PI * 2);
      c.arc(12, -2, 2, 0, Math.PI * 2);
      c.fill();

      // Blush
      c.fillStyle = '#F472B6';
      c.beginPath();
      c.arc(2, 3, 2.5, 0, Math.PI * 2);
      c.arc(14, 3, 2.5, 0, Math.PI * 2);
      c.fill();

      // Sprout on head
      c.fillStyle = '#4ADE80';
      c.beginPath();
      c.arc(0, -p.radius - 2, 3.5, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Render Particles
      for (const pt of engine.particles) {
        c.save();
        c.globalAlpha = Math.max(0, pt.life);
        c.fillStyle = pt.color;
        c.shadowColor = pt.color;
        c.shadowBlur = 6;
        c.beginPath();
        c.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }

      // Summit Sanctuary Marker
      c.save();
      c.translate(3350, 320);
      c.fillStyle = '#FDE047';
      c.shadowColor = '#FDE047';
      c.shadowBlur = 20;
      c.font = 'bold 16px sans-serif';
      c.fillText('✨ SUMMIT SANCTUARY ✨', -90, -40);
      c.restore();

      c.restore(); // restore camera
      c.restore(); // restore canvas
    };

    // Auto-resize canvas to match container
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#161422] select-none overflow-hidden">
      {/* 60fps Isolated WebGL / 2D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* World-Matched Low-Occlusion In-Game HUD (Over 85% playfield unobstructed) */}
      {gameState === 'playing' && (
        <div className="pointer-events-none absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top Status Cluster */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 bg-[#1E1A2D]/80 border border-[#3C3454] rounded-2xl px-4 py-2.5 shadow-lg">
              {/* Health Hearts */}
              <div className="flex items-center gap-1 text-pink-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < calmHealth ? 'fill-pink-500 text-pink-500' : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-neutral-700" />

              {/* Calm Sparks Score */}
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span className="font-mono text-xs font-bold tabular-nums text-white">
                  {score} Sparks
                </span>
              </div>
            </div>

            {/* Quick Controls in corner (pointer-events auto for buttons) */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-xl bg-[#1E1A2D]/80 border border-[#3C3454] text-neutral-300 hover:text-white hover:bg-[#2A233F] transition-colors"
                title="Toggle Mute (M)"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={togglePause}
                className="p-2.5 rounded-xl bg-[#1E1A2D]/80 border border-[#3C3454] text-neutral-300 hover:text-white hover:bg-[#2A233F] transition-colors"
                title="Pause Game (Esc)"
              >
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom subtle hint line */}
          <div className="flex justify-center">
            <div className="px-4 py-1.5 rounded-full bg-[#1E1A2D]/70 border border-[#3C3454]/60 text-[11px] font-mono text-neutral-400">
              WASD Move · Space Jump/Breathe · F Calm Pulse · Esc Pause · Reach Summit Platform
            </div>
          </div>
        </div>
      )}

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-8 sm:p-12 z-10 bg-gradient-to-b from-transparent via-[#161422]/60 to-[#161422]/95">
          {/* Top Bar for Title Screen */}
          <div className="w-full flex justify-between items-center max-w-5xl">
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sanctuary</span>
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Toggle sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bespoke SVG Title Lockup with 30-40% negative space */}
          <div className="text-center space-y-6 max-w-xl my-auto">
            <div className="inline-flex items-center justify-center">
              <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#DCD0FF" strokeWidth="2" strokeDasharray="4 4" />
                <path
                  d="M30 60 C30 45 40 40 50 40 C60 40 70 45 70 60 C70 68 62 72 50 72 C38 72 30 68 30 60 Z"
                  fill="#EDE7FF"
                />
                <circle cx="45" cy="54" r="2.5" fill="#292638" />
                <circle cx="55" cy="54" r="2.5" fill="#292638" />
                <circle cx="50" cy="36" r="3.5" fill="#4ADE80" />
                <path d="M50 36 C54 30 60 32 62 34" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
                Soothely: Journey to Stillness
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Float through misty platforms, gather calm sparks, and dissolve anxiety storms on your path to the Summit Sanctuary.
              </p>
            </div>

            {/* Primary Start CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DCD0FF] text-[#1E192D] text-sm font-bold shadow-xl hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Mindful Journey</span>
              </button>
            </div>

            {/* Single flat control-hint line */}
            <p className="text-xs font-mono text-neutral-400">
              WASD Move · Space Jump/Breathe · Esc Pause · Enter to Start
            </p>
          </div>

          {/* Bottom High Score */}
          <div className="text-xs text-neutral-400 font-mono">
            Personal Sanctuary Best: <span className="text-amber-400 font-bold tabular-nums">{highScore} Sparks</span>
          </div>
        </div>
      )}

      {/* Paused Modal */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-sm bg-[#1E1A2D] rounded-3xl border border-[#3C3454] p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold font-display text-white">Mindful Pause</h3>
            <p className="text-xs text-neutral-300">
              Take a slow breath. Your journey waits right here.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={togglePause}
                className="w-full py-2.5 rounded-xl bg-[#DCD0FF] text-[#1E192D] text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                Resume Journey
              </button>
              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer"
              >
                Restart Level
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl border border-white/20 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-sm bg-[#1E1A2D] rounded-3xl border border-[#3C3454] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Breath Exhausted</h3>
            <p className="text-xs text-neutral-300">
              Academic and life journeys have setbacks. It is always safe to begin again.
            </p>
            <div className="p-3 rounded-xl bg-[#161422] border border-[#2D2642] text-xs font-mono text-neutral-400">
              Sparks Gathered: <span className="text-amber-400 font-bold tabular-nums">{score}</span>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-[#DCD0FF] text-[#1E192D] text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                Try Again (Space / Enter)
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl border border-white/20 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-sm bg-[#1E1A2D] rounded-3xl border border-[#DCD0FF] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Summit Reached!</h3>
            <p className="text-xs text-neutral-300">
              You navigated the storms and found stillness, {studentName}. Carry this peace into your studies.
            </p>
            <div className="p-3 rounded-xl bg-[#161422] border border-[#2D2642] text-xs font-mono text-neutral-400">
              Final Score: <span className="text-amber-400 font-bold tabular-nums">{score} Sparks</span>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-[#DCD0FF] text-[#1E192D] text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                Replay Journey
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl border border-white/20 text-neutral-300 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
