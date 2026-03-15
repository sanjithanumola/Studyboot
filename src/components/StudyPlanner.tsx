import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, useLocalStorage } from '../supabase';
import { StudyPlan } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const StudyPlanner: React.FC = () => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ day: 'Mon', subject: '' });

  useEffect(() => {
    fetchPlans();

    if (!useLocalStorage) {
      const channel = supabase
        .channel('planner_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'planner' }, () => {
          fetchPlans();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchPlans = async () => {
    if (useLocalStorage) {
      const localPlans = localStorage.getItem('studyboost_plans');
      if (localPlans) {
        setPlans(JSON.parse(localPlans));
      }
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('planner')
      .select('*')
      .eq('uid', user.id)
      .order('createdAt', { ascending: true });

    if (error) {
      console.error("Supabase Error (Planner):", error);
    } else {
      setPlans(data as StudyPlan[]);
    }
  };

  const addPlan = async () => {
    if (!newPlan.subject) return;

    if (useLocalStorage) {
      const plan: StudyPlan = {
        id: Math.random().toString(36).substr(2, 9),
        uid: 'guest',
        day: newPlan.day,
        subject: newPlan.subject,
        status: 'pending',
        createdAt: Date.now(),
      };
      const updatedPlans = [...plans, plan];
      setPlans(updatedPlans);
      localStorage.setItem('studyboost_plans', JSON.stringify(updatedPlans));
      setNewPlan({ day: 'Mon', subject: '' });
      setIsAdding(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const { error } = await supabase.from('planner').insert([{
        uid: user.id,
        day: newPlan.day,
        subject: newPlan.subject,
        status: 'pending',
        createdAt: Date.now(),
      }]);

      if (error) throw error;

      setNewPlan({ day: 'Mon', subject: '' });
      setIsAdding(false);
      fetchPlans();
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    if (useLocalStorage) {
      const updatedPlans = plans.map(p => p.id === id ? { ...p, status: newStatus } : p);
      setPlans(updatedPlans);
      localStorage.setItem('studyboost_plans', JSON.stringify(updatedPlans));
      return;
    }

    try {
      const { error } = await supabase
        .from('planner')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <BookOpen size={18} className="text-purple-400" />
          Study Planner
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 rounded-xl p-3 border border-purple-500/30 mb-2"
            >
              <div className="flex gap-2 mb-2">
                <select 
                  value={newPlan.day}
                  onChange={(e) => setNewPlan({ ...newPlan, day: e.target.value })}
                  className="bg-slate-900 text-white text-[10px] rounded px-1 py-1 focus:outline-none"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input 
                  type="text"
                  placeholder="Subject..."
                  value={newPlan.subject}
                  onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAdding(false)} className="text-[10px] text-white/40">Cancel</button>
                <button onClick={addPlan} className="text-[10px] text-purple-400 font-bold">Add</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => toggleStatus(plan.id, plan.status)}
            className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-purple-400 w-8">{plan.day}</span>
              <span className={`text-sm font-medium transition-all ${plan.status === 'completed' ? 'text-white/20 line-through' : 'text-white'}`}>
                {plan.subject}
              </span>
            </div>
            {plan.status === 'completed' ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <Circle size={16} className="text-white/10 group-hover:text-white/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
