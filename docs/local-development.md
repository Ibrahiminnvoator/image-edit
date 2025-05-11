# AisarEdit Local Development Guide

This guide explains how to set up and use the automated local development environment for AisarEdit.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd aisaredit
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

   This script will:
   - Create a `.env.local` file from `.env.example` if it doesn't exist
   - Configure Supabase for local development
   - Build and start all required Docker containers
   - Run database migrations

3. Access the application:
   - Next.js app: http://localhost:3000
   - Supabase Studio: http://localhost:54322

## Environment Variables

The setup script will create a `.env.local` file for you, but you'll need to manually add some API keys:

- `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` for authentication
- `GEMINI_API_KEY` for AI image processing

## Common Commands

- Start the development environment:
  ```bash
  docker-compose up -d
  ```

- Stop the development environment:
  ```bash
  docker-compose down
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

- View logs for a specific service:
  ```bash
  docker-compose logs -f app
  ```

- Restart a specific service:
  ```bash
  docker-compose restart app
  ```

- Run database migrations:
  ```bash
  docker-compose exec app npm run db:generate
  docker-compose exec app npm run db:migrate
  ```

## Development Workflow

1. Make changes to your code
2. The Next.js development server will automatically reload with your changes
3. Use Supabase Studio (http://localhost:54322) to manage your database and storage

## Troubleshooting

### Reset Local Database

If you need to reset your local database:

```bash
docker-compose down -v
docker-compose up -d
```

This will remove all volumes and start fresh.

### Container Issues

If you encounter issues with containers:

```bash
docker-compose down
docker-compose up -d --build
```

This will rebuild all containers.

## Data Persistence

Your database data is stored in a Docker volume named `supabase-data`. This ensures your data persists between container restarts.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)
