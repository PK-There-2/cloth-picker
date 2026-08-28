import React from 'react';
import type { User } from 'firebase/auth';


interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => (
  <header className="border-b border-stone-800/60 bg-stone-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div>
        <h1 className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-amber-200 to-stone-100 bg-clip-text text-transparent">
          KAYA
        </h1>
        <p className="text-[10px] text-stone-400 font-light tracking-widest uppercase">
          The Virtual AI Closet
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col text-right">
        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
          Active Session
        </span>
        <span className="text-xs font-mono text-amber-500/70 truncate max-w-[120px]">
          {user?.displayName || 'Guest User'}
        </span>
      </div>
      <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 text-sm font-bold shadow-inner">
        K
      </div>
    </div>
  </header>
);

export default Header;
