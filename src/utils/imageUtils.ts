import { supabase } from '@/lib/supabase';

interface ImageSize {
  width: number;
  height: number;
  quality?: number;
}

const SIZES: Record<'thumbnail' | 'medium' | 'large', ImageSize> = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  medium: { width: 400, height: 300, quality: 85 },
  large: { width: 800, height: 600, quality: 90 },
};

export const getOptimizedImageUrl = (
  imageUrl?: string | null,
  size: keyof typeof SIZES = 'medium'
): string => {
  if (!imageUrl) return '/placeholder.jpg';
  if (imageUrl.startsWith('data:')) return imageUrl;

  try {
    const { width, height, quality } = SIZES[size];
    const url = new URL(imageUrl);

    // Check if it's a Supabase storage URL
    if (url.hostname.includes('supabase')) {
      const transformParams = new URLSearchParams({
        width: width.toString(),
        height: height.toString(),
        quality: quality?.toString() || '80',
        resize: 'contain',
        format: 'webp',
      });
      return `${imageUrl}?${transformParams.toString()}`;
    }

    return imageUrl;
  } catch (error) {
    console.error('Error transforming image URL:', error);
    return '/placeholder.jpg';
  }
};

export const uploadImageToStorage = async (
  imageData: string | File | Buffer,
  bucket: string = 'images',
  folder: string = ''
): Promise<string | null> => {
  try {
    let file: File;

    if (Buffer.isBuffer(imageData)) {
      file = new File([imageData], `${Date.now()}.jpg`, { type: 'image/jpeg' });
    } else if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      // Convert base64 to File
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, { type: 'image/webp' });
      file = new File([blob], `${Date.now()}.webp`, { type: 'image/webp' });
    } else if (imageData instanceof File) {
      file = imageData;
    } else {
      throw new Error('Invalid image data');
    }

    // Optimize the image before upload
    const optimizedImage = await optimizeImage(file);
    if (!optimizedImage) throw new Error('Failed to optimize image');

    // Upload to Supabase Storage
    const filePath = `${folder}/${Date.now()}-${optimizedImage.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, optimizedImage, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const optimizeImage = async (file: File): Promise<File | null> => {
  try {
    // Create a canvas to resize the image
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Load image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

    // Calculate dimensions maintaining aspect ratio
    const maxSize = 1200;
    let width = img.width;
    let height = img.height;

    if (width > height && width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    } else if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }

    // Set canvas size and draw image
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to WebP with quality setting
    const webpData = canvas.toDataURL('image/webp', 0.85);
    const optimizedBlob = await (await fetch(webpData)).blob();

    return new File([optimizedBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
      type: 'image/webp',
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
};

export const validateAndOptimizeImage = async (
  file: File
): Promise<string | null> => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image must be less than 10MB');
    }

    const optimizedImage = await optimizeImage(file);
    if (!optimizedImage) throw new Error('Failed to optimize image');

    return URL.createObjectURL(optimizedImage);
  } catch (error) {
    console.error('Error validating image:', error);
    return null;
  }
};
