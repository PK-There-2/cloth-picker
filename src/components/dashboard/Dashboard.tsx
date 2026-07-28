import type { TabId } from '../../types';
import { ShirtIcon, HistoryIcon, UserIcon, PlusIcon } from '../icons';

interface DashboardProps {
  itemCount: number;
  outfitCount: number;
  stylePref: string;
  onTabChange: (tab: TabId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  itemCount,
  outfitCount,
  stylePref,
  onTabChange,
}) => (
  <div className="space-y-8 animate-fadeIn">
    {/* Hero Banner */}
    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800/60 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="relative z-10 max-w-2xl">
        <span className="text-xs tracking-widest text-amber-400 uppercase font-semibold">
          Your Digital Wardrobe Consultant
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-100 mt-4 leading-tight">
          Dress with precision. Curated by Multimodal AI.
        </h2>
        <p className="text-stone-400 text-sm md:text-base mt-4 font-light leading-relaxed">
          Build a digital twin of your actual physical closet, generate outfit proposals
          optimized perfectly for your proportions and current weather patterns, and chat
          in real-time with an expert fashion AI.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => onTabChange('closet')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <PlusIcon /> Scan New Closet Item
          </button>
          <button
            onClick={() => onTabChange('advice')}
            className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-medium text-sm transition-all border border-stone-800"
          >
            Configure Style Profile
          </button>
        </div>
      </div>
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard label="Closet Pieces" value={String(itemCount)} icon={<ShirtIcon />} />
      <MetricCard label="Curated Fits" value={String(outfitCount)} icon={<HistoryIcon />} />
      <MetricCard label="Preferred Vibe" value={stylePref} icon={<UserIcon />} isText />
    </div>
  </div>
);

/* ─── Metric Card ───────────────────────────────────────────── */

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isText?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, isText }) => (
  <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800/60 flex items-center justify-between shadow-sm">
    <div>
      <span className="text-xs text-stone-500 tracking-wider font-semibold uppercase">{label}</span>
      <h3
        className={`${
          isText ? 'text-lg' : 'text-3xl'
        } font-extrabold text-amber-200 mt-1 truncate max-w-[170px]`}
      >
        {value}
      </h3>
    </div>
    <div className="p-3.5 bg-stone-900 text-amber-400 rounded-xl border border-stone-800">
      {icon}
    </div>
  </div>
);

export default Dashboard;
