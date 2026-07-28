import type { Outfit, ClothingItem, TabId } from '../../types';
import { HistoryIcon, TrashIcon, ShirtIcon } from '../icons';

interface HistoryTabProps {
  outfits: Outfit[];
  items: ClothingItem[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  onTabChange: (tab: TabId) => void;
  onOutfitRemoved: (outfitId: string) => Promise<void>;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ outfits, items, showToast, onTabChange, onOutfitRemoved }) => {
  const handleDelete = async (outfitId: string) => {
    try {
      await onOutfitRemoved(outfitId);
      showToast('Combination discarded successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error removing design combination.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold">Saved Outfits History</h2>
        <p className="text-sm text-stone-400">View outfit formulas generated dynamically to match your styling context.</p>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/20 rounded-2xl border border-stone-800/60">
          <div className="w-16 h-16 bg-stone-900 text-stone-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-800"><HistoryIcon /></div>
          <h3 className="text-lg font-bold">No generated outfits yet</h3>
          <p className="text-xs text-stone-500 mt-2">Generate outfits under "Add Clothes & Style" tab using your current closet inventory.</p>
          <button onClick={() => onTabChange('closet')} className="mt-6 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-300 text-xs border border-stone-800">Generate Style Combos</button>
        </div>
      ) : (
        <div className="space-y-8">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800/60 flex flex-col lg:flex-row gap-8 shadow-xl relative">
              <div className="absolute top-4 right-4">
                <button onClick={() => handleDelete(outfit.id)} className="p-2 bg-stone-950 hover:bg-rose-950 border border-stone-800 rounded-xl text-rose-300 transition-colors" title="Discard formula"><TrashIcon /></button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-500/20">{outfit.occasion}</span>
                  <span className="text-[10px] bg-stone-900 text-stone-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-stone-800">{outfit.weather}</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-amber-100">{outfit.title}</h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-light">{outfit.stylingTip}</p>
              </div>
              <div className="lg:w-80 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-stone-800 pt-4 lg:pt-0 lg:pl-6">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-3 font-semibold">Matched items:</span>
                <div className="grid grid-cols-1 gap-2.5">
                  {outfit.selectedItemIds?.map((itemId) => {
                    const found = items.find((i) => i.id === itemId);
                    if (!found) return null;
                    return (
                      <div key={itemId} className="p-2 bg-stone-950/70 border border-stone-800/60 rounded-xl flex items-center gap-3">
                        {found.image ? (
                          <img src={found.image} alt={found.title} className="w-9 h-9 object-cover rounded-lg border border-stone-800" />
                        ) : (
                          <div className="w-9 h-9 bg-stone-900 rounded-lg flex items-center justify-center text-stone-500"><ShirtIcon /></div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-stone-200 truncate">{found.title}</p>
                          <p className="text-[9px] text-stone-500 truncate">{found.category}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
