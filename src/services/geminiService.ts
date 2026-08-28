import type { AnalyzedMeta, ClothingItem, StyleProfile } from '../types';
import { HAS_GEMINI } from '../config/demo';
import {
  GEMINI_MODEL,
  GEMINI_API_URL,
  GEMINI_MAX_RETRIES,
  GEMINI_INITIAL_DELAY_MS,
} from '../config/constants';

// ─── Core Gemini Caller with Exponential Backoff ────────────────

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

async function callGemini(
  prompt: string,
  imageBase64: string | null = null,
  imageMimeType: string | null = null,
  isJson = false,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const parts: GeminiPart[] = [{ text: prompt }];

  if (imageBase64) {
    const cleanBase64 = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;
    parts.push({
      inlineData: {
        mimeType: imageMimeType ?? 'image/jpeg',
        data: cleanBase64,
      },
    });
  }

  const payload: Record<string, unknown> = {
    contents: [{ parts }],
  };

  if (isJson) {
    payload.generationConfig = { responseMimeType: 'application/json' };
  }

  let delay = GEMINI_INITIAL_DELAY_MS;

  for (let attempt = 0; attempt < GEMINI_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text: string | undefined =
          data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('Empty response from Gemini');
        return text;
      }

      // Retry on rate-limit or server errors
      if (res.status === 429 || res.status >= 500) {
        await sleep(delay);
        delay *= 2;
        continue;
      }

      const errMsg = await res.text();
      throw new Error(`Gemini Error ${res.status}: ${errMsg}`);
    } catch (err) {
      if (attempt === GEMINI_MAX_RETRIES - 1) throw err;
      await sleep(delay);
      delay *= 2;
    }
  }

  throw new Error('Gemini API call failed after maximum retries');
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Mock Helpers (Demo Mode) ───────────────────────────────────

const MOCK_CLOTHING_TYPES = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Shoes', 'Accessory'] as const;
const MOCK_STYLES = ['Casual', 'Smart Casual', 'Formal', 'Streetwear', 'Bohemian'];
const MOCK_MATERIALS = ['Cotton', 'Denim', 'Linen', 'Wool', 'Polyester', 'Silk'];
const MOCK_PATTERNS = ['Solid', 'Striped', 'Checked', 'Floral', 'Abstract'];
const MOCK_COLORS = ['Midnight Black', 'Ivory White', 'Navy Blue', 'Sage Green', 'Dusty Rose', 'Warm Caramel'];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Simulate network delay for realism */
async function mockDelay(min = 600, max = 1500): Promise<void> {
  await sleep(min + Math.random() * (max - min));
}

// ─── Public API ─────────────────────────────────────────────────

/**
 * Analyze a clothing image using Gemini vision and return
 * structured metadata.
 */
