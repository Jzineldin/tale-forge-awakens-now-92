
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateImageWithOpenAI, uploadImageToStorage as uploadImageToStorageOpenAI } from "./openai-image-service.ts";

// Main function for generating images with DALL-E-3
export async function generateImageWithFallback(prompt: string, visualContext?: any): Promise<Blob | null> {
  console.log('🎨 Starting image generation with DALL-E-3');
  console.log('Image prompt:', prompt);
  console.log('Visual context:', visualContext);
  
  // Try DALL-E-3 first
  const imageBlob = await generateImageWithOpenAI(prompt, visualContext);
  if (imageBlob) {
    console.log('✅ Successfully generated image with DALL-E-3');
    return imageBlob;
  }
  
  console.log('❌ DALL-E-3 image generation failed - no fallback provided');
  return null;
}

// Upload function that ensures storage bucket exists
async function ensureStorageBucket(client: SupabaseClient): Promise<boolean> {
  try {
    const { data: buckets, error: listError } = await client.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'story_images');
    
    if (!bucketExists) {
      console.log('📁 Creating story_images bucket...');
      const { error: createError } = await client.storage.createBucket('story_images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log('✅ Successfully created story_images bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage bucket:', error);
    return false;
  }
}

export async function uploadImageToStorage(imageBlob: Blob, client: SupabaseClient): Promise<string> {
  console.log('📤 Ensuring storage bucket exists...');
  const bucketReady = await ensureStorageBucket(client);
  
  if (!bucketReady) {
    throw new Error('Storage bucket is not ready');
  }

  return await uploadImageToStorageOpenAI(imageBlob, client);
}
