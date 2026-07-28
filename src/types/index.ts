// ─── Clothing Item ───────────────────────────────────────────────
export interface ClothingItem {
  id: string;
  title: string;
  type: ClothingType;
  category: string;
  color: string;
  style: string;
  material: string;
  pattern: string;
  image: string | null;
  createdAt: string;
}

export type ClothingType =
  | 'Top'
  | 'Bottom'
  | 'Dress'
  | 'Outerwear'
  | 'Shoes'
  | 'Accessory';

// ─── Analyzed Metadata (from Gemini image scan) ─────────────────
export interface AnalyzedMeta {
  type: ClothingType;
  category: string;
  color: string;
  style: string;
  material: string;
  pattern: string;
}

// ─── Outfit ─────────────────────────────────────────────────────
export interface Outfit {
  id: string;
  title: string;
  selectedItemIds: string[];
  stylingTip: string;
  occasion: string;
  weather: string;
  createdAt: string;
}

// ─── Style Profile ──────────────────────────────────────────────
export interface StyleProfile {
  bodyType: string;
  skinTone: string;
  height: string;
  stylePref: string;
  colorsAvoid: string;
}

// ─── Chat ───────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// ─── Toast ──────────────────────────────────────────────────────
export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

// ─── Tab Navigation ─────────────────────────────────────────────
export type TabId =
  | 'welcome'
  | 'closet'
  | 'inventory'
  | 'history'
  | 'advice'
  | 'chat';
