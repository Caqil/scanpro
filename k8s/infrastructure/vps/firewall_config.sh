#!/bin/bash
# firewall_config.sh - Configure firewall rules for Kubernetes and KubeSphere

set -e

echo "Configuring firewall rules for Kubernetes and KubeSphere..."

# Detect if we're using ufw or firewalld
if command -v ufw &> /dev/null; then
    echo "UFW detected, configuring..."
    
    # Disable UFW temporarily to avoid lockout during configuration
    ufw disable
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # SSH access
    ufw allow ssh
    
    # Kubernetes API Server
    ufw allow 6443/tcp
    
    # etcd server client API
    ufw allow 2379:2380/tcp
    
    # Kubelet API
    ufw allow 10250/tcp
    
    # Kubernetes scheduler
    ufw allow 10259/tcp
    
    # Kubernetes controller manager
    ufw allow 10257/tcp
    
    # Read-only Kubelet API (Healthcheck)
    ufw allow 10255/tcp
    
    # NodePort Services
    ufw allow 30000:32767/tcp
    
    # HTTP/HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # KubeSphere Console
    ufw allow 8080/tcp
    ufw allow 30880/tcp
    
    # Calico networking (if used)
    ufw allow 179/tcp # BGP
    ufw allow 4789/udp # VXLAN
    
    # Enable UFW
    ufw --force enable
    
    echo "UFW configured and enabled successfully."
    ufw status verbose

elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld detected, configuring..."
    
    # Make sure firewalld is running
    systemctl start firewalld
    systemctl enable firewalld
    
    # Add ports to default zone
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --permanent --add-port=6443/tcp # Kubernetes API server
    firewall-cmd --permanent --add-port=2379-2380/tcp # etcd server client API
    firewall-cmd --permanent --add-port=10250/tcp # Kubelet API
    firewall-cmd --permanent --add-port=10259/tcp # Kubernetes scheduler
    firewall-cmd --permanent --add-port=10257/tcp # Kubernetes controller manager
    firewall-cmd --permanent --add-port=10255/tcp # Read-only Kubelet API
    firewall-cmd --permanent --add-port=30000-32767/tcp # NodePort Services
    firewall-cmd --permanent --add-port=80/tcp # HTTP
    firewall-cmd --permanent --add-port=443/tcp # HTTPS
    firewall-cmd --permanent --add-port=8080/tcp # KubeSphere Console
    firewall-cmd --permanent --add-port=30880/tcp # KubeSphere NodePort
    firewall-cmd --permanent --add-port=179/tcp # Calico BGP
    firewall-cmd --permanent --add-port=4789/udp # Calico VXLAN
    
    # Reload firewall rules
    firewall-cmd --reload
    
    echo "Firewalld configured successfully."
    firewall-cmd --list-all
    
else
    echo "No supported firewall (ufw/firewalld) detected."
    echo "Installing and configuring UFW..."
    
    apt-get update
    apt-get install -y ufw
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # SSH access
    ufw allow ssh
    
    # Kubernetes API Server
    ufw allow 6443/tcp
    
    # etcd server client API
    ufw allow 2379:2380/tcp
    
    # Kubelet API
    ufw allow 10250/tcp
    
    # Kubernetes scheduler
    ufw allow 10259/tcp
    
    # Kubernetes controller manager
    ufw allow 10257/tcp
    
    # Read-only Kubelet API (Healthcheck)
    ufw allow 10255/tcp
    
    # NodePort Services
    ufw allow 30000:32767/tcp
    
    # HTTP/HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # KubeSphere Console
    ufw allow 8080/tcp
    ufw allow 30880/tcp
    
    # Calico networking (if used)
    ufw allow 179/tcp # BGP
    ufw allow 4789/udp # VXLAN
    
    # Enable UFW
    ufw --force enable
    
    echo "UFW installed and configured successfully."
    ufw status verbose
fi

echo "Testing firewall configuration for key ports..."

# Test if key ports are accessible
for port in 22 6443 10250 80 443 8080; do
    echo -n "Port $port: "
    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "$port"; then
            echo "Allowed"
        else
            echo "Not explicitly allowed - warning"
        fi
    elif command -v firewall-cmd &> /dev/null; then
        if firewall-cmd --list-ports | grep -q "$port"; then
            echo "Allowed"
        else
            echo "Not explicitly allowed - warning"
        fi
    else
        echo "Unknown status - validate manually"
    fi
done

echo "Firewall configuration complete."