import { useState } from 'react';
import type { AnalyzedMeta, ClothingItem, ClothingType } from '../../types';
import { CameraIcon, SparklesIcon, LoaderIcon } from '../icons';
import { analyzeClothingImage } from '../../services/geminiService';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ClosetUploadProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
  onItemAdded: (item: Omit<ClothingItem, 'id'>) => Promise<void>;
}

const CLOTHING_TYPES: ClothingType[] = [
  'Top', 'Bottom', 'Dress', 'Outerwear', 'Shoes', 'Accessory',
];

const ClosetUpload: React.FC<ClosetUploadProps> = ({ showToast, onItemAdded }) => {
  const { imagePreview, handleImageChange, clearImage } = useImageUpload();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzedMeta, setAnalyzedMeta] = useState<AnalyzedMeta | null>(null);
  const [manualTitle, setManualTitle] = useState('');

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClothingImage(imagePreview);
      setAnalyzedMeta(result);
      setManualTitle(result.category || 'My Scanned Piece');
      showToast('Aesthetic tagging successfully finished!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Auto-categorization failed. Defaulting to manual details form.', 'error');
      setAnalyzedMeta({
        type: 'Top', category: 'Casual Outerwear', color: 'Neutral Black',
        style: 'Casual', material: 'Cotton', pattern: 'Solid',
      });
      setManualTitle('Manual Outerwear Item');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!analyzedMeta) return;
    setIsSaving(true);
    try {
      await onItemAdded({
        title: manualTitle,
        type: analyzedMeta.type ?? 'Top',
        category: analyzedMeta.category ?? 'Casual Clothing',
        color: analyzedMeta.color ?? 'Neutral Tones',
        style: analyzedMeta.style ?? 'Casual Style',
        material: analyzedMeta.material ?? 'Cotton Blend',
        pattern: analyzedMeta.pattern ?? 'Solid Block',
        image: imagePreview,
        createdAt: new Date().toISOString(),
      });
      showToast('Clothing successfully loaded into your inventory!', 'success');
      clearImage();
      setAnalyzedMeta(null);
      setManualTitle('');
    } catch (err) {
      console.error(err);
      showToast('Could not register item to database.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    clearImage();
    setAnalyzedMeta(null);
    setManualTitle('');
  };

  const updateMeta = (key: keyof AnalyzedMeta, value: string) => {
    if (!analyzedMeta) return;
    setAnalyzedMeta({ ...analyzedMeta, [key]: value });
  };

  return (
    <div className="bg-stone-900/30 border border-stone-800/60 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl"><CameraIcon /></div>
        <div>
          <h2 className="text-lg font-bold">Upload & Categorize Item</h2>
          <p className="text-xs text-stone-400">Scan physical pieces to extract aesthetic traits automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-800 bg-stone-950/60 p-6 rounded-xl hover:border-amber-500/30 transition-all relative min-h-[300px]">
          {imagePreview ? (
            <div className="w-full flex flex-col items-center">
              <img src={imagePreview} alt="Pending Scan" className="max-h-64 object-contain rounded-xl shadow-lg border border-stone-800/60 mb-4" />
              <div className="flex gap-3">
                <button onClick={handleAnalyze} disabled={isAnalyzing} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-900 disabled:text-stone-600 text-stone-950 text-xs font-bold rounded-lg transition-all flex items-center gap-2">
                  {isAnalyzing ? <LoaderIcon /> : <SparklesIcon />}
                  {isAnalyzing ? 'Processing Visuals...' : 'Run AI Visual Scan'}
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs rounded-lg transition-all border border-stone-800">Cancel</button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full">
              <div className="p-4 bg-stone-900 rounded-2xl text-stone-400 mb-4 hover:scale-105 transition-all"><CameraIcon /></div>
              <span className="text-sm font-medium text-stone-300">Choose clothing photo file</span>
              <span className="text-[10px] text-stone-500 mt-1">PNG, JPG, JPEG</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="bg-stone-900/40 p-6 rounded-xl border border-stone-800/60 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Analyzed Parameters</h3>
            {analyzedMeta ? (
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Title" value={manualTitle} onChange={setManualTitle} />
                <div>
                  <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Category Type</label>
                  <select value={analyzedMeta.type} onChange={(e) => updateMeta('type', e.target.value)} className="w-full mt-1 bg-stone-950 border border-stone-800/60 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50">
                    {CLOTHING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <FieldInput label="Aesthetic Style" value={analyzedMeta.style} onChange={(v) => updateMeta('style', v)} />
                <FieldInput label="Dominant Color" value={analyzedMeta.color} onChange={(v) => updateMeta('color', v)} />
                <FieldInput label="Material" value={analyzedMeta.material} onChange={(v) => updateMeta('material', v)} />
                <FieldInput label="Pattern" value={analyzedMeta.pattern} onChange={(v) => updateMeta('pattern', v)} />
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center bg-stone-950/50 rounded-xl border border-stone-800/40 p-4 text-center text-stone-500 text-xs">
                Please drop in an image file on the left and hit visual scan.
              </div>
            )}
          </div>
          <button onClick={handleSave} disabled={!analyzedMeta || isSaving} className="w-full mt-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 disabled:from-stone-900 disabled:to-stone-900 disabled:text-stone-700 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
            {isSaving && <LoaderIcon />}
            {isSaving ? 'Saving...' : 'Store into Wardrobe Collection'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 bg-stone-950 border border-stone-800/60 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" />
  </div>
);

export default ClosetUpload;