export async function analyzeClothingImage(
  imageBase64: string,
): Promise<AnalyzedMeta> {
  if (!HAS_GEMINI) {
    await mockDelay();
    return {
      type: randomFrom(MOCK_CLOTHING_TYPES),
      category: `${randomFrom(['Classic', 'Modern', 'Vintage', 'Oversized'])} ${randomFrom(['Crew Neck Tee', 'Slim Jeans', 'Button-Down Shirt', 'Wool Blazer', 'Canvas Sneakers'])}`,
      color: randomFrom(MOCK_COLORS),
      style: randomFrom(MOCK_STYLES),
      material: randomFrom(MOCK_MATERIALS),
      pattern: randomFrom(MOCK_PATTERNS),
    };
  }

  const prompt = `
    You are Persona's professional closet scanner. 
    Analyze this clothing item image and classify its details into a structured JSON configuration.
    JSON format:
    {
      "type": "Top" | "Bottom" | "Dress" | "Outerwear" | "Shoes" | "Accessory",
      "category": "e.g. Slim Denim Jeans, Oversized Wool Blazer, White Leather Sneakers",
      "color": "e.g. Ivory White, Sage Green, Crimson Red",
      "style": "e.g. Casual, Smart Casual, Formal, Streetwear",
      "material": "e.g. Denim, Cotton, Linen, Wool",
      "pattern": "e.g. Solid, Striped, Checked, Floral"
    }
    Return ONLY raw JSON block. No markdown markers.
  `;

  try {
    // We will simulate file upload format since the backend expects multipart/form-data
    // For now we pass base64 directly to our existing callGemini fallback
    // Or we could implement standard formData conversion here
    // But since `callGemini` is already robust, we'll keep it as fallback
    // and attempt backend call:
    
    // Convert base64 back to Blob to send as FormData to FastAPI
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('image', blob, 'upload.jpg');
    formData.append('context', prompt);
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const res = await fetch(`${baseUrl}/api/vision/photo-search`, {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
        const data = await res.json();
        // The backend returns a dynamic caption, but we need JSON here.
        // We can parse the caption if the backend was prompted for JSON, or fallback.
        try {
            return JSON.parse(data.caption) as AnalyzedMeta;
        } catch(e) {
            console.error("JSON parse error from backend, falling back", e);
        }
    }
  } catch (error) {
    console.error("FastAPI Backend Error:", error);
  }

  // Fallback to existing logic if backend fails or doesn't return JSON
  const raw = await callGemini(prompt, imageBase64, 'image/jpeg', true);
  return JSON.parse(raw) as AnalyzedMeta;
}

/**
 * Generate a curated outfit from the user's wardrobe.
 */
export async function generateOutfit(
  inventory: ClothingItem[],
  profile: StyleProfile,
  weather: string,
  occasion: string,
): Promise<{ title: string; selectedItemIds: string[]; stylingTip: string }> {
  if (!HAS_GEMINI) {
    await mockDelay(800, 2000);
    // Pick 2-3 random items from inventory
    const shuffled = [...inventory].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(shuffled.length, 2 + Math.floor(Math.random() * 2)));
    return {
      title: `${occasion} — ${weather} Look`,
      selectedItemIds: selected.map((i) => i.id),
      stylingTip: `For your ${profile.bodyType} silhouette and ${profile.skinTone} complexion, this combination creates a balanced ${profile.stylePref.toLowerCase()} aesthetic. Layer the pieces naturally, keeping proportions clean. The color harmony works well for ${weather.toLowerCase()} weather and a ${occasion.toLowerCase()} setting. Tuck or half-tuck lighter pieces to define the waistline and add structure.`,
    };
  }

  const serializableInventory = inventory.map((i) => ({
    id: i.id,
    title: i.title,
    type: i.type,
    color: i.color,
    style: i.style,
    material: i.material,
  }));

  const prompt = `
    You are Persona, a world-class celebrity stylist and wardrobe curator.
    Evaluate this user's wardrobe collection: ${JSON.stringify(serializableInventory)}
    Evaluate their unique styling metrics:
    - Silhouette Structure: ${profile.bodyType}
    - Skin Complexion: ${profile.skinTone}
    - Preferred Style Vision: ${profile.stylePref}
    - Color Palette to Avoid: ${profile.colorsAvoid}

    Generate a cohesive styling combination matching the weather "${weather}" and event context "${occasion}".
    You must pick items strictly from their wardrobe inventory list above. Choose 1 to 4 item IDs.

    Return a strict JSON response:
    {
      "title": "Sophisticated styling title for this set",
      "selectedItemIds": ["array_of_matching_item_ids_from_inventory"],
      "stylingTip": "A highly detailed styling advice paragraph describing how they should wear, layer, tuck, and fit this set based on their ${profile.bodyType} body structure and ${profile.skinTone} skin color."
    }
    Do not add any additional explanation text or markdown outside the raw JSON response.
  `;

  const raw = await callGemini(prompt, null, null, true);
  return JSON.parse(raw);
}

/**
 * Generate a personalised styling guide in Markdown.
 */
