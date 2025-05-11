# Deploying AisarEdit to Netlify with Scheduled Functions

This guide explains how to deploy AisarEdit to Netlify and set up scheduled functions for the image processing worker.

## Prerequisites

- A Netlify account
- Your AisarEdit codebase ready for deployment

## Deployment Steps

### 1. Set up Environment Variables

Before deploying, you need to set up the following environment variables in Netlify:

- All your existing environment variables from `.env.local`
- Most importantly, set a secure `CRON_SECRET` for the scheduled worker

To add environment variables:
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add each variable from your `.env.local` file
4. Add a new `CRON_SECRET` variable with a secure random string

### 2. Deploy to Netlify

You can deploy to Netlify using the Netlify CLI or by connecting your GitHub repository:

#### Using Netlify CLI:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy your site
netlify init
netlify deploy --prod
```

#### Using GitHub Integration:

1. Push your code to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### 3. Verify Scheduled Function

After deployment:

1. Go to your Netlify site dashboard
2. Navigate to Functions > Scheduled functions
3. You should see your `scheduled-worker` function listed with the schedule (every 5 minutes)
4. Check the function logs to ensure it's running correctly

## How It Works

The scheduled function (`netlify/functions/scheduled-worker.js`) runs every 5 minutes and:

1. Retrieves the `CRON_SECRET` from environment variables
2. Makes a POST request to your `/api/orchestrator/worker` endpoint with the secret in the Authorization header
3. Logs the response for monitoring

## Troubleshooting

If your scheduled function isn't working:

1. Check the function logs in the Netlify dashboard
2. Verify that all environment variables are set correctly
3. Ensure your worker endpoint is accessible and functioning properly
4. Test the function manually using the Netlify CLI:

```bash
netlify functions:invoke scheduled-worker
```

## Local Development

For local development and testing:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local dev server with Netlify functions
netlify dev
```

You can test the scheduled function locally with:

```bash
netlify functions:invoke scheduled-worker
```
