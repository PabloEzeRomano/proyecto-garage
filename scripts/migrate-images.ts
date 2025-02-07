require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

async function optimizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const optimizedImage = await sharp(imageBuffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();
    return optimizedImage;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

async function migrateImages() {
  try {
    // Get all events with non-Supabase image URLs
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, image_url')
      .not('image_url', 'like', `${supabaseUrl}%`)
      .not('image_url', 'is', null);

    if (eventsError) throw eventsError;
    console.log(`Found ${events?.length || 0} events with images to migrate`);

    // Get all items with non-Supabase image URLs
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id, image_url')
      .not('image_url', 'like', `${supabaseUrl}%`)
      .not('image_url', 'is', null);

    if (itemsError) throw itemsError;
    console.log(`Found ${items?.length || 0} items with images to migrate`);

    // Migrate event images
    for (const event of events || []) {
      try {
        if (!event.image_url) continue;

        console.log(`Migrating event image: ${event.image_url}`);
        const imageBuffer = await downloadImage(event.image_url);
        const optimizedImage = await optimizeImage(imageBuffer);

        const fileName = `event-${event.id}-${Date.now()}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`events/${fileName}`, optimizedImage, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from('images')
          .getPublicUrl(`events/${fileName}`);

        const { error: updateError } = await supabase
          .from('events')
          .update({ image_url: publicUrl.publicUrl })
          .eq('id', event.id);

        if (updateError) throw updateError;
        console.log(`Successfully migrated event image: ${event.id}`);
      } catch (error) {
        console.error(`Failed to migrate event image ${event.id}:`, error);
      }
    }

    // Migrate item images
    for (const item of items || []) {
      try {
        if (!item.image_url) continue;

        console.log(`Migrating item image: ${item.image_url}`);
        const imageBuffer = await downloadImage(item.image_url);
        const optimizedImage = await optimizeImage(imageBuffer);

        const fileName = `item-${item.id}-${Date.now()}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`items/${fileName}`, optimizedImage, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from('images')
          .getPublicUrl(`items/${fileName}`);

        const { error: updateError } = await supabase
          .from('items')
          .update({ image_url: publicUrl.publicUrl })
          .eq('id', item.id);

        if (updateError) throw updateError;
        console.log(`Successfully migrated item image: ${item.id}`);
      } catch (error) {
        console.error(`Failed to migrate item image ${item.id}:`, error);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateImages();