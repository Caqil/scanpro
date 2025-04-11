#!/bin/bash
# setup_ingress.sh - Install and configure NGINX Ingress Controller for ScanPro

set -e

echo "Setting up NGINX Ingress Controller for ScanPro..."

# Domain name (default: example.com)
DOMAIN=${1:-"example.com"}

# Check if kubectl is installed and accessible
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed or not in the PATH"
    exit 1
fi

# Check if we can access the cluster
if ! kubectl get nodes &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster"
    exit 1
fi

# Create a namespace for the ingress controller
echo "Creating 'ingress-nginx' namespace..."
kubectl create namespace ingress-nginx || echo "Namespace already exists"

# Deploy NGINX Ingress Controller
echo "Deploying NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# Wait for the controller to be ready
echo "Waiting for NGINX Ingress Controller pods to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Create a ClusterIssuer for Let's Encrypt certificates
echo "Creating Let's Encrypt ClusterIssuer for TLS certificates..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: admin@${DOMAIN}
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Install cert-manager for TLS certificate management
echo "Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Wait for cert-manager to be ready
echo "Waiting for cert-manager pods to be ready..."
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Create ingress resource for ScanPro application
echo "Creating ScanPro Ingress resource..."
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: scanpro-ingress
  namespace: scanpro
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "180"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "180"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "180"
spec:
  tls:
  - hosts:
    - ${DOMAIN}
    - api.${DOMAIN}
    secretName: scanpro-tls
  rules:
  - host: ${DOMAIN}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: scanpro-frontend
            port:
              number: 80
  - host: api.${DOMAIN}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: scanpro-api
            port:
              number: 80
EOF

# Create ingress resource for KubeSphere console
echo "Creating KubeSphere Console Ingress resource..."
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kubesphere-console-ingress
  namespace: kubesphere-system
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  tls:
  - hosts:
    - admin.${DOMAIN}
    secretName: kubesphere-console-tls
  rules:
  - host: admin.${DOMAIN}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ks-console
            port:
              number: 30880
EOF

# Get the external IP or hostname of the ingress controller
echo "Retrieving Ingress external IP/hostname..."
EXTERNAL_IP=""
while [ -z "$EXTERNAL_IP" ]; do
  echo "Waiting for external IP assignment..."
  EXTERNAL_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
  if [ -z "$EXTERNAL_IP" ]; then
    EXTERNAL_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
  fi
  [ -z "$EXTERNAL_IP" ] && sleep 10
done

echo "=============================================================="
echo "NGINX Ingress Controller setup complete!"
echo "External IP/Hostname: $EXTERNAL_IP"
echo ""
echo "You should create the following DNS records in Cloudflare:"
echo "  ${DOMAIN} -> ${EXTERNAL_IP}"
echo "  api.${DOMAIN} -> ${EXTERNAL_IP}"
echo "  admin.${DOMAIN} -> ${EXTERNAL_IP}"
echo ""
echo "ScanPro will be available at https://${DOMAIN}"
echo "API will be available at https://api.${DOMAIN}"
echo "KubeSphere Console will be available at https://admin.${DOMAIN}"
echo "=============================================================="