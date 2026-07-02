#!/usr/bin/env bash
set -euo pipefail

# ClinicFlow Deployment Script
# Usage: ./scripts/deploy.sh <service> [environment]
#   service: "render" or "docker"
#   environment: "production" (default) or "development"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "=== ClinicFlow Deployment Script ==="

deploy_render() {
  echo "Deploying to Render..."

  if ! command -v render &> /dev/null; then
    echo "Render CLI not found. Install it from:"
    echo "  https://render.com/docs/cli"
    echo ""
    echo "Alternatively, deploy via GitHub:"
    echo "  1. Push this repo to GitHub:"
    echo "     git remote add origin https://github.com/YOUR_USER/clinicflow.git"
    echo "     git push -u origin main"
    echo "  2. Go to https://dashboard.render.com/select-repo"
    echo "  3. Connect your repository"
    echo "  4. Render will auto-detect render.yaml"
    echo "  5. Set MONGODB_URI in Environment Variables"
    echo "  6. Click 'Apply'"
    exit 1
  fi

  render deploy
}

deploy_docker() {
  local env="${1:-production}"

  if [ "$env" = "development" ]; then
    echo "Starting local development with Docker Compose..."
    docker compose up -d --build
    echo "App running at http://localhost:5000"
  else
    echo "Building production Docker image..."
    docker build -t clinicflow:latest .

    echo "Running production container..."
    docker run -d \
      --name clinicflow \
      -p 5000:5000 \
      -e NODE_ENV=production \
      -e MONGODB_URI="$MONGODB_URI" \
      -e JWT_SECRET="$JWT_SECRET" \
      clinicflow:latest

    echo "Container 'clinicflow' started on port 5000"
  fi
}

# Main
case "${1:-help}" in
  render)
    deploy_render
    ;;
  docker)
    deploy_docker "${2:-production}"
    ;;
  *)
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  render           Deploy to Render (via CLI or GitHub)"
    echo "  docker [env]     Deploy with Docker (production or development)"
    echo ""
    echo "Required env vars for production Docker:"
    echo "  MONGODB_URI      MongoDB connection string"
    echo "  JWT_SECRET       JWT signing secret"
    ;;
esac
