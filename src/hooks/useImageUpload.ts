import { useState, useCallback } from 'react';
import { IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT, IMAGE_QUALITY } from '../config/constants';

interface ImageUploadHook {
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  clearImage: () => void;
}

/**
 * Handles file input, compresses images via canvas, and
 * exposes a base64 preview string.
 */
export function useImageUpload(): ImageUploadHook {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resizeImage = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > IMAGE_MAX_WIDTH) {
                height = Math.round((height * IMAGE_MAX_WIDTH) / width);
                width = IMAGE_MAX_WIDTH;
              }
            } else {
              if (height > IMAGE_MAX_HEIGHT) {
                width = Math.round((width * IMAGE_MAX_HEIGHT) / height);
                height = IMAGE_MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }),
    [],
  );

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const compressed = await resizeImage(file);
      setImagePreview(compressed);
    },
    [resizeImage],
  );

  const clearImage = useCallback(() => {
    setImagePreview(null);
  }, []);

  return { imagePreview, handleImageChange, clearImage };
}
