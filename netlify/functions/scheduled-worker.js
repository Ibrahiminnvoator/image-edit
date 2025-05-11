const fetch = require('node-fetch');

// This function will be scheduled to run every 5 minutes
exports.handler = async function(event, context) {
  try {
    // Get the CRON_SECRET from environment variables
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
      console.error('CRON_SECRET environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'CRON_SECRET not configured' })
      };
    }

    // Get the base URL from environment or use the deployed URL
    const baseUrl = process.env.URL || 'https://your-site-url.netlify.app';
    
    // Call your worker endpoint with the secret
    const response = await fetch(`${baseUrl}/api/orchestrator/worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    console.log('Worker response:', data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Worker executed successfully', data })
    };
  } catch (error) {
    console.error('Error executing worker:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to execute worker' })
    };
  }
};
