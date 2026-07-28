import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { APP_ID } from '../config/constants';
import type { ClothingItem, Outfit, StyleProfile } from '../types';

// ─── Guard ──────────────────────────────────────────────────────

function requireDb() {
  if (!db) throw new Error('Firestore is not initialized — are you in demo mode?');
  return db;
}

// ─── Path helpers ───────────────────────────────────────────────

function clothesCol(userId: string) {
  return collection(requireDb(), 'artifacts', APP_ID, 'users', userId, 'clothes');
}

function outfitsCol(userId: string) {
  return collection(requireDb(), 'artifacts', APP_ID, 'users', userId, 'outfits');
}

function profileDoc(userId: string) {
  return doc(requireDb(), 'artifacts', APP_ID, 'users', userId, 'profile', 'data');
}

// ─── Clothes ────────────────────────────────────────────────────

export async function addClothingItem(
  userId: string,
  item: Omit<ClothingItem, 'id'>,
): Promise<string> {
  const ref = await addDoc(clothesCol(userId), item);
  return ref.id;
}

export async function deleteClothingItem(
  userId: string,
  itemId: string,
): Promise<void> {
  const ref = doc(requireDb(), 'artifacts', APP_ID, 'users', userId, 'clothes', itemId);
  await deleteDoc(ref);
}

export function subscribeToClothes(
  userId: string,
  callback: (items: ClothingItem[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    clothesCol(userId),
    (snapshot) => {
      const parsed = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as ClothingItem,
      );
      callback(parsed);
    },
    (err) => {
      console.error('Clothes snapshot error:', err);
      onError?.(err);
    },
  );
}

// ─── Outfits ────────────────────────────────────────────────────

export async function addOutfit(
  userId: string,
  outfit: Omit<Outfit, 'id'>,
): Promise<string> {
  const ref = await addDoc(outfitsCol(userId), outfit);
  return ref.id;
}

export async function deleteOutfit(
  userId: string,
  outfitId: string,
): Promise<void> {
  const ref = doc(
    requireDb(),
    'artifacts',
    APP_ID,
    'users',
    userId,
    'outfits',
    outfitId,
  );
  await deleteDoc(ref);
}

export function subscribeToOutfits(
  userId: string,
  callback: (outfits: Outfit[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    outfitsCol(userId),
    (snapshot) => {
      const parsed = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Outfit,
      );
      callback(parsed);
    },
    (err) => {
      console.error('Outfits snapshot error:', err);
      onError?.(err);
    },
  );
}

// ─── Profile ────────────────────────────────────────────────────

export async function saveProfile(
  userId: string,
  profile: StyleProfile,
): Promise<void> {
  await setDoc(profileDoc(userId), profile);
}

export function subscribeToProfile(
  userId: string,
  callback: (profile: StyleProfile) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    profileDoc(userId),
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as StyleProfile);
      }
    },
    (err) => {
      console.error('Profile snapshot error:', err);
      onError?.(err);
    },
  );
}
