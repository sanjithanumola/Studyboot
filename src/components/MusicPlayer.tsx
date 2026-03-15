import React, { useState } from 'react';
import { CloudRain, Coffee, Wind, Waves, Volume2, VolumeX } from 'lucide-react';

const SOUNDS = [
  { id: 'rain', name: 'Rain', icon: CloudRain, color: 'text-blue-400' },
  { id: 'cafe', name: 'Cafe', icon: Coffee, color: 'text-amber-400' },
  { id: 'wind', name: 'Wind', icon: Wind, color: 'text-slate-400' },
  { id: 'waves', name: 'Waves', icon: Waves, color: 'text-cyan-400' },
];

export const MusicPlayer: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Volume2 size={18} className="text-purple-400" />
          Focus Sounds
        </h3>
        {activeSound && (
          <button 
            onClick={() => setActiveSound(null)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <VolumeX size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border ${
              activeSound === sound.id 
                ? 'bg-purple-500/20 border-purple-500/50 text-white' 
                : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
            }`}
          >
            <sound.icon size={24} className={activeSound === sound.id ? sound.color : ''} />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-2">{sound.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>Volume</span>
          <span>{volume}%</span>
        </div>
        <input 
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
    </div>
  );
};
