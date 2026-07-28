import React from 'react';
import type { TabId } from '../../types';
import {
  SparklesIcon,
  ShirtIcon,
  InventoryIcon,
  HistoryIcon,
  UserIcon,
  ChatIcon,
} from '../icons';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  itemCount: number;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, itemCount }) => {
  const navItems: NavItem[] = [
    { id: 'welcome', label: 'Dashboard', icon: <SparklesIcon /> },
    { id: 'closet', label: 'Add Clothes & Style', icon: <ShirtIcon /> },
    { id: 'inventory', label: `Current Inventory (${itemCount})`, icon: <InventoryIcon /> },
    { id: 'history', label: 'Saved Combinations', icon: <HistoryIcon /> },
    { id: 'advice', label: 'Personal Advice', icon: <UserIcon /> },
    { id: 'chat', label: 'AI Stylist Chat', icon: <ChatIcon /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-stone-900/20 border-b md:border-b-0 md:border-r border-stone-900 p-4 space-y-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
            activeTab === item.id
              ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/30'
          }`}
        >
          {item.icon}
          <span className="text-sm whitespace-nowrap">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
