#!/bin/bash
source .env

echo "APP_API_URL: $APP_API_URL"

# Check if APP_API_URL is set, and if not, use an empty string
API_URL=${APP_API_URL:-""}

echo "API_URL: $API_URL"

# Replace the placeholder in the HTML file with the actual API URL
sed -i.bak "s|__API_URL__|$API_URL|g" ./frontend/index.html

rm frontend/index.html.bak

# Start live-server
cd frontend && live-server