export async function generateStylingGuide(
  profile: StyleProfile,
): Promise<string> {
  if (!HAS_GEMINI) {
    await mockDelay(1000, 2500);
    return `# Your Personal Styling Blueprint

## 1. Proportions & Silhouette Strategy

Your **${profile.bodyType}** frame benefits from structured layering. Focus on pieces that create clean vertical lines and balanced proportions.

- Choose well-fitted shoulders — avoid anything too loose or too tight
- Use monochromatic palettes to elongate your frame at ${profile.height}cm
- Strategic tucking creates waist definition and visual structure

## 2. Color Chemistry

With your **${profile.skinTone}** complexion, you'll look best in:

- **Earth tones**: Olive, camel, terracotta, and warm beige
- **Jewel tones**: Emerald green, sapphire blue, burgundy
- **Neutrals**: Charcoal, navy, off-white

**Avoid**: ${profile.colorsAvoid} — these clash with your natural undertones.

## 3. Strategic Capsule Formulas

### Formula 1: The Anchor Look
A fitted neutral base (white tee or black crew neck) + structured outerwear + clean-cut bottom. This is your everyday elevated look.

### Formula 2: The Statement Play
Take one bold piece — a textured jacket or patterned shirt — and let it lead. Keep everything else minimal and tonal.

### Formula 3: The Weekend Edit
Relaxed fits in premium fabrics. Linen, soft knits, and suede. Comfort meets sophistication. Your **${profile.stylePref}** preference shines here.`;
  }

  const prompt = `
    You are Persona, a high-fashion stylist advisory board.
    Generate a fully customized, ultra-luxury aesthetic styling report for this client metrics:
    - Tall/Height: ${profile.height} cm
    - Body Structure Archetype: ${profile.bodyType}
    - Complexion Profile: ${profile.skinTone}
    - Theme Focus: ${profile.stylePref}
    - Critical Colors to Avoid: ${profile.colorsAvoid}

    Build highly structured styling directions in Markdown including:
    1. Proportions & Silhouette Strategy: Tailored rules for styling their body line.
    2. Color Chemistry: Recommendations to flatter their exact skin tone while steering clear of ${profile.colorsAvoid}.
    3. Strategic Capsule Strategy: 3 outfit blueprint rules to scale up their styling aesthetic today.
    Keep the tone encouraging, luxurious, elegant, and action-focused.
  `;

  return callGemini(prompt);
}

/**
 * Chat with the Persona style assistant.
 */
export async function chatWithStylist(
  userMessage: string,
  profile: StyleProfile,
  wardrobeContext: string,
): Promise<string> {
  if (!HAS_GEMINI) {
    await mockDelay(500, 1200);

    const responses = [
      `Great question! Based on your ${profile.stylePref.toLowerCase()} aesthetic and ${profile.skinTone.toLowerCase()} complexion, I'd recommend focusing on tonal layering. Pair pieces from your wardrobe that share the same color family but different textures — this creates depth without visual clutter.`,
      `For your ${profile.bodyType} silhouette, the key is balance. If you're wearing something relaxed on top, go more fitted on the bottom, and vice versa. This creates a natural proportion that's universally flattering.`,
      `Looking at your closet, I see some great pieces! Try combining your neutral basics with one statement item. The rule of thirds works beautifully — 60% base color, 30% complementary shade, and 10% accent. This creates a curated, intentional look every time.`,
      `That's a fantastic styling question! With ${profile.skinTone.toLowerCase()} skin tones, you can really make warm metallics work — think gold accessories, bronze-toned shoes, or caramel leather goods. These add luxury without overpowering your outfit.`,
      `I love the direction you're thinking! For versatility, invest in pieces that work across multiple dress codes. A well-fitted blazer, quality denim, and clean minimalist sneakers can bridge casual to smart casual seamlessly.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  const systemPrompt = `
    You are Persona, a luxury personal fashion stylist chatbot.
    Current Client Metrics:
    - Silhouette: ${profile.bodyType}
    - Skin Palette: ${profile.skinTone}
    - Preference Core: ${profile.stylePref}
    - Wardrobe Content Context: [${wardrobeContext || 'No items uploaded yet'}]

    Act with high elegance. Answer questions deeply. Recommend specific styling rules or pieces from their closet context.
  `;

  const prompt = `
    Context: ${systemPrompt}
    User Stylist Request: ${userMessage}
  `;

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const res = await fetch(`${baseUrl}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: prompt, 
        user_preferences: JSON.stringify(profile) 
      })
    });
    const data = await res.json();
    return data.reply || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("FastAPI Backend Error:", error);
    // Fallback if backend is down
    return callGemini(prompt);
  }
}
