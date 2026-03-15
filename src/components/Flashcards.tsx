import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, RotateCw, Brain } from 'lucide-react';
import { Flashcard, Subject } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, useLocalStorage } from '../supabase';

const SUBJECT_COLORS: Record<Subject, string> = {
  Math: 'bg-blue-500',
  Science: 'bg-emerald-500',
  History: 'bg-amber-500',
  Coding: 'bg-purple-500',
  Other: 'bg-slate-500',
};

export const Flashcards: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState<Partial<Flashcard>>({
    front: '',
    back: '',
    subject: 'Other',
  });

  useEffect(() => {
    fetchCards();

    if (!useLocalStorage) {
      const channel = supabase
        .channel('flashcards_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'flashcards' }, () => {
          fetchCards();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchCards = async () => {
    if (useLocalStorage) {
      const localCards = localStorage.getItem('studyboost_flashcards');
      if (localCards) {
        setCards(JSON.parse(localCards));
      }
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('uid', user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Supabase Error (Flashcards):", error);
    } else {
      setCards(data as Flashcard[]);
    }
  };

  const addCard = async () => {
    if (!newCard.front || !newCard.back) return;

    if (useLocalStorage) {
      const card: Flashcard = {
        id: Math.random().toString(36).substr(2, 9),
        uid: 'guest',
        front: newCard.front,
        back: newCard.back,
        subject: newCard.subject as Subject,
        createdAt: Date.now(),
      };
      const updatedCards = [card, ...cards];
      setCards(updatedCards);
      localStorage.setItem('studyboost_flashcards', JSON.stringify(updatedCards));
      setNewCard({ front: '', back: '', subject: 'Other' });
      setIsAdding(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const { error } = await supabase.from('flashcards').insert([{
        uid: user.id,
        front: newCard.front,
        back: newCard.back,
        subject: newCard.subject as Subject,
        createdAt: Date.now(),
      }]);

      if (error) throw error;

      setNewCard({ front: '', back: '', subject: 'Other' });
      setIsAdding(false);
      fetchCards();
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const deleteCard = async (id: string) => {
    if (useLocalStorage) {
      const updatedCards = cards.filter(c => c.id !== id);
      setCards(updatedCards);
      localStorage.setItem('studyboost_flashcards', JSON.stringify(updatedCards));
      if (currentIndex >= updatedCards.length && updatedCards.length > 0) {
        setCurrentIndex(updatedCards.length - 1);
      }
      return;
    }

    try {
      const { error } = await supabase.from('flashcards').delete().eq('id', id);
      if (error) throw error;

      if (currentIndex >= cards.length - 1 && cards.length > 1) {
        setCurrentIndex(cards.length - 2);
      }
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="text-purple-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Flashcards</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-xl transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            key="add-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/10 border border-white/20 rounded-3xl p-6"
          >
            <h3 className="text-white font-bold mb-4">Create New Card</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-[10px] uppercase font-bold mb-1 block">Front (Question)</label>
                <textarea 
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none h-20"
                />
              </div>
              <div>
                <label className="text-white/40 text-[10px] uppercase font-bold mb-1 block">Back (Answer)</label>
                <textarea 
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none h-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <select 
                  value={newCard.subject}
                  onChange={(e) => setNewCard({ ...newCard, subject: e.target.value as Subject })}
                  className="bg-white/5 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  {Object.keys(SUBJECT_COLORS).map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setIsAdding(false)} className="text-white/40 text-xs hover:text-white">Cancel</button>
                  <button onClick={addCard} className="bg-purple-500 text-white px-4 py-1 rounded-lg text-xs font-bold">Create</button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : cards.length > 0 ? (
          <motion.div 
            key="study-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-full perspective-1000 h-64 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <motion.div 
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold text-white uppercase ${SUBJECT_COLORS[cards[currentIndex].subject]}`}>
                    {cards[currentIndex].subject}
                  </div>
                  <p className="text-xl font-medium text-white">{cards[currentIndex].front}</p>
                  <div className="absolute bottom-4 text-white/20 flex items-center gap-2 text-xs">
                    <RotateCw size={12} /> Click to flip
                  </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-purple-600 border border-purple-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
                  <p className="text-xl font-medium text-white">{cards[currentIndex].back}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-8 mt-8">
              <button 
                onClick={(e) => { e.stopPropagation(); prevCard(); }}
                className="p-3 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-white/40 font-mono text-sm">
                {currentIndex + 1} / {cards.length}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); nextCard(); }}
                className="p-3 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <button 
              onClick={() => deleteCard(cards[currentIndex].id)}
              className="mt-6 text-white/20 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete this card
            </button>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/20">
            <Brain size={48} className="mb-4 opacity-10" />
            <p className="text-sm mb-4">You haven't created any flashcards yet.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-white/5 hover:bg-white/10 text-white/60 px-4 py-2 rounded-xl text-xs transition-all"
            >
              Create your first card
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
