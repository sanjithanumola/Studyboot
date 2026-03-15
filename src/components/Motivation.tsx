import React, { useState, useEffect } from 'react';
import { Quote, Flame, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOTIVATIONAL_QUOTES = [
  "Small progress is still progress.",
  "Focus now, relax later.",
  "Your future self will thank you.",
  "Don't stop until you're proud.",
  "Success is the sum of small efforts repeated daily.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Believe you can and you're halfway there.",
];

export const Motivation: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [streak, setStreak] = useState(5); // Mock streak

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-purple-900/20 relative overflow-hidden group">
        <Quote className="absolute -top-4 -left-4 text-white/10 w-24 h-24 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        <div className="relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-2 block">Daily Motivation</span>
          <p className="text-xl font-medium text-white leading-tight italic">"{quote}"</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
            <Flame size={24} fill="currentColor" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Study Streak</span>
            <span className="text-2xl font-bold text-white">{streak} Days</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Trophy size={24} fill="currentColor" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Rank</span>
            <span className="text-2xl font-bold text-white">Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
