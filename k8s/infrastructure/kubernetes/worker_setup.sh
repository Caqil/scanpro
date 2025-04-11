#!/bin/bash
# worker_setup.sh - Set up Kubernetes worker node for ScanPro

set -e

# Default Kubernetes version if not specified
K8S_VERSION=${1:-"1.23.6-00"}

# Check if join command is provided
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 [kubernetes_version] <join_command>"
    echo "Example: $0 1.23.6-00 \"kubeadm join 192.168.1.10:6443 --token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234...\""
    exit 1
fi

# Store the join command
JOIN_COMMAND="${@:2}"

echo "Starting Kubernetes worker node setup..."
echo "Using Kubernetes version: $K8S_VERSION"

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
kubelet --version
kubeadm version

# Configure worker node for ScanPro requirements
echo "Configuring worker node for ScanPro..."

# Create directories for local persistent volumes
echo "Creating directories for persistent volumes..."
mkdir -p /mnt/scanpro/data
mkdir -p /mnt/scanpro/uploads
mkdir -p /mnt/scanpro/temp
mkdir -p /mnt/scanpro/conversions
mkdir -p /mnt/scanpro/compressions
mkdir -p /mnt/scanpro/ocr
chmod -R 777 /mnt/scanpro

# Install additional packages for ScanPro worker nodes
echo "Installing additional packages for ScanPro worker nodes..."
apt-get install -y \
    libreoffice \
    ghostscript \
    qpdf \
    pdftk \
    poppler-utils \
    imagemagick \
    tesseract-ocr \
    tesseract-ocr-eng \
    python3-pip

# Configure ImageMagick to allow PDF operations
echo "Configuring ImageMagick policy to allow PDF operations..."
sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml

# Install OCR languages for Tesseract
echo "Installing additional OCR languages..."
apt-get install -y \
    tesseract-ocr-fra \
    tesseract-ocr-deu \
    tesseract-ocr-spa \
    tesseract-ocr-chi-sim \
    tesseract-ocr-chi-tra \
    tesseract-ocr-ara \
    tesseract-ocr-rus

# Install OCRmyPDF
pip3 install ocrmypdf

# Join the cluster using the provided command
echo "Joining the Kubernetes cluster..."
eval $JOIN_COMMAND

echo "Kubernetes worker node setup completed successfully!"
echo "The node is now joining the cluster. Verify on the master node with 'kubectl get nodes'"