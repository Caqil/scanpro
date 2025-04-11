#!/bin/bash
# master_setup.sh - Set up Kubernetes master node for ScanPro

set -e

# Default Kubernetes version if not specified
K8S_VERSION=${1:-"1.23.6-00"}
# Default pod network CIDR 
POD_NETWORK_CIDR=${2:-"10.244.0.0/16"}
# Master node IP
MASTER_IP=${3:-$(hostname -I | awk '{print $1}')}

echo "Starting Kubernetes master node setup..."
echo "Using Kubernetes version: $K8S_VERSION"
echo "Master node IP: $MASTER_IP"
echo "Pod network CIDR: $POD_NETWORK_CIDR"

# Ensure the system is ready
if ! grep -q "^br_netfilter" /proc/modules; then
  echo "Loading br_netfilter module..."
  modprobe br_netfilter
fi

# Install Kubernetes components
echo "Adding Kubernetes repositories..."
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF

echo "Installing Kubernetes components..."
apt-get update
apt-get install -y kubelet=$K8S_VERSION kubeadm=$K8S_VERSION kubectl=$K8S_VERSION
apt-mark hold kubelet kubeadm kubectl

# Verify the installation
echo "Verifying Kubernetes installation..."
kubectl version --client
kubelet --version
kubeadm version

# Initialize Kubernetes cluster
echo "Initializing Kubernetes cluster..."
kubeadm init --pod-network-cidr=$POD_NETWORK_CIDR --apiserver-advertise-address=$MASTER_IP

# Set up kubectl for the current user
echo "Setting up kubectl configuration..."
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# Also set up kubectl for root
mkdir -p /root/.kube
cp -i /etc/kubernetes/admin.conf /root/.kube/config

# Install Calico network plugin
echo "Installing Calico network plugin..."
kubectl create -f https://docs.projectcalico.org/manifests/tigera-operator.yaml
kubectl create -f https://docs.projectcalico.org/manifests/custom-resources.yaml

# Wait for Calico to be ready
echo "Waiting for Calico pods to be ready..."
kubectl -n calico-system wait --for=condition=ready pod --all --timeout=300s

# Generate a token and print the join command
echo "Generating token for worker nodes..."
JOIN_COMMAND=$(kubeadm token create --print-join-command)
echo -e "\nUse the following command to join worker nodes to the cluster:"
echo -e "\n$JOIN_COMMAND\n"

# Save the join command to a file for later use
echo "$JOIN_COMMAND" > /root/kubernetes_join_command.txt
echo "Join command saved to /root/kubernetes_join_command.txt"

# Label the master node
echo "Labeling master node..."
kubectl label node $(hostname) node-role.kubernetes.io/master=master

# Check the cluster status
echo "Checking cluster status..."
kubectl get nodes
kubectl get pods --all-namespaces

# Create a dedicated storage class for ScanPro
echo "Creating local storage class for ScanPro..."
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: scanpro-local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
EOF

echo "Kubernetes master node setup completed successfully!"
echo "Next step: Set up the KubeSphere by running the install_kubesphere.sh script."