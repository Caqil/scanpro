#!/bin/bash
# storage_setup.sh - Set up storage for ScanPro on KubeSphere

set -e

echo "Setting up storage for ScanPro on KubeSphere..."

# Create local directories for storage on each node
# This should be run on each node in the cluster

# Base directory for all ScanPro storage
BASE_DIR="/mnt/scanpro"

# Create the necessary directories
mkdir -p $BASE_DIR/data
mkdir -p $BASE_DIR/uploads
mkdir -p $BASE_DIR/conversions
mkdir -p $BASE_DIR/compressions
mkdir -p $BASE_DIR/temp
mkdir -p $BASE_DIR/ocr
mkdir -p $BASE_DIR/postgres
mkdir -p $BASE_DIR/redis

# Set permissive permissions for Kubernetes pods
chmod -R 777 $BASE_DIR

echo "Local directories created on node. Now creating persistent volumes..."

# Create the storage class (only needs to be done once from the master node)
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: scanpro-local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain
EOF

# Get the current node name
NODE_NAME=$(hostname)

# Create persistent volumes for each directory
# Data volume (general purpose storage)
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-data-pv-${NODE_NAME}
spec:
  capacity:
    storage: 50Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/data
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# Uploads volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-uploads-pv-${NODE_NAME}
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/uploads
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# Conversions volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-conversions-pv-${NODE_NAME}
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/conversions
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# Compressions volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-compressions-pv-${NODE_NAME}
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/compressions
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# Temp volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-temp-pv-${NODE_NAME}
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/temp
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# OCR volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-ocr-pv-${NODE_NAME}
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/ocr
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# PostgreSQL volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-postgres-pv-${NODE_NAME}
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/postgres
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

# Redis volume
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: scanpro-redis-pv-${NODE_NAME}
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: scanpro-local-storage
  local:
    path: ${BASE_DIR}/redis
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - ${NODE_NAME}
EOF

echo "Persistent volumes created for node: ${NODE_NAME}"
kubectl get pv | grep scanpro

echo "Storage setup complete!"
echo "Note: Run this script on each node in the cluster to create storage on all nodes."