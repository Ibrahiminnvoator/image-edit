/*
 * Script to test if environment variables are being loaded correctly
 */

require('dotenv').config({ path: '.env.local' });

console.log('Testing environment variables:');
console.log('CRON_SECRET:', process.env.CRON_SECRET ? '✅ Defined' : '❌ Not defined');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Defined' : '❌ Not defined');
