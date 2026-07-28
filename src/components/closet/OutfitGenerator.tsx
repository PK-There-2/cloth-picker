import { useState } from 'react';
import type { ClothingItem, Outfit, StyleProfile, TabId } from '../../types';
import { SparklesIcon, LoaderIcon } from '../icons';
import { generateOutfit } from '../../services/geminiService';

interface OutfitGeneratorProps {
  items: ClothingItem[];
  profile: StyleProfile;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onTabChange: (tab: TabId) => void;
  onOutfitAdded: (outfit: Omit<Outfit, 'id'>) => Promise<void>;
}

const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({
  items, profile, showToast, onTabChange, onOutfitAdded,
}) => {
  const [generating, setGenerating] = useState(false);
  const [weather, setWeather] = useState('Sunny & Warm');
  const [occasion, setOccasion] = useState('Casual Hangout');

  const handleGenerate = async () => {
    if (items.length < 2) {
      showToast('Please register at least 2 distinct clothing pieces to unlock styling formulas!', 'error');
      return;
    }
    setGenerating(true);
    try {
      const result = await generateOutfit(items, profile, weather, occasion);
      await onOutfitAdded({
        title: result.title,
        selectedItemIds: result.selectedItemIds,
        stylingTip: result.stylingTip,
        occasion, weather,
        createdAt: new Date().toISOString(),
      });
      showToast('New outfit combination matched and stored!', 'success');
      onTabChange('history');
    } catch (err) {
      console.error(err);
      showToast('Could not curate outfit combination. Check your internet connection.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800/60 shadow-2xl relative">
      <div className="absolute top-4 right-4 text-amber-500 opacity-20"><SparklesIcon /></div>
      <h3 className="text-xl font-bold mb-1">Generate Curated Looks</h3>
      <p className="text-xs text-stone-400 mb-6">Persona matches colors, fabrics, and fit variables from your registered closet inventory database.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] text-stone-400 uppercase tracking-widest block mb-2 font-semibold">Target Event / Occasion</label>
          <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="e.g. Gallery Opening, Boardroom Presentation" className="w-full bg-stone-900 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100" />
        </div>
        <div>
          <label className="text-[10px] text-stone-400 uppercase tracking-widest block mb-2 font-semibold">Weather Blueprint</label>
          <input type="text" value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="e.g. Cool Rainy Evening, Crisp Winter Morning" className="w-full bg-stone-900 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100" />
        </div>
      </div>
      <button onClick={handleGenerate} disabled={generating} className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-900 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 justify-center w-full md:w-auto shadow-md">
        {generating ? <LoaderIcon /> : <SparklesIcon />}
        {generating ? 'Styling...' : 'Synthesize Outfit'}
      </button>
    </div>
  );
};

export default OutfitGenerator;
