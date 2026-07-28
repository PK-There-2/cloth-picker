import { useState } from 'react';
import type { StyleProfile } from '../../types';
import { SparklesIcon, LoaderIcon } from '../icons';
import { generateStylingGuide } from '../../services/geminiService';

interface AdviceTabProps {
  profile: StyleProfile;
  setProfile: React.Dispatch<React.SetStateAction<StyleProfile>>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onSaveProfile: () => Promise<void>;
}

const AdviceTab: React.FC<AdviceTabProps> = ({ profile, setProfile, showToast, onSaveProfile }) => {
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [aiAdviceContent, setAiAdviceContent] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveProfile();
      showToast('Styling profile successfully saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to sync styling profile configurations.', 'error');
    }
  };

  const handleGetGuide = async () => {
    setAdviceLoading(true);
    try {
      const result = await generateStylingGuide(profile);
      setAiAdviceContent(result);
    } catch (err) {
      console.error(err);
      showToast('Failed to compile custom styling guide.', 'error');
    } finally {
      setAdviceLoading(false);
    }
  };

  const update = (key: keyof StyleProfile, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/60">
        <h3 className="text-lg font-bold mb-1">Your Style Parameters</h3>
        <p className="text-xs text-stone-400 mb-6">Persona reads these dimensions to custom-fit AI outfit generators and layout formulations.</p>
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectField label="Silhouette Type" value={profile.bodyType} onChange={(v) => update('bodyType', v)} options={[
            { value: 'Rectangle', label: 'Rectangle (Even Top & Bottom)' },
            { value: 'Hourglass', label: 'Hourglass (Balanced Chest & Hips)' },
            { value: 'Pear', label: 'Pear (Wider bottom, narrow chest)' },
            { value: 'Inverted Triangle', label: 'Inverted Triangle (Broad shoulders)' },
            { value: 'Apple', label: 'Apple (Rounded core profile)' },
          ]} />
          <SelectField label="Skin Complexion Tone" value={profile.skinTone} onChange={(v) => update('skinTone', v)} options={[
            { value: 'Fair', label: 'Fair / Cool Undertones' },
            { value: 'Light', label: 'Light / Soft Beige' },
            { value: 'Medium', label: 'Medium / Warm Undertones' },
            { value: 'Olive', label: 'Olive / Golden complexions' },
            { value: 'Tan', label: 'Tan / Dark Caramel' },
            { value: 'Dark', label: 'Dark / Rich Cocoa' },
          ]} />
          <div>
            <label className="text-[10px] text-stone-400 block mb-2 uppercase tracking-wider font-semibold">Height (cm)</label>
            <input type="number" value={profile.height} onChange={(e) => update('height', e.target.value)} placeholder="e.g. 175" className="w-full bg-stone-950 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100" />
          </div>
          <SelectField label="Style Preference Goal" value={profile.stylePref} onChange={(v) => update('stylePref', v)} options={[
            { value: 'Minimalist', label: 'Minimalist / Quiet Luxury' },
            { value: 'Bold', label: 'Avant-Garde / Statement' },
            { value: 'Classic', label: 'Classic / Preppy Tailoring' },
            { value: 'Streetwear', label: 'Streetwear & Techwear' },
            { value: 'Bohemian', label: 'Retro Vintage / Bohemian' },
          ]} />
          <div>
            <label className="text-[10px] text-stone-400 block mb-2 uppercase tracking-wider font-semibold">Colors to avoid</label>
            <input type="text" value={profile.colorsAvoid} onChange={(e) => update('colorsAvoid', e.target.value)} placeholder="e.g. Neon Green, Beige" className="w-full bg-stone-950 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 border border-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">Update Profile Parameters</button>
          </div>
        </form>
      </div>

      <div className="bg-stone-900/30 border border-stone-800/60 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/60 pb-6">
          <div>
            <h3 className="text-base font-bold">Generative AI Expert Guidelines</h3>
            <p className="text-xs text-stone-400">Compile custom high-fashion rules custom tailored for your body line parameters.</p>
          </div>
          <button onClick={handleGetGuide} disabled={adviceLoading} className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-900 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-2">
            {adviceLoading ? <LoaderIcon /> : <SparklesIcon />}
            {adviceLoading ? 'Generating...' : 'Generate Custom Styling Guide'}
          </button>
        </div>

        {aiAdviceContent ? (
          <MarkdownRenderer content={aiAdviceContent} />
        ) : (
          <div className="text-center py-10 text-stone-500 text-xs">Your dynamic guide is empty. Hit the action button above to call your styling consultant.</div>
        )}
      </div>
    </div>
  );
};

const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-[10px] text-stone-400 block mb-2 uppercase tracking-wider font-semibold">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-stone-950 border border-stone-800/60 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500/50 text-stone-100">
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
  <div className="text-stone-300 space-y-4 text-xs md:text-sm leading-relaxed max-w-none">
    {content.split('\n').map((line, idx) => {
      if (line.startsWith('###')) return <h4 key={idx} className="text-sm font-bold text-amber-400 pt-3">{line.replace('###', '').trim()}</h4>;
      if (line.startsWith('##')) return <h3 key={idx} className="text-base font-bold text-amber-300 pt-4 border-b border-stone-800/60 pb-1.5">{line.replace('##', '').trim()}</h3>;
      if (line.startsWith('#')) return <h2 key={idx} className="text-lg font-extrabold text-amber-200 pt-5">{line.replace('#', '').trim()}</h2>;
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) return <li key={idx} className="ml-4 list-disc text-stone-300">{renderInline(line.replace(/^[-*]\s*/, ''))}</li>;
      if (/^\d+\.\s/.test(line.trim())) return <li key={idx} className="ml-4 list-decimal text-stone-300">{renderInline(line.replace(/^\d+\.\s*/, ''))}</li>;
      if (!line.trim()) return <br key={idx} />;
      return <p key={idx} className="text-stone-300 leading-relaxed">{renderInline(line)}</p>;
    })}
  </div>
);

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-amber-200 font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="text-stone-200">{part.slice(1, -1)}</em>;
    return part;
  });
}

export default AdviceTab;
