import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { HAS_FIREBASE } from '../config/demo';

interface AuthState {
  user: User | null;
  loading: boolean;
}

/** Fake user object for demo mode */
const DEMO_USER = {
  uid: 'guest',
  email: 'demo@kaya.app',
  displayName: 'Guest User',
} as unknown as User;

/**
 * Handles Firebase authentication – tries custom token first,
 * falls back to anonymous sign-in.
 * In demo mode, returns a fake user immediately.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!HAS_FIREBASE) {
      // Demo mode — no Firebase needed
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    // Real Firebase auth
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const { auth } = await import('../config/firebase');
        if (!auth) {
          setUser(DEMO_USER);
          setLoading(false);
          return;
        }

        const { signInWithCustomToken, signInAnonymously, onAuthStateChanged } =
          await import('firebase/auth');

        const token = import.meta.env.VITE_FIREBASE_AUTH_TOKEN;
        if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          await signInAnonymously(auth);
        }

        unsubscribe = onAuthStateChanged(auth, (usr) => {
          setUser(usr);
          setLoading(false);
        });
      } catch (err) {
        console.error('Auth initialization failed:', err);
        // Fallback to demo user on auth failure
        setUser(DEMO_USER);
        setLoading(false);
      }
    };

    init();

    return () => unsubscribe?.();
  }, []);

  return { user, loading };
}
