# ScanPro KubeSphere Migration

This repository contains the complete infrastructure and deployment code for migrating ScanPro to a KubeSphere-managed Kubernetes cluster.

## Project Overview

ScanPro is a web application for PDF processing, conversion, and manipulation. This migration project aims to:

1. Move ScanPro from its current environment to a scalable Kubernetes platform
2. Set up KubeSphere for easier management and operations
3. Configure Cloudflare for DNS and CDN services
4. Implement CI/CD pipelines for automated deployment
5. Set up monitoring, scaling, and high availability

## Prerequisites

- 3+ VPS instances with Ubuntu 20.04 LTS (1 master, 2+ workers)
- Domain configured in Cloudflare
- Cloudflare API token
- Docker Hub account (or other container registry)
- GitHub account for CI/CD

## Quick Start

1. Set up your VPS instances:

   ```bash
   cd infrastructure/vps
   bash setup_vps.sh
   ```

2. Install Kubernetes and KubeSphere:

   ```bash
   cd infrastructure/kubernetes
   # On master node:
   bash master_setup.sh

   # On worker nodes:
   bash worker_setup.sh <join_command>

   cd ../kubesphere
   bash install_kubesphere.sh
   ```

3. Configure Cloudflare DNS:

   ```bash
   cd networking/cloudflare
   # Edit cloudflare_config.yaml with your details
   python cloudflare_dns.py
   ```

4. Deploy ScanPro:
   ```bash
   cd deployment
   kubectl apply -f database/postgres/postgres_deployment.yaml
   kubectl apply -f backend/scanpro_api.yaml
   kubectl apply -f frontend/scanpro_frontend.yaml
   kubectl apply -f services/
   ```

## Architecture

The ScanPro application is deployed as a set of microservices:

- **Frontend**: Next.js application
- **Backend API**: Node.js/Express API services
- **Workers**: Background processing services
- **Databases**: PostgreSQL and Redis
- **Supporting Services**: LibreOffice, GhostScript, OCR tools

See [architecture.md](documentation/architecture.md) for detailed architecture diagrams.

## Scaling

ScanPro is configured to scale horizontally. See [scaling.md](documentation/scaling.md) for details on:

- Auto-scaling configuration
- Manual scaling procedures
- Resource management

## Maintenance

For information about routine maintenance tasks, see [maintenance.md](documentation/maintenance.md).

## Troubleshooting

Common issues and their solutions are documented in [troubleshooting.md](documentation/troubleshooting.md).

## License

[Include your license information here]
