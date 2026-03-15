import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Timer, BookOpen, Brain, Sparkles, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">StudyBoost</span>
            </div>
            <button 
              onClick={onStart}
              className="bg-white text-black hover:bg-white/90 px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
              Sign In with Google
            </button>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                The Ultimate Study Companion
              </span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                Master Your Studies with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">AI Precision</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                Focus better, remember faster, and organize smarter. StudyBoost brings all your essential study tools into one powerful dashboard.
              </p>
              <div className="flex flex-col items-center justify-center gap-4">
                <button 
                  onClick={onStart}
                  className="w-full max-w-md bg-white text-black hover:bg-white/90 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all shadow-xl shadow-white/10 group"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  Continue with Google
                </button>
                <p className="text-white/40 text-sm">Join thousands of students boosting their productivity.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Timer size={32} />}
            title="Smart Timer"
            description="Focus-driven Pomodoro timer with progress tracking and breaks."
            color="text-purple-400"
          />
          <FeatureCard 
            icon={<BookOpen size={32} />}
            title="Quick Notes"
            description="Organize your thoughts instantly with subject-labeled notes."
            color="text-blue-400"
          />
          <FeatureCard 
            icon={<Brain size={32} />}
            title="Flashcards"
            description="Boost memory retention with interactive study cards."
            color="text-emerald-400"
          />
          <FeatureCard 
            icon={<Sparkles size={32} />}
            title="AI Explainer"
            description="Complex topics simplified in seconds using advanced AI."
            color="text-amber-400"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-white/5 text-center text-white/20 text-sm">
        <p>&copy; 2026 StudyBoost. All rights reserved.</p>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group">
      <div className={`${color} mb-6 transform group-hover:scale-110 transition-transform`}>{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
