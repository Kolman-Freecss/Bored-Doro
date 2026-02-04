import { useRef, useEffect, useState, useCallback } from 'react';

const WIDTH = 600;
const HEIGHT = 200;
const GROUND_Y = HEIGHT - 40;
const BONE_SPAWN_INTERVAL = 90;
const BONE_SPEED_MIN = 4;
const BONE_SPEED_MAX = 10;
const BONE_WIDTH = 24;
const BONE_HEIGHT = 20;
const BONE_GAP = 130; // gap between bones so player can land and jump again (2 or 3 skippable)

const GAME_COLORS = {
  light: {
    bg: '#e8e8e0',
    ground: '#c4b5a0',
    groundLine: '#a89882',
    slothBody: '#6b7b6e',
    slothArms: '#5a6a5d',
    slothEye: '#2d2a26',
    bone: '#8a8078',
    boneStroke: '#6b6560',
    overlay: 'rgba(45, 42, 38, 0.7)',
    text: '#2d2a26',
  },
  dark: {
    bg: '#1a1a1a',
    ground: '#2a2a2a',
    groundLine: '#3a3a3a',
    slothBody: '#7a8a7d',
    slothArms: '#6a7a6d',
    slothEye: '#f5f5f5',
    bone: '#c0c0c0',
    boneStroke: '#888',
    overlay: 'rgba(0, 0, 0, 0.75)',
    text: '#f5f5f5',
  },
} as const;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface GameProps {
  theme: 'light' | 'dark';
}

const Game: React.FC<GameProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayContent, setOverlayContent] = useState<'start' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const gameStateRef = useRef<{
    runner: { x: number; y: number; vy: number; onGround: boolean };
    bones: Array<{ x: number; y: number; width: number; height: number }>;
    boneCounter: number;
    gameOver: boolean;
    score: number;
    speed: number;
    frames: number;
  } | null>(null);
  const rafRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    if (!state) return;
    state.runner.y = GROUND_Y - 40;
    state.runner.vy = 0;
    state.runner.onGround = true;
    state.bones.length = 0;
    state.boneCounter = 0;
    state.gameOver = false;
    state.score = 0;
    state.speed = BONE_SPEED_MIN;
    state.frames = 0;
    setScore(0);
    setShowOverlay(false);
    setOverlayContent('start');
  }, []);

  const startGame = useCallback(() => {
    gameStateRef.current = {
      runner: { x: 60, y: GROUND_Y - 40, vy: 0, onGround: true },
      bones: [],
      boneCounter: 0,
      gameOver: false,
      score: 0,
      speed: BONE_SPEED_MIN,
      frames: 0,
    };
    setScore(0);
    setShowOverlay(false);
    canvasRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = GAME_COLORS[theme];
    const runner = { x: 60, width: 36, height: 40, jumpForce: -14, gravity: 0.8 };

    const drawGround = () => {
      ctx.fillStyle = colors.ground;
      ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
      ctx.strokeStyle = colors.groundLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(WIDTH, GROUND_Y);
      ctx.stroke();
    };

    const drawSloth = (y: number) => {
      const w = runner.width;
      const h = runner.height;
      const x = runner.x;
      ctx.fillStyle = colors.slothBody;
      roundRect(ctx, x + 6, y + h * 0.4, w - 12, h * 0.5, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + w * 0.5, y + h * 0.22, w * 0.38, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.slothArms;
      ctx.beginPath();
      ctx.ellipse(x + w * 0.2, y + h * 0.5, 6, 14, 0.4, 0, Math.PI * 2);
      ctx.ellipse(x + w * 0.8, y + h * 0.5, 6, 14, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.slothEye;
      ctx.beginPath();
      ctx.arc(x + w * 0.52, y + h * 0.2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBone = (b: { x: number; y: number; width: number; height: number }) => {
      ctx.fillStyle = colors.bone;
      ctx.strokeStyle = colors.boneStroke;
      ctx.lineWidth = 2;
      roundRect(ctx, b.x, b.y, b.width, b.height, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x + 4, b.y + b.height / 2, 4, 0, Math.PI * 2);
      ctx.arc(b.x + b.width - 4, b.y + b.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    const collides = (
      a: { x: number; y: number; width: number; height: number },
      b: { x: number; y: number; width: number; height: number }
    ) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;

    const jump = () => {
      const state = gameStateRef.current;
      if (!state || state.gameOver) return;
      if (state.runner.onGround) {
        state.runner.vy = runner.jumpForce;
        state.runner.onGround = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const state = gameStateRef.current;
        if (state?.gameOver) resetGame();
        else jump();
      }
    };

    const handlePointer = () => {
      const state = gameStateRef.current;
      if (state?.gameOver) resetGame();
      else jump();
    };

    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handlePointer);
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handlePointer();
    }, { passive: false });

    const gameLoop = () => {
      const state = gameStateRef.current;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      drawGround();

      if (!state) {
        rafRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (state.gameOver) {
        drawSloth(state.runner.y);
        state.bones.forEach(drawBone);
        ctx.fillStyle = colors.overlay;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 24px Outfit, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bored yet? 🦥', WIDTH / 2, HEIGHT / 2 - 10);
        ctx.font = '16px Outfit, system-ui, sans-serif';
        ctx.fillText('Score: ' + state.score, WIDTH / 2, HEIGHT / 2 + 20);
        ctx.fillText('Tap or Space to play again', WIDTH / 2, HEIGHT / 2 + 50);
        rafRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      state.runner.vy += runner.gravity;
      state.runner.y += state.runner.vy;
      if (state.runner.y >= GROUND_Y - runner.height) {
        state.runner.y = GROUND_Y - runner.height;
        state.runner.vy = 0;
        state.runner.onGround = true;
      }

      state.frames++;
      if (state.frames % 120 === 0 && state.speed < BONE_SPEED_MAX) {
        state.speed = Math.min(BONE_SPEED_MAX, state.speed + 0.25);
      }

      state.boneCounter++;
      if (state.boneCounter >= BONE_SPAWN_INTERVAL) {
        state.boneCounter = 0;
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          state.bones.push({
            x: WIDTH + i * (BONE_WIDTH + BONE_GAP),
            y: GROUND_Y - BONE_HEIGHT - 4,
            width: BONE_WIDTH,
            height: BONE_HEIGHT,
          });
        }
      }

      for (let i = state.bones.length - 1; i >= 0; i--) {
        state.bones[i].x -= state.speed;
        if (state.bones[i].x + state.bones[i].width < 0) {
          state.bones.splice(i, 1);
          state.score++;
          setScore(state.score);
          continue;
        }
        if (
          collides(
            { x: runner.x, y: state.runner.y, width: runner.width, height: runner.height },
            state.bones[i]
          )
        ) {
          state.gameOver = true;
          setOverlayContent('gameover');
          setShowOverlay(true);
          setScore(state.score);
        }
      }

      drawSloth(state.runner.y);
      state.bones.forEach(drawBone);
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handlePointer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme, resetGame]);

  return (
    <div className="game-wrapper">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={WIDTH}
        height={HEIGHT}
        tabIndex={0}
        style={{ outline: 'none' }}
      />
      <div className={`game-overlay ${showOverlay ? '' : 'hidden'}`}>
        {overlayContent === 'start' && (
          <>
            <p>Press <kbd>Space</kbd> or tap to jump</p>
            <button type="button" className="btn btn-primary" onClick={startGame}>
              Play
            </button>
          </>
        )}
        {overlayContent === 'gameover' && (
          <>
            <p>Score: {score}</p>
            <button type="button" className="btn btn-primary" onClick={resetGame}>
              Play again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
