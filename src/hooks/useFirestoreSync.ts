import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { ClothingItem, Outfit, StyleProfile } from '../types';
import { DEFAULT_PROFILE } from '../config/constants';
import { HAS_FIREBASE } from '../config/demo';

interface FirestoreSyncState {
  items: ClothingItem[];
  outfits: Outfit[];
  profile: StyleProfile;
  setProfile: React.Dispatch<React.SetStateAction<StyleProfile>>;
  addItem: (item: Omit<ClothingItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => Promise<void>;
  removeOutfit: (outfitId: string) => Promise<void>;
  saveUserProfile: () => Promise<void>;
}

/**
 * Manages all wardrobe data.
 * - In demo mode: uses local in-memory state.
 * - In production: syncs with Firestore in real-time.
 */
export function useFirestoreSync(user: User | null): FirestoreSyncState {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [profile, setProfile] = useState<StyleProfile>({ ...DEFAULT_PROFILE });

  // ─── Real Firestore subscriptions (production only) ─────────
  useEffect(() => {
    if (!user || !HAS_FIREBASE) return;

    let unsubClothes: (() => void) | undefined;
    let unsubOutfits: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;

    const init = async () => {
      const svc = await import('../services/firestoreService');
      unsubClothes = svc.subscribeToClothes(user.uid, setItems);
      unsubOutfits = svc.subscribeToOutfits(user.uid, setOutfits);
      unsubProfile = svc.subscribeToProfile(user.uid, setProfile);
    };

    init();

    return () => {
      unsubClothes?.();
      unsubOutfits?.();
      unsubProfile?.();
    };
  }, [user]);

  // ─── Add item ───────────────────────────────────────────────
  const addItem = useCallback(
    async (item: Omit<ClothingItem, 'id'>) => {
      if (HAS_FIREBASE && user) {
        const svc = await import('../services/firestoreService');
        await svc.addClothingItem(user.uid, item);
      } else {
        const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setItems((prev) => [...prev, { id, ...item } as ClothingItem]);
      }
    },
    [user],
  );

  // ─── Remove item ────────────────────────────────────────────
  const removeItem = useCallback(
    async (itemId: string) => {
      if (HAS_FIREBASE && user) {
        const svc = await import('../services/firestoreService');
        await svc.deleteClothingItem(user.uid, itemId);
      } else {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    },
    [user],
  );

  // ─── Add outfit ─────────────────────────────────────────────
  const addOutfit = useCallback(
    async (outfit: Omit<Outfit, 'id'>) => {
      if (HAS_FIREBASE && user) {
        const svc = await import('../services/firestoreService');
        await svc.addOutfit(user.uid, outfit);
      } else {
        const id = `demo-outfit-${Date.now()}`;
        setOutfits((prev) => [...prev, { id, ...outfit } as Outfit]);
      }
    },
    [user],
  );

  // ─── Remove outfit ──────────────────────────────────────────
  const removeOutfit = useCallback(
    async (outfitId: string) => {
      if (HAS_FIREBASE && user) {
        const svc = await import('../services/firestoreService');
        await svc.deleteOutfit(user.uid, outfitId);
      } else {
        setOutfits((prev) => prev.filter((o) => o.id !== outfitId));
      }
    },
    [user],
  );

  // ─── Save profile ──────────────────────────────────────────
  const saveUserProfile = useCallback(async () => {
    if (HAS_FIREBASE && user) {
      const svc = await import('../services/firestoreService');
      await svc.saveProfile(user.uid, profile);
    }
    // In demo mode, profile is already in local state — nothing to do
  }, [user, profile]);

  return {
    items,
    outfits,
    profile,
    setProfile,
    addItem,
    removeItem,
    addOutfit,
    removeOutfit,
    saveUserProfile,
  };
}
