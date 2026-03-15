import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface TimerProps {
  onSessionComplete: (type: 'focus' | 'short-break' | 'long-break', duration: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ onSessionComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          handleTimerComplete();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    const duration = mode === 'focus' ? 25 : mode === 'short-break' ? 5 : 15;
    onSessionComplete(mode, duration);

    if (mode === 'focus') {
      const nextSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(nextSessionCount);
      if (nextSessionCount % 4 === 0) {
        setMode('long-break');
        setMinutes(15);
      } else {
        setMode('short-break');
        setMinutes(5);
      }
    } else {
      setMode('focus');
      setMinutes(25);
    }
    setSeconds(0);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') setMinutes(25);
    else if (mode === 'short-break') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  const progress = ((mode === 'focus' ? 25 * 60 : (mode === 'short-break' ? 5 : 15) * 60) - (minutes * 60 + seconds)) / (mode === 'focus' ? 25 * 60 : (mode === 'short-break' ? 5 : 15) * 60) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center border border-white/20 shadow-xl">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => { setMode('focus'); setMinutes(25); setSeconds(0); setIsActive(false); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'focus' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          Focus
        </button>
        <button 
          onClick={() => { setMode('short-break'); setMinutes(5); setSeconds(0); setIsActive(false); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'short-break' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          Short Break
        </button>
        <button 
          onClick={() => { setMode('long-break'); setMinutes(15); setSeconds(0); setIsActive(false); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'long-break' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          Long Break
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={754}
            initial={{ strokeDashoffset: 754 }}
            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
            className={mode === 'focus' ? 'text-purple-500' : mode === 'short-break' ? 'text-emerald-500' : 'text-blue-500'}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-bold text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-white/40 text-sm mt-2 uppercase tracking-widest">
            {mode === 'focus' ? 'Stay Focused' : 'Take a Break'}
          </span>
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-all"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={toggleTimer}
          className={`p-6 rounded-full transition-all transform hover:scale-105 active:scale-95 ${isActive ? 'bg-white text-purple-900' : 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'}`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <div className="p-4 rounded-full bg-white/5 text-white/60 flex items-center gap-2">
          <Brain size={20} />
          <span className="font-bold">{sessionsCompleted}</span>
        </div>
      </div>
    </div>
  );
};
