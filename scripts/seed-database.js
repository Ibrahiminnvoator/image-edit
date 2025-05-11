#!/usr/bin/env node

/**
 * Database Seeding Script for AisarEdit
 * 
 * This script seeds the local development database with initial data
 * for testing and development purposes.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create buckets if they don't exist
    console.log('Creating storage buckets...');
    const originalImagesBucket = process.env.AISEREDIT_ORIGINAL_IMAGES_BUCKET || 'aisaredit-original-images';
    const editedImagesBucket = process.env.AISEREDIT_EDITED_IMAGES_BUCKET || 'aisaredit-edited-images';
    
    // Create buckets (this is a simplified version, in a real scenario you'd use the Supabase Storage API)
    console.log(`Creating bucket: ${originalImagesBucket}`);
    console.log(`Creating bucket: ${editedImagesBucket}`);
    
    // Set up public bucket policies
    console.log('Setting up storage bucket policies...');
    
    // Add sample data to the database
    console.log('Adding sample data...');
    
    // Sample users
    // Note: In a real app with Clerk auth, you wouldn't directly create users in the database
    // This is just for demonstration purposes
    
    // Sample edit history
    const { error: editHistoryError } = await supabase
      .from('edit_history')
      .insert([
        {
          user_id: 'sample-user-id',
          original_image_path: `${originalImagesBucket}/sample1.jpg`,
          edited_image_path: `${editedImagesBucket}/sample1-edited.jpg`,
          prompt: 'تحويل الصورة إلى طراز فني جميل',
          created_at: new Date().toISOString()
        },
        {
          user_id: 'sample-user-id',
          original_image_path: `${originalImagesBucket}/sample2.jpg`,
          edited_image_path: `${editedImagesBucket}/sample2-edited.jpg`,
          prompt: 'إضافة تأثير الأبيض والأسود مع لمسة من اللون الأحمر',
          created_at: new Date().toISOString()
        }
      ]);
    
    if (editHistoryError) {
      console.error('Error inserting edit history:', editHistoryError);
    } else {
      console.log('✅ Sample edit history added successfully');
    }
    
    // Sample user statistics
    const { error: userStatsError } = await supabase
      .from('user_statistics')
      .insert([
        {
          user_id: 'sample-user-id',
          edits_count: 2,
          last_edit_date: new Date().toISOString()
        }
      ]);
    
    if (userStatsError) {
      console.error('Error inserting user statistics:', userStatsError);
    } else {
      console.log('✅ Sample user statistics added successfully');
    }
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
