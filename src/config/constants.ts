/** Firestore artifact path prefix — matches the original sandbox schema */
export const APP_ID: string =
  import.meta.env.VITE_APP_ID ?? 'default-app-id';

/** Gemini model identifier */
export const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

/** Gemini API base URL */
export const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

/** Max retry attempts for Gemini API calls */
export const GEMINI_MAX_RETRIES = 5;

/** Initial retry delay in ms */
export const GEMINI_INITIAL_DELAY_MS = 1000;

/** Image compression defaults */
export const IMAGE_MAX_WIDTH = 300;
export const IMAGE_MAX_HEIGHT = 300;
export const IMAGE_QUALITY = 0.7;

/** Toast auto-dismiss duration in ms */
export const TOAST_DURATION_MS = 3500;

/** Default style profile values */
export const DEFAULT_PROFILE = {
  bodyType: 'Rectangle',
  skinTone: 'Medium',
  height: '175',
  stylePref: 'Minimalist',
  colorsAvoid: 'Neon Yellow',
} as const;
