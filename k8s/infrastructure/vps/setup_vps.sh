#!/bin/bash
# setup_vps.sh - Initial VPS setup for KubeSphere deployment

set -e

echo "Starting ScanPro VPS setup for KubeSphere deployment..."

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
echo "Installing essential tools..."
apt install -y curl wget git vim net-tools gnupg2 software-properties-common apt-transport-https ca-certificates

# Configure swapoff (required for Kubernetes)
echo "Disabling swap (required for Kubernetes)..."
swapoff -a
sed -i '/swap/s/^/#/' /etc/fstab

# Set up firewall (allow SSH, K8s, and KubeSphere ports)
echo "Configuring firewall..."
apt install -y ufw
ufw allow ssh
ufw allow 6443/tcp  # Kubernetes API
ufw allow 30000:32767/tcp  # NodePort services
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 10250/tcp  # Kubelet API
ufw allow 10257/tcp  # Kube-controller-manager
ufw allow 10259/tcp  # Kube-scheduler
ufw allow 2379:2380/tcp  # etcd API
ufw allow 179/tcp  # Calico BGP
ufw allow 8080/tcp  # KubeSphere console

# Install and configure chrony for time synchronization
echo "Setting up chrony for time synchronization..."
apt install -y chrony
systemctl enable chrony
systemctl start chrony

# Set hostname if provided
if [ ! -z "$1" ]; then
  echo "Setting hostname to $1..."
  hostnamectl set-hostname $1
  echo "127.0.0.1 $1" >> /etc/hosts
fi

# Install container runtime (containerd)
echo "Installing container runtime (containerd)..."
apt-get update
apt-get install -y containerd

# Configure containerd
mkdir -p /etc/containerd
containerd config default | tee /etc/containerd/config.toml
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
systemctl restart containerd
systemctl enable containerd

# Configure kernel modules for Kubernetes
echo "Loading and configuring kernel modules..."
cat <<EOF | tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# Configure sysctl parameters required by Kubernetes
cat <<EOF | tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sysctl --system

# Install additional packages for ScanPro services
echo "Installing packages for ScanPro services..."
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

# Disable unattended upgrades for more stability
echo "Disabling unattended upgrades..."
apt remove -y unattended-upgrades
systemctl disable apt-daily.service
systemctl disable apt-daily.timer

# Setup completed
echo "VPS initial setup completed successfully"
echo "Please reboot the system to apply all changes"