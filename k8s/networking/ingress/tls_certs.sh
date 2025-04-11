#!/bin/bash
# tls_certs.sh - Manage TLS certificates for ScanPro

set -e

# Default values
DOMAIN=${1:-"example.com"}
EMAIL=${2:-"admin@${DOMAIN}"}
ACTION=${3:-"create"}

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

# Function to create or update Let's Encrypt ClusterIssuer
create_issuer() {
    echo "Creating Let's Encrypt ClusterIssuer..."
    
    # Create production issuer
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: ${EMAIL}
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

    # Create staging issuer (for testing)
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    email: ${EMAIL}
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

    echo "ClusterIssuers created successfully"
}

# Function to check the status of a certificate
check_certificate() {
    local cert_name=$1
    local namespace=$2
    
    echo "Checking status of certificate '${cert_name}' in namespace '${namespace}'..."
    
    # Get the certificate status
    kubectl get certificate ${cert_name} -n ${namespace} -o wide
    
    # Get detailed certificate status
    kubectl describe certificate ${cert_name} -n ${namespace} | grep -E "Status:|Message:"
}

# Function to request a certificate manually
request_certificate() {
    local cert_name=$1
    local domain=$2
    local namespace=${3:-"default"}
    local issuer=${4:-"letsencrypt-prod"}
    
    echo "Requesting certificate for ${domain} in namespace ${namespace}..."
    
    # Create the Certificate resource
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ${cert_name}
  namespace: ${namespace}
spec:
  secretName: ${cert_name}-tls
  issuerRef:
    name: ${issuer}
    kind: ClusterIssuer
  dnsNames:
  - ${domain}
EOF

    echo "Certificate requested successfully"
    echo "Check status with: kubectl describe certificate ${cert_name} -n ${namespace}"
}

# Function to create wildcard certificate
create_wildcard_cert() {
    local cert_name="wildcard-${DOMAIN//./-}"
    local namespace=${1:-"default"}
    
    echo "Creating wildcard certificate for *.${DOMAIN} in namespace ${namespace}..."
    
    # Create the Certificate resource
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ${cert_name}
  namespace: ${namespace}
spec:
  secretName: ${cert_name}-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - "*.${DOMAIN}"
  - "${DOMAIN}"
EOF

    echo "Wildcard certificate requested"
    echo "Note: For wildcard certificates to work, you need DNS-01 challenge with proper DNS provider configuration"
}

# Function to list all certificates
list_certificates() {
    echo "Listing all certificates across all namespaces..."
    kubectl get certificates --all-namespaces
    
    echo -e "\nListing all certificate secrets across all namespaces..."
    kubectl get secrets --all-namespaces | grep -E "tls|cert"
}

# Function to check if cert-manager is installed
check_cert_manager() {
    if ! kubectl get namespace cert-manager &> /dev/null; then
        echo "Error: cert-manager namespace not found. Is cert-manager installed?"
        echo "Install cert-manager with:"
        echo "kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml"
        exit 1
    fi
    
    if ! kubectl get pods -n cert-manager &> /dev/null; then
        echo "Error: Cannot access cert-manager pods. Check if cert-manager is running."
        exit 1
    fi
    
    echo "cert-manager is installed and running"
}

# Install cert-manager if needed
install_cert_manager() {
    echo "Installing cert-manager..."
    
    if kubectl get namespace cert-manager &> /dev/null; then
        echo "cert-manager namespace already exists, checking if it's properly installed..."
        if kubectl get deployment -n cert-manager cert-manager-webhook &> /dev/null; then
            echo "cert-manager appears to be already installed"
            return
        fi
    else
        kubectl create namespace cert-manager
    fi
    
    # Apply the cert-manager manifest
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
    
    # Wait for cert-manager to be ready
    echo "Waiting for cert-manager pods to be ready..."
    kubectl wait --namespace cert-manager \
      --for=condition=ready pod \
      --selector=app.kubernetes.io/component=controller \
      --timeout=300s
      
    echo "cert-manager installed successfully"
}

# Function to renew a certificate
renew_certificate() {
    local cert_name=$1
    local namespace=${2:-"default"}
    
    echo "Forcing renewal of certificate '${cert_name}' in namespace '${namespace}'..."
    
    # Delete the Secret to force cert-manager to obtain a new certificate
    kubectl delete secret ${cert_name}-tls -n ${namespace}
    
    # Annotate the Certificate to renew it immediately
    kubectl annotate certificate ${cert_name} -n ${namespace} \
      cert-manager.io/renew="true" --overwrite
      
    echo "Certificate renewal triggered"
    echo "Check status with: kubectl describe certificate ${cert_name} -n ${namespace}"
}

# Function to create certificates for ScanPro application
create_scanpro_certs() {
    echo "Creating certificates for ScanPro application..."
    
    # Create namespace if not exists
    kubectl create namespace scanpro 2>/dev/null || true
    
    # Create main domain certificate
    request_certificate "scanpro-main" "${DOMAIN}" "scanpro"
    
    # Create API domain certificate
    request_certificate "scanpro-api" "api.${DOMAIN}" "scanpro"
    
    # Create admin domain certificate
    request_certificate "scanpro-admin" "admin.${DOMAIN}" "scanpro"
    
    echo "ScanPro certificates requested"
}

# Main execution
case "$ACTION" in
    "install-cert-manager")
        install_cert_manager
        ;;
    "create-issuer")
        check_cert_manager
        create_issuer
        ;;
    "create")
        check_cert_manager
        create_issuer
        create_scanpro_certs
        ;;
    "request")
        if [ "$#" -lt 5 ]; then
            echo "Usage: $0 <domain> <email> request <cert-name> <cert-domain> [namespace] [issuer]"
            exit 1
        fi
        check_cert_manager
        request_certificate "$4" "$5" "${6:-default}" "${7:-letsencrypt-prod}"
        ;;
    "wildcard")
        check_cert_manager
        create_wildcard_cert "${4:-default}"
        ;;
    "list")
        list_certificates
        ;;
    "check")
        if [ "$#" -lt 5 ]; then
            echo "Usage: $0 <domain> <email> check <cert-name> <namespace>"
            exit 1
        fi
        check_certificate "$4" "$5"
        ;;
    "renew")
        if [ "$#" -lt 5 ]; then
            echo "Usage: $0 <domain> <email> renew <cert-name> <namespace>"
            exit 1
        fi
        renew_certificate "$4" "$5"
        ;;
    *)
        echo "Usage: $0 <domain> <email> <action>"
        echo "Actions:"
        echo "  install-cert-manager    - Install cert-manager"
        echo "  create-issuer           - Create Let's Encrypt ClusterIssuer"
        echo "  create                  - Create all required certificates for ScanPro"
        echo "  request <name> <domain> [namespace] [issuer] - Request a specific certificate"
        echo "  wildcard [namespace]    - Create a wildcard certificate"
        echo "  list                    - List all certificates"
        echo "  check <name> <namespace> - Check certificate status"
        echo "  renew <name> <namespace> - Force certificate renewal"
        exit 1
        ;;
esac

echo "TLS certificate operation completed successfully"