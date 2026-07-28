import React from 'react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const isError = toast.type === 'error';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
        isError
          ? 'bg-rose-950/90 border-rose-800 text-rose-200'
          : 'bg-stone-900 border-amber-500/30 text-amber-100'
      }`}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

export default Toast;
