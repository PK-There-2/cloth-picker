import type { ClothingItem, Outfit, StyleProfile, TabId } from '../../types';
import ClosetUpload from './ClosetUpload';
import OutfitGenerator from './OutfitGenerator';

interface ClosetTabProps {
  items: ClothingItem[];
  profile: StyleProfile;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onTabChange: (tab: TabId) => void;
  onItemAdded: (item: Omit<ClothingItem, 'id'>) => Promise<void>;
  onOutfitAdded: (outfit: Omit<Outfit, 'id'>) => Promise<void>;
}

const ClosetTab: React.FC<ClosetTabProps> = ({
  items, profile, showToast, onTabChange, onItemAdded, onOutfitAdded,
}) => (
  <div className="space-y-10 animate-fadeIn">
    <ClosetUpload showToast={showToast} onItemAdded={onItemAdded} />
    <OutfitGenerator items={items} profile={profile} showToast={showToast} onTabChange={onTabChange} onOutfitAdded={onOutfitAdded} />
  </div>
);

export default ClosetTab;
