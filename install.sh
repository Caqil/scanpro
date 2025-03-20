#!/bin/bash
# PDF Converter Installation Script for https://github.com/Caqil/pdf-converter
# Includes PM2 setup for background running and Nginx configuration

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting PDF Converter Installation ===${NC}"

# Define variables
APP_PORT=3001
DOMAIN="scanpro.cc"
APP_USER="pdf-converter"
APP_DIR="/home/${APP_USER}/pdf-converter"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run this script as root or with sudo${NC}"
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Check for npm if not found
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Something went wrong with Node.js installation.${NC}"
    exit 1
fi

# Install PM2 globally
echo -e "${GREEN}Installing PM2 for process management...${NC}"
npm install -g pm2

# Install PDF processing tools
echo -e "${GREEN}Installing PDF processing dependencies...${NC}"
apt-get update
apt-get install -y \
    ghostscript \
    poppler-utils \
    qpdf \
    pdftk \
    libreoffice \
    imagemagick \
    nginx \
    certbot \
    python3-certbot-nginx

# Create app user if it doesn't exist
if ! id "${APP_USER}" &>/dev/null; then
    echo -e "${GREEN}Creating user ${APP_USER}...${NC}"
    useradd -m -s /bin/bash "${APP_USER}"
fi

# Create app directory
echo -e "${GREEN}Setting up application directory...${NC}"
mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

# Clone the repository
echo -e "${GREEN}Cloning repository from https://github.com/Caqil/pdf-converter...${NC}"
if [ ! -d "${APP_DIR}/.git" ]; then
    su - "${APP_USER}" -c "git clone https://github.com/Caqil/pdf-converter.git ${APP_DIR}"
else
    echo -e "${YELLOW}Git repository already exists, pulling latest changes...${NC}"
    su - "${APP_USER}" -c "cd ${APP_DIR} && git pull"
fi

# Create .env file with port configuration
echo -e "${GREEN}Setting up environment variables...${NC}"
if [ ! -f "${APP_DIR}/.env" ]; then
    cat > "${APP_DIR}/.env" << EOL
NODE_ENV=production
PORT=${APP_PORT}
EOL
fi

# Switch to app user for npm install and build
echo -e "${GREEN}Installing Node.js dependencies as ${APP_USER}...${NC}"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"
su - "${APP_USER}" -c "cd ${APP_DIR} && npm install"

# Create necessary directories
echo -e "${GREEN}Creating necessary directories...${NC}"
su - "${APP_USER}" -c "cd ${APP_DIR} && mkdir -p \
    uploads \
    temp \
    temp-conversions \
    public/conversions \
    public/compressions \
    public/merges \
    public/splits \
    public/rotations \
    public/watermarks \
    public/protected \
    public/unlocked \
    public/signatures \
    public/edited \
    public/ocr"

# Set proper permissions
echo -e "${GREEN}Setting permissions...${NC}"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"
chmod -R 755 "${APP_DIR}/uploads" "${APP_DIR}/public/"*/

# Build the project
echo -e "${GREEN}Building the project...${NC}"
su - "${APP_USER}" -c "cd ${APP_DIR} && npm run build"

# Create PM2 ecosystem file
echo -e "${GREEN}Creating PM2 ecosystem configuration...${NC}"
cat > "${APP_DIR}/ecosystem.config.js" << EOL
module.exports = {
  apps: [{
    name: "pdf-converter",
    cwd: "${APP_DIR}",
    script: "npm",
    args: "start",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: ${APP_PORT}
    }
  }]
};
EOL

# Fix ownership of ecosystem file
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/ecosystem.config.js"

# Create Nginx configuration file
echo -e "${GREEN}Setting up Nginx configuration...${NC}"
cat > "${NGINX_AVAILABLE}/${DOMAIN}.conf" << 'EOL'
server {
    listen 443 ssl;
    server_name scanpro.cc;  # Replace with your domain name

    ssl_certificate /etc/ssl/cert_sp.pem;
    ssl_certificate_key /etc/ssl/key_sp.pem;
    ssl_client_certificate /etc/ssl/cloudflare.crt;
    ssl_verify_client on;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!RC4';

    root /home/pdf-converter/pdf-converter/.next; 
    index index.html index.htm;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static/ {
        alias /home/pdf-converter/pdf-converter/.next/static/;
        access_log off;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Deny access to hidden files like .htaccess, .git, etc.
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Optionally, add additional security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}

server {
    listen 80;
    server_name scanpro.cc;
    return 301 https://$host$request_uri;
}
EOL

# Enable the site
if [ ! -L "${NGINX_ENABLED}/${DOMAIN}.conf" ]; then
    echo -e "${GREEN}Enabling Nginx site...${NC}"
    ln -s "${NGINX_AVAILABLE}/${DOMAIN}.conf" "${NGINX_ENABLED}/${DOMAIN}.conf"
fi

# Check SSL certificate files
SSL_FILES_MISSING=false
if [ ! -f "/etc/ssl/cert_sp.pem" ] || [ ! -f "/etc/ssl/key_sp.pem" ] || [ ! -f "/etc/ssl/cloudflare.crt" ]; then
    echo -e "${YELLOW}One or more SSL certificate files are missing.${NC}"
    echo -e "${YELLOW}You need to provide the following files:${NC}"
    echo -e "${YELLOW}- /etc/ssl/cert_sp.pem (SSL certificate)${NC}"
    echo -e "${YELLOW}- /etc/ssl/key_sp.pem (SSL key)${NC}"
    echo -e "${YELLOW}- /etc/ssl/cloudflare.crt (Cloudflare client certificate)${NC}"
    SSL_FILES_MISSING=true
fi

# Check Nginx configuration
echo -e "${GREEN}Testing Nginx configuration...${NC}"
nginx -t

# Restart Nginx
echo -e "${GREEN}Restarting Nginx...${NC}"
systemctl restart nginx

# Start with PM2 as app user
echo -e "${GREEN}Starting PDF Converter with PM2...${NC}"
su - "${APP_USER}" -c "cd ${APP_DIR} && pm2 start ecosystem.config.js"

# Save PM2 process list
su - "${APP_USER}" -c "pm2 save"

# Setup PM2 to start on system boot
echo -e "${GREEN}Setting PM2 to auto-start on system boot...${NC}"
pm2 startup systemd -u "${APP_USER}" --hp "/home/${APP_USER}"
systemctl enable pm2-${APP_USER}

echo -e "${GREEN}=== Installation Complete! ===${NC}"
echo -e "PDF Converter is now running in background with PM2"
echo -e "Check status with: ${YELLOW}sudo -u ${APP_USER} pm2 status${NC}"
echo -e "View logs with: ${YELLOW}sudo -u ${APP_USER} pm2 logs pdf-converter${NC}"
echo -e "Stop the service with: ${YELLOW}sudo -u ${APP_USER} pm2 stop pdf-converter${NC}"
echo -e "Restart the service with: ${YELLOW}sudo -u ${APP_USER} pm2 restart pdf-converter${NC}"

echo -e "\n${GREEN}=== Nginx Configuration ===${NC}"
echo -e "Nginx is configured to proxy requests to your application on port ${APP_PORT}"
echo -e "The site is available at: ${BLUE}https://${DOMAIN}${NC}"

if [ "$SSL_FILES_MISSING" = true ]; then
    echo -e "\n${YELLOW}WARNING: SSL certificate files are missing. Please provide them and restart Nginx.${NC}"
    echo -e "${YELLOW}The application is installed but may not work correctly until SSL is properly configured.${NC}"
fi

echo -e "\n${GREEN}=== All tasks completed successfully ===${NC}"