#!/bin/bash

# Build and tag images
echo "Building dev1703/cloud-frontend:latest..."
docker build -t dev1703/cloud-frontend:latest ./frontend

echo "Building dev1703/cloud-backend:latest..."
docker build -t dev1703/cloud-backend:latest ./backend

# Push images to Docker Hub
# Ensure you run `docker login` before running this script
echo "Pushing images to Docker Hub (dev1703)..."
docker push dev1703/cloud-frontend:latest
docker push dev1703/cloud-backend:latest

echo "Done! Images are safely on your Docker Hub."
