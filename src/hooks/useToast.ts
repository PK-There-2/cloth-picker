import { useState, useRef, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../types';
import { TOAST_DURATION_MS } from '../config/constants';

interface ToastHook {
  toast: ToastMessage | null;
  showToast: (message: string, type?: ToastType) => void;
}

/**
 * Toast notification state with automatic cleanup of timers.
 */
export function useToast(): ToastHook {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    // Clear any existing timer to avoid stale dismissals
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, type });

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  return { toast, showToast };
}
