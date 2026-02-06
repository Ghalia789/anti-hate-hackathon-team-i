#!/bin/bash

# Build the Docker image
docker build -t anti-hate-api:latest ./backend

# Tag for GCP Container Registry
PROJECT_ID="your-gcp-project-id"
IMAGE_NAME="anti-hate-api"
GCR_TAG="gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest"

docker tag anti-hate-api:latest $GCR_TAG

echo "Image built and tagged: $GCR_TAG"
echo "To push to GCR, run: docker push $GCR_TAG"
