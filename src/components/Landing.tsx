import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Timer, BookOpen, Brain, Sparkles, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

export const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 pb-24 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">StudyBoost</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                The Ultimate Study Companion
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Master Your Studies with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">AI Precision</span>
              </h1>
              <p className="text-lg text-white/60 mb-8 max-w-xl leading-relaxed">
                Focus better, remember faster, and organize smarter. StudyBoost brings all your essential study tools into one powerful dashboard.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-purple-400 mb-2"><Timer size={24} /></div>
                  <div className="text-sm font-bold">Focus Timer</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-blue-400 mb-2"><Sparkles size={24} /></div>
                  <div className="text-sm font-bold">AI Explainer</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0d0d26] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-purple-500/5 relative"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-white/40 text-sm">
                  {isLogin ? 'Enter your credentials to access your dashboard' : 'Join thousands of students boosting their productivity'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                    <AlertCircle size={14} />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span className="text-purple-400 font-bold">{isLogin ? 'Sign Up' : 'Log In'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
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
