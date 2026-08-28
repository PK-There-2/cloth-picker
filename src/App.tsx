import { useState } from 'react';
import type { TabId } from './types';
import { useAuth } from './hooks/useAuth';
import { useFirestoreSync } from './hooks/useFirestoreSync';
import { useToast } from './hooks/useToast';
import { IS_DEMO_MODE } from './config/demo';
import { LoaderIcon, SparklesIcon } from './components/icons';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/layout/Toast';
import Dashboard from './components/dashboard/Dashboard';
import ClosetTab from './components/closet/ClosetTab';
import InventoryTab from './components/inventory/InventoryTab';
import HistoryTab from './components/history/HistoryTab';
import AdviceTab from './components/advice/AdviceTab';
import ChatTab from './components/chat/ChatTab';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    outfits,
    profile,
    setProfile,
    addItem,
    removeItem,
    addOutfit,
    removeOutfit,
    saveUserProfile,
  } = useFirestoreSync(user);
  const { toast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('welcome');

  // ─── Auth loading screen ────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center text-stone-100">
        <LoaderIcon />
        <span className="mt-4 text-stone-400 font-light tracking-widest text-xs uppercase">
          Initializing Styling Studio...
        </span>
      </div>
    );
  }

  // ─── Render active tab content ──────────────────────────────
  const renderTab = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'welcome':
        return (
          <Dashboard
            itemCount={items.length}
            outfitCount={outfits.length}
            stylePref={profile.stylePref}
            onTabChange={setActiveTab}
          />
        );
      case 'closet':
        return (
          <ClosetTab
            items={items}
            profile={profile}
            showToast={showToast}
            onTabChange={setActiveTab}
            onItemAdded={addItem}
            onOutfitAdded={addOutfit}
          />
        );
      case 'inventory':
        return (
          <InventoryTab
            items={items}
            showToast={showToast}
            onTabChange={setActiveTab}
            onItemRemoved={removeItem}
          />
        );
      case 'history':
        return (
          <HistoryTab
            outfits={outfits}
            items={items}
            showToast={showToast}
            onTabChange={setActiveTab}
            onOutfitRemoved={removeOutfit}
          />
        );
      case 'advice':
        return (
          <AdviceTab
            profile={profile}
            setProfile={setProfile}
            showToast={showToast}
            onSaveProfile={saveUserProfile}
          />
        );
      case 'chat':
        return <ChatTab items={items} profile={profile} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col selection:bg-amber-100 selection:text-stone-900">
      {/* Toast */}
      {toast && <Toast toast={toast} />}

      {/* Demo Mode Banner */}
      {IS_DEMO_MODE && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-center gap-2">
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-200 font-medium">
            Demo Mode — Running without API keys. AI responses are mocked. Data is stored in-memory.
          </span>
        </div>
      )}

      {/* Header */}
      <Header user={user} />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          itemCount={items.length}
        />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
