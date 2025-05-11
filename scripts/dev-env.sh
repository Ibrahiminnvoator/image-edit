#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
  echo -e "${BLUE}AisarEdit Development Environment Manager${NC}"
  echo -e "Usage: ./scripts/dev-env.sh [command]"
  echo -e ""
  echo -e "Commands:"
  echo -e "  ${GREEN}start${NC}       Start the development environment"
  echo -e "  ${GREEN}stop${NC}        Stop the development environment"
  echo -e "  ${GREEN}restart${NC}     Restart the development environment"
  echo -e "  ${GREEN}logs${NC}        View logs from all services"
  echo -e "  ${GREEN}logs-app${NC}    View logs from the Next.js app"
  echo -e "  ${GREEN}logs-db${NC}     View logs from the Supabase service"
  echo -e "  ${GREEN}seed${NC}        Seed the database with sample data"
  echo -e "  ${GREEN}migrate${NC}     Run database migrations"
  echo -e "  ${GREEN}reset${NC}       Reset the development environment (WARNING: deletes all data)"
  echo -e "  ${GREEN}status${NC}      Check the status of all services"
  echo -e "  ${GREEN}help${NC}        Display this help message"
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
  fi

  if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
  fi
}

# Start the development environment
start_env() {
  echo -e "${GREEN}Starting AisarEdit development environment...${NC}"
  docker-compose up -d
  echo -e "${GREEN}Development environment started!${NC}"
  echo -e "${YELLOW}Next.js app:${NC} http://localhost:3000"
  echo -e "${YELLOW}Supabase Studio:${NC} http://localhost:54322"
}

# Stop the development environment
stop_env() {
  echo -e "${YELLOW}Stopping AisarEdit development environment...${NC}"
  docker-compose down
  echo -e "${GREEN}Development environment stopped.${NC}"
}

# Restart the development environment
restart_env() {
  echo -e "${YELLOW}Restarting AisarEdit development environment...${NC}"
  docker-compose restart
  echo -e "${GREEN}Development environment restarted!${NC}"
}

# View logs
view_logs() {
  echo -e "${BLUE}Viewing logs for all services. Press Ctrl+C to exit.${NC}"
  docker-compose logs -f
}

# View app logs
view_app_logs() {
  echo -e "${BLUE}Viewing logs for Next.js app. Press Ctrl+C to exit.${NC}"
  docker-compose logs -f app
}

# View database logs
view_db_logs() {
  echo -e "${BLUE}Viewing logs for Supabase. Press Ctrl+C to exit.${NC}"
  docker-compose logs -f supabase
}

# Seed the database
seed_database() {
  echo -e "${YELLOW}Seeding database with sample data...${NC}"
  docker-compose exec app node scripts/seed-database.js
  echo -e "${GREEN}Database seeded successfully!${NC}"
}

# Run database migrations
run_migrations() {
  echo -e "${YELLOW}Running database migrations...${NC}"
  docker-compose exec app npm run db:generate
  docker-compose exec app npm run db:migrate
  echo -e "${GREEN}Database migrations completed!${NC}"
}

# Reset the development environment
reset_env() {
  echo -e "${RED}WARNING: This will delete all data in your development environment.${NC}"
  read -p "Are you sure you want to continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Resetting development environment...${NC}"
    docker-compose down -v
    docker-compose up -d
    echo -e "${GREEN}Development environment reset successfully!${NC}"
  else
    echo -e "${YELLOW}Reset cancelled.${NC}"
  fi
}

# Check status of services
check_status() {
  echo -e "${BLUE}Checking status of AisarEdit development services...${NC}"
  docker-compose ps
}

# Main script execution
check_docker

# Process command line arguments
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

case "$1" in
  start)
    start_env
    ;;
  stop)
    stop_env
    ;;
  restart)
    restart_env
    ;;
  logs)
    view_logs
    ;;
  logs-app)
    view_app_logs
    ;;
  logs-db)
    view_db_logs
    ;;
  seed)
    seed_database
    ;;
  migrate)
    run_migrations
    ;;
  reset)
    reset_env
    ;;
  status)
    check_status
    ;;
  help)
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0
