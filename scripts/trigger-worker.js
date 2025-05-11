/*
 * Script to manually trigger the worker to process pending image edits
 * Run this script with: node scripts/trigger-worker.js
 */

require('dotenv').config({ path: '.env.local' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error('❌ CRON_SECRET is not defined in your .env.local file');
  console.error('Please add a CRON_SECRET to your .env.local file and try again');
  process.exit(1);
}

async function triggerWorker() {
  console.log('🚀 Triggering worker to process pending image edits...');
  
  try {
    const response = await fetch(`${SITE_URL}/api/orchestrator/worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Worker triggered successfully!');
      console.log('📊 Results:', JSON.stringify(data, null, 2));
      
      if (data.processed === 0) {
        console.log('ℹ️ No pending jobs found to process.');
      } else {
        console.log(`🔄 Processed ${data.processed} job(s).`);
      }
    } else {
      console.error('❌ Failed to trigger worker:', data.error);
    }
  } catch (error) {
    console.error('❌ Error triggering worker:', error.message);
  }
}

// Run the worker
triggerWorker();
