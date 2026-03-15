import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Tag } from 'lucide-react';
import { Note, Subject } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, useLocalStorage } from '../supabase';

const SUBJECT_COLORS: Record<Subject, string> = {
  Math: 'bg-blue-500',
  Science: 'bg-emerald-500',
  History: 'bg-amber-500',
  Coding: 'bg-purple-500',
  Other: 'bg-slate-500',
};

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    subject: 'Other',
  });

  useEffect(() => {
    fetchNotes();

    if (!useLocalStorage) {
      const channel = supabase
        .channel('notes_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
          fetchNotes();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchNotes = async () => {
    if (useLocalStorage) {
      const localNotes = localStorage.getItem('studyboost_notes');
      if (localNotes) {
        setNotes(JSON.parse(localNotes));
      }
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('uid', user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Supabase Error (Notes):", error);
    } else {
      setNotes(data as Note[]);
    }
  };

  const addNote = async () => {
    if (!newNote.title || !newNote.content) return;

    if (useLocalStorage) {
      const note: Note = {
        id: Math.random().toString(36).substr(2, 9),
        uid: 'guest',
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject as Subject,
        color: SUBJECT_COLORS[newNote.subject as Subject],
        createdAt: Date.now(),
      };
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem('studyboost_notes', JSON.stringify(updatedNotes));
      setNewNote({ title: '', content: '', subject: 'Other' });
      setIsAdding(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    try {
      const { error } = await supabase.from('notes').insert([{
        uid: user.id,
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject as Subject,
        color: SUBJECT_COLORS[newNote.subject as Subject],
        createdAt: Date.now(),
      }]);
      
      if (error) throw error;

      setNewNote({ title: '', content: '', subject: 'Other' });
      setIsAdding(false);
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    if (useLocalStorage) {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('studyboost_notes', JSON.stringify(updatedNotes));
      return;
    }

    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Quick Notes</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-xl transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input 
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4"
            >
              <input 
                type="text"
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full bg-transparent text-white font-bold text-lg mb-2 focus:outline-none"
              />
              <textarea 
                placeholder="Type your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full bg-transparent text-white/80 text-sm h-24 resize-none focus:outline-none mb-4"
              />
              <div className="flex items-center justify-between">
                <select 
                  value={newNote.subject}
                  onChange={(e) => setNewNote({ ...newNote, subject: e.target.value as Subject })}
                  className="bg-white/5 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  {Object.keys(SUBJECT_COLORS).map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setIsAdding(false)} className="text-white/40 text-xs hover:text-white">Cancel</button>
                  <button onClick={addNote} className="bg-purple-500 text-white px-4 py-1 rounded-lg text-xs font-bold">Save</button>
                </div>
              </div>
            </motion.div>
          )}

          {filteredNotes.map(note => (
            <motion.div 
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${note.color}`} />
                  <h3 className="font-bold text-white">{note.title}</h3>
                </div>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-white/60 text-sm line-clamp-3 mb-3">{note.content}</p>
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-white/20" />
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{note.subject}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
