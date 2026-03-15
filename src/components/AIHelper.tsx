import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, Loader2, BookOpen, Lightbulb, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const AIHelper: React.FC = () => {
  const [input, setInput] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'simple' | 'detailed' | 'notes'>('simple');

  const handleExplain = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setExplanation(null);

    try {
      const prompt = mode === 'simple' 
        ? `Explain "${input}" like I'm 10 years old with simple analogies.`
        : mode === 'detailed'
        ? `Provide a detailed academic explanation of "${input}" with examples and key concepts.`
        : `Create structured study notes for "${input}" including bullet points and a summary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setExplanation(response.text || "Sorry, I couldn't generate an explanation.");
    } catch (error) {
      console.error("AI Error:", error);
      setExplanation("An error occurred while generating the explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-400" size={24} />
        <h2 className="text-2xl font-bold text-white">AI Explainer</h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
        <textarea 
          placeholder="Paste a concept or question you want to understand..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent text-white placeholder:text-white/20 resize-none h-24 focus:outline-none text-sm"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('simple')}
              className={`p-2 rounded-lg transition-all ${mode === 'simple' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              title="Explain like I'm 10"
            >
              <Lightbulb size={18} />
            </button>
            <button 
              onClick={() => setMode('detailed')}
              className={`p-2 rounded-lg transition-all ${mode === 'detailed' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              title="Detailed Explanation"
            >
              <BookOpen size={18} />
            </button>
            <button 
              onClick={() => setMode('notes')}
              className={`p-2 rounded-lg transition-all ${mode === 'notes' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              title="Create Study Notes"
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={handleExplain}
            disabled={isLoading || !input.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Explain
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {explanation ? (
            <motion.div 
              key="explanation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80 text-sm leading-relaxed whitespace-pre-wrap"
            >
              <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                <Sparkles size={12} />
                AI Generated {mode === 'simple' ? 'Simple' : mode === 'detailed' ? 'Detailed' : 'Notes'}
              </div>
              {explanation}
            </motion.div>
          ) : !isLoading && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-8 text-white/20"
            >
              <Sparkles size={48} className="mb-4 opacity-10" />
              <p className="text-sm">Enter a topic above and I'll help you understand it better.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
