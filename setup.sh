#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  AisarEdit Development Setup     ${NC}"
echo -e "${GREEN}==================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker and Docker Compose first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file from .env.example...${NC}"
    cp .env.example .env.local
    
    # Update Supabase URL and keys for local development
    sed -i 's|SUPABASE_URL=.*|SUPABASE_URL=http://localhost:54321|g' .env.local
    sed -i 's|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU|g' .env.local
    
    echo -e "${YELLOW}Created .env.local file. Please update it with your API keys and other credentials.${NC}"
    echo -e "${YELLOW}At minimum, you need to set up:${NC}"
    echo -e "${YELLOW}- CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY for authentication${NC}"
    echo -e "${YELLOW}- GEMINI_API_KEY for AI image processing${NC}"
    echo -e "${YELLOW}Please edit .env.local now before continuing.${NC}"
    read -p "Press Enter to continue after updating .env.local..."
else
    echo -e "${GREEN}.env.local file already exists.${NC}"
fi

# Build and start the Docker containers
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker-compose up -d --build

echo -e "${GREEN}Waiting for services to initialize...${NC}"
sleep 10

# Run database migrations if needed
echo -e "${GREEN}Running database migrations...${NC}"
docker-compose exec app npm run db:generate
docker-compose exec app npm run db:migrate

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  Setup Complete!                 ${NC}"
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Your development environment is now running:${NC}"
echo -e "${GREEN}- Next.js app: http://localhost:3000${NC}"
echo -e "${GREEN}- Supabase Studio: http://localhost:54322${NC}"
echo -e ""
echo -e "${YELLOW}To stop the environment:${NC} docker-compose down"
echo -e "${YELLOW}To start it again:${NC} docker-compose up -d"
echo -e "${YELLOW}To view logs:${NC} docker-compose logs -f"
