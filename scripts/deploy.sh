#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="arangar-digital:latest"
CONTAINER_NAME="arangar-digital"
ENV_FILE=".env.local"
HOST_PORT="3000"
BUILD_ONLY="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --image)
      IMAGE_NAME="$2"
      shift 2
      ;;
    --container)
      CONTAINER_NAME="$2"
      shift 2
      ;;
    --env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    --port)
      HOST_PORT="$2"
      shift 2
      ;;
    --build-only)
      BUILD_ONLY="true"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or not in PATH."
  exit 1
fi

echo "Building Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

if [[ "$BUILD_ONLY" == "true" ]]; then
  echo "Build completed (build-only mode)."
  exit 0
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Removing existing container: $CONTAINER_NAME"
  docker rm -f "$CONTAINER_NAME" >/dev/null
fi

RUN_ARGS=(run -d --name "$CONTAINER_NAME" -p "${HOST_PORT}:3000")
if [[ -f "$ENV_FILE" ]]; then
  RUN_ARGS+=(--env-file "$ENV_FILE")
else
  echo "Warning: $ENV_FILE not found. App will run without custom env variables."
fi
RUN_ARGS+=("$IMAGE_NAME")

echo "Starting container: $CONTAINER_NAME"
docker "${RUN_ARGS[@]}" >/dev/null

echo "Deployment successful."
echo "URL: http://localhost:${HOST_PORT}"
