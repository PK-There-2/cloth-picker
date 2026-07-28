import type { ClothingItem, TabId } from '../../types';
import { ShirtIcon, TrashIcon, PlusIcon } from '../icons';

interface InventoryTabProps {
  items: ClothingItem[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  onTabChange: (tab: TabId) => void;
  onItemRemoved: (itemId: string) => Promise<void>;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ items, showToast, onTabChange, onItemRemoved }) => {
  const handleDelete = async (itemId: string) => {
    try {
      await onItemRemoved(itemId);
      showToast('Item successfully cleared from inventory.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error deleting wardrobe item.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Current Closet Inventory</h2>
          <p className="text-sm text-stone-400">View and remove items currently tracked in your virtual styling workspace.</p>
        </div>
        <button onClick={() => onTabChange('closet')} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-2 self-start">
          <PlusIcon /> Scan New Piece
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/20 rounded-2xl border border-stone-800/60">
          <div className="w-16 h-16 bg-stone-900 text-stone-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-800"><ShirtIcon /></div>
          <h3 className="text-lg font-bold">Your closet is empty</h3>
          <p className="text-xs text-stone-500 mt-2">Add clothes using physical image uploads to enable dynamic styling algorithms.</p>
          <button onClick={() => onTabChange('closet')} className="mt-6 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 rounded-xl text-stone-300 text-xs border border-stone-800">Go Upload Clothes</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-stone-900/50 rounded-xl border border-stone-800/60 overflow-hidden shadow-md group relative flex flex-col justify-between">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-stone-950 hover:bg-rose-950 border border-rose-950/60 rounded-lg text-rose-300 transition-colors" title="Delete piece"><TrashIcon /></button>
              </div>
              {item.image ? (
                <div className="h-44 w-full bg-stone-950 flex items-center justify-center overflow-hidden border-b border-stone-800/60">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-44 w-full bg-stone-950 flex items-center justify-center border-b border-stone-800/60 text-stone-600"><ShirtIcon /></div>
              )}
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] tracking-widest text-amber-500 font-bold uppercase">{item.type}</span>
                  <span className="text-[10px] text-stone-500">{item.material}</span>
                </div>
                <h4 className="text-xs font-bold truncate text-stone-100">{item.title}</h4>
                <div className="flex flex-wrap gap-1 pt-2">
                  <span className="text-[9px] bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-400">{item.color}</span>
                  <span className="text-[9px] bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-400">{item.style}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
