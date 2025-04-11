#!/bin/bash
# install_kubesphere.sh - Install KubeSphere on Kubernetes cluster

set -e

# Default KubeSphere version
KS_VERSION=${1:-"v3.3.1"}

echo "Starting KubeSphere installation (version $KS_VERSION)..."

# Verify Kubernetes cluster is running
echo "Verifying Kubernetes cluster status..."
if ! kubectl get nodes &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster. Make sure:"
    echo "1. You are running this script on the master node"
    echo "2. Kubernetes is properly installed and configured"
    echo "3. kubectl is properly set up (~/.kube/config exists)"
    exit 1
fi

# Check if nodes are ready
NODES_NOT_READY=$(kubectl get nodes | grep -v NAME | awk '$2 != "Ready" {print $1}')
if [ ! -z "$NODES_NOT_READY" ]; then
    echo "Warning: The following nodes are not in Ready state:"
    echo "$NODES_NOT_READY"
    echo "Continue anyway? (y/n)"
    read -r CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create KubeSphere namespace
echo "Creating KubeSphere namespace..."
kubectl create namespace kubesphere-system || echo "Namespace kubesphere-system already exists"
kubectl create namespace kubesphere-monitoring-system || echo "Namespace kubesphere-monitoring-system already exists"

# Download KubeSphere installer
echo "Downloading KubeSphere installer..."
if [ ! -d "ks-installer" ]; then
    git clone https://github.com/kubesphere/ks-installer.git
fi

cd ks-installer

# Switch to specified version if not master
if [ "$KS_VERSION" != "master" ]; then
    git fetch --all --tags
    git checkout tags/$KS_VERSION -b $KS_VERSION
fi

# Create KubeSphere configuration
echo "Creating KubeSphere configuration..."
cat > kubesphere-config.yaml <<EOF
---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: $KS_VERSION
spec:
  local_registry: ""
  persistence:
    storageClass: "scanpro-local-storage"
  authentication:
    jwtSecret: ""
  etcd:
    monitoring: true
    endpointIps: localhost
    port: 2379
    tlsEnable: true
  common:
    redis:
      enabled: true
    redisVolumSize: 2Gi
    openldap:
      enabled: false
    minioVolumeSize: 20Gi
    monitoring:
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
      enableGrafana: true
      GPUMonitoring:
        enabled: false
  alerting:
    enabled: true
  auditing:
    enabled: true
  devops:
    enabled: false
  events:
    enabled: true
  logging:
    enabled: true
    containerruntime: containerd
    logsidecar:
      enabled: true
      replicas: 2
  metrics_server:
    enabled: true
  monitoring:
    storageClass: scanpro-local-storage
    prometheusMemoryRequest: 500Mi
    prometheusVolumeSize: 20Gi
  multicluster:
    clusterRole: none
  network:
    networkpolicy:
      enabled: false
    ippool:
      type: none
    topology:
      type: none
  openpitrix:
    store:
      enabled: true
  servicemesh:
    enabled: false
EOF

# Apply KubeSphere configuration
echo "Applying KubeSphere configuration..."
kubectl apply -f kubesphere-config.yaml

# Deploy KubeSphere
echo "Deploying KubeSphere operator..."
kubectl apply -f deploy/kubesphere-installer.yaml

echo "Deploying KubeSphere components (this may take 15-30 minutes)..."
kubectl apply -f deploy/cluster-configuration.yaml

# Check installation progress
echo "KubeSphere deployment initiated. Checking installation progress..."
echo "You can monitor the installation with:"
echo "kubectl logs -n kubesphere-system \$(kubectl get pod -n kubesphere-system -l 'app=ks-install' -o jsonpath='{.items[0].metadata.name}') -f"

# Wait for KubeSphere to be ready
echo "Waiting for KubeSphere pods to be ready (this may take a while)..."
sleep 30  # Give it some time to create pods

# Periodically check install logs
check_install_logs() {
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app=ks-install' -o jsonpath='{.items[0].metadata.name}') | tail -20
}

# Function to check if installation is complete
is_install_complete() {
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app=ks-install' -o jsonpath='{.items[0].metadata.name}') | grep "Successful" | wc -l
}

# Check progress every 2 minutes
echo "Checking installation progress every 2 minutes..."
for i in {1..30}; do
  echo "Progress check $i/30:"
  check_install_logs
  
  # Check if installation is complete
  if [ $(is_install_complete) -gt 0 ]; then
    echo "KubeSphere installation completed successfully!"
    break
  fi
  
  echo "Installation still in progress. Checking again in 2 minutes..."
  sleep 120
done

# Get console URL
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
NODEPORT=$(kubectl get svc ks-console -n kubesphere-system -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "30880")

echo "====================================================="
echo "KubeSphere installation completed!"
echo "Console URL: http://$NODE_IP:$NODEPORT"
echo "Default account: admin / P@88w0rd"
echo "Please change the default password after first login."
echo "====================================================="