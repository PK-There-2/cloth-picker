import React, { useState, useRef, useEffect } from 'react';
import type { ClothingItem, StyleProfile, ChatMessage } from '../../types';
import { LoaderIcon, ArrowRightIcon } from '../icons';
import { chatWithStylist } from '../../services/geminiService';

interface ChatTabProps {
  items: ClothingItem[];
  profile: StyleProfile;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  text: 'Hi! I am Persona, your personal AI Stylist. Ask me anything about what to wear, styling rules, or suggestions for your next event.',
};

const QUICK_PROMPTS = [
  {
    emoji: '💼',
    label: 'Business Meeting',
    text: 'What would be a suitable outfit matching items from my closet for a business meeting?',
  },
  {
    emoji: '🎨',
    label: 'Complexion Color Harmony',
    text: 'What color palette complements my medium/olive complexion?',
  },
  {
    emoji: '❄️',
    label: 'Cold Weather Formulas',
    text: 'Suggest layering formulas for cold winter morning weather.',
  },
];

const ChatTab: React.FC<ChatTabProps> = ({ items, profile }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ─── Send Message ───────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const wardrobeContext = items
        .map((i) => `${i.title} (${i.type}, ${i.color})`)
        .join(', ');
      const aiResponse = await chatWithStylist(text, profile, wardrobeContext);
      setMessages((prev) => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Apologies, I encountered a brief styling calculation error. Please input your request once more.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[600px] bg-stone-900/40 rounded-2xl border border-stone-800/60 overflow-hidden flex flex-col shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="bg-stone-950/40 px-6 py-4 border-b border-stone-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-200">
              Persona Style Assistant
            </h3>
            <p className="text-[10px] text-stone-400 font-light">
              Interactive advice built using items currently in your closet
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-amber-500 text-stone-950 font-bold self-end rounded-br-none shadow'
                : 'bg-stone-950 text-stone-200 self-start rounded-bl-none border border-stone-800/60'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-stone-950 text-stone-400 self-start p-4 rounded-2xl rounded-bl-none border border-stone-800/60 flex items-center gap-3">
            <LoaderIcon />
            <span className="text-[11px] font-medium tracking-wide">
              Reviewing wardrobe color harmonies...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="p-3 bg-stone-950/60 border-t border-stone-800/50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => setChatInput(qp.text)}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-[10px] text-stone-300 font-semibold"
          >
            {qp.emoji} {qp.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-stone-950 border-t border-stone-800/60 flex items-center gap-3"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask standard style formulas, combinations, or capsule metrics..."
          className="flex-1 bg-stone-900 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100"
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || loading}
          className="p-3 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-900 text-stone-950 font-bold rounded-xl transition-all"
        >
          <ArrowRightIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatTab;
