import { useState, useEffect, useCallback } from 'react';

const PRESETS = [2, 5, 10, 15] as const;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

const Timer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [customInput, setCustomInput] = useState('');
  const [sessionDoneMessage, setSessionDoneMessage] = useState(false);

  const setDuration = useCallback((minutes: number) => {
    if (isRunning) return;
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.floor(minutes)));
    const sec = clamped * 60;
    setTotalSeconds(sec);
    setRemaining(sec);
    setSelectedMinutes(clamped);
    setCustomInput(PRESETS.includes(clamped as typeof PRESETS[number]) ? '' : String(clamped));
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setIsRunning(false);
          setSessionDoneMessage(true);
          setTimeout(() => setSessionDoneMessage(false), 4000);
          return totalSeconds; // reset display to full duration
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, remaining]);

  const toggle = () => {
    if (remaining <= 0) {
      setRemaining(totalSeconds);
    }
    setIsRunning((r) => !r);
  };

  const buttonLabel = remaining <= 0 && !isRunning
    ? 'Start being bored'
    : isRunning
      ? 'Pause boredom'
      : 'Resume';

  return (
    <>
      <p className="section-label">Your boredom session</p>
      <div className={`timer-display ${isRunning ? 'running' : ''}`}>
        {formatTime(remaining)}
      </div>
      <div className="timer-controls">
        {PRESETS.map((min) => (
          <button
            key={min}
            type="button"
            className={`btn btn-preset ${selectedMinutes === min ? 'active' : ''}`}
            onClick={() => { setDuration(min); setCustomInput(''); }}
          >
            {min} min
          </button>
        ))}
      </div>
      <div className="timer-custom">
        <label htmlFor="custom-minutes" className="timer-custom-label">
          Custom
        </label>
        <input
          id="custom-minutes"
          type="number"
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          className="timer-custom-input"
          placeholder="min"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onBlur={() => {
            const n = parseInt(customInput, 10);
            if (!Number.isNaN(n) && n >= MIN_MINUTES && n <= MAX_MINUTES) {
              setDuration(n);
            } else {
              setCustomInput(PRESETS.includes(selectedMinutes as typeof PRESETS[number]) ? '' : String(selectedMinutes));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          disabled={isRunning}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={toggle}>
        {buttonLabel}
      </button>
      {sessionDoneMessage && (
        <p className="section-hint" style={{ color: 'var(--success)' }}>
          Session done. You were bored. Well done. 🦥
        </p>
      )}
      {!sessionDoneMessage && (
        <p className="section-hint">Permission to do nothing. Really.</p>
      )}
    </>
  );
};

export default Timer;
