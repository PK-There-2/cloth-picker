/**
 * Demo mode auto-activates when Firebase/Gemini keys are not configured.
 * All data is stored in-memory (lost on refresh) and AI calls return
 * realistic mock responses.
 *
 * IMPORTANT: This module must NOT import from firebase.ts to avoid
 * circular initialization issues.
 */

const firebaseKey = import.meta.env.VITE_FIREBASE_API_KEY ?? '';
const geminiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const hasFirebase =
  firebaseKey.length > 0 && firebaseKey !== 'your_firebase_api_key';

const hasGemini =
  geminiKey.length > 0 && geminiKey !== 'your_gemini_api_key';

export const IS_DEMO_MODE = !hasFirebase || !hasGemini;
export const HAS_FIREBASE = hasFirebase;
export const HAS_GEMINI = hasGemini;
