/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  User, 
  LogOut, 
  Search, 
  Bell,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer } from './components/Timer';
import { Notes } from './components/Notes';
import { AIHelper } from './components/AIHelper';
import { Flashcards } from './components/Flashcards';
import { Motivation } from './components/Motivation';
import { MusicPlayer } from './components/MusicPlayer';
import { Landing } from './components/Landing';
import { StudyPlanner } from './components/StudyPlanner';

type Page = 'landing' | 'dashboard' | 'progress' | 'profile';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('landing');

  const handleSessionComplete = (type: string, duration: number) => {
    console.log(`Session complete: ${type} for ${duration} mins`);
    // Will integrate with Firebase later
  };

  if (activePage === 'landing') {
    return <Landing onStart={() => setActivePage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-purple-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#0d0d26] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden md:block">StudyBoost</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => setActivePage('dashboard')} 
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Progress" 
            active={activePage === 'progress'} 
            onClick={() => setActivePage('progress')} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Profile" 
            active={activePage === 'profile'} 
            onClick={() => setActivePage('profile')} 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20 md:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a1a]/80 backdrop-blur-md z-40">
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search your notes, cards, or subjects..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0a0a1a]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alex Johnson</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
                  <img src="https://picsum.photos/seed/student/100/100" alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-12 gap-8"
              >
                {/* Left Column: Timer & AI Helper */}
                <div className="xl:col-span-4 space-y-8">
                  <Timer onSessionComplete={handleSessionComplete} />
                  <AIHelper />
                </div>

                {/* Middle Column: Notes & Flashcards */}
                <div className="xl:col-span-5 space-y-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-[450px]">
                    <Notes />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-[400px]">
                    <Flashcards />
                  </div>
                </div>

                {/* Right Column: Motivation & Music */}
                <div className="xl:col-span-3 space-y-8">
                  <Motivation />
                  <MusicPlayer />
                  <StudyPlanner />
                </div>
              </motion.div>
            )}

            {activePage === 'progress' && (
              <motion.div 
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-[60vh] text-white/20"
              >
                <BarChart3 size={64} className="mb-4 opacity-10" />
                <h2 className="text-2xl font-bold text-white mb-2">Progress Tracking</h2>
                <p>Detailed analytics and study history coming soon.</p>
              </motion.div>
            )}

            {activePage === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-[60vh] text-white/20"
              >
                <User size={64} className="mb-4 opacity-10" />
                <h2 className="text-2xl font-bold text-white mb-2">User Profile</h2>
                <p>Manage your account and preferences here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      <span className={`${active ? 'text-white' : 'group-hover:text-purple-400'} transition-colors`}>{icon}</span>
      <span className="font-medium hidden md:block">{label}</span>
    </button>
  );
}

function PlannerItem({ day, subject, status }: { day: string, subject: string, status: 'completed' | 'pending' }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-purple-400 w-8">{day}</span>
        <span className="text-sm font-medium">{subject}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-white/10'}`} />
    </div>
  );
}
