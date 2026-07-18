#!/bin/sh
# repo-snapshots, avatars 버킷 생성 (Phase 4+에서 실제 사용). Phase 0에서는 존재만 확인.
set -e
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb -p local/repo-snapshots
mc mb -p local/avatars
echo "MinIO buckets ready."
