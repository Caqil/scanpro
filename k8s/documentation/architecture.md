# ScanPro Architecture on KubeSphere

This document describes the architecture of the ScanPro application as deployed on KubeSphere-managed Kubernetes.

## Overview

ScanPro is a cloud-based document processing platform that provides conversion, compression, and manipulation of various document formats. The application follows a microservices architecture pattern, with several components working together to deliver the complete feature set.

## System Architecture Diagram

```
                     +----------------+
                     |                |
                     |    Cloudflare  |
                     |                |
                     +--------+-------+
                              |
                              v
                     +----------------+
                     |                |
                     |  NGINX Ingress |
                     |                |
                     +--------+-------+
                              |
          +------------------++-----------------+
          |                  |                  |
+---------v---------+ +------v-------+ +--------v--------+
|                   | |              | |                 |
| ScanPro Frontend  | | ScanPro API  | | KubeSphere      |
|                   | |              | | Console         |
+-------------------+ +------+-------+ +-----------------+
                              |
    +--------------------+----+--------------------+
    |                    |                         |
+---v----+       +-------v--------+       +--------v------+
|        |       |                |       |               |
| Redis  |       | PostgreSQL     |       | ScanPro       |
|        |       |                |       | Workers       |
+--------+       +----------------+       +-------+-------+
                                                  |
               +---------------------------+------+---------------+
               |                           |                      |
        +------v------+            +-------v-------+       +------v-------+
        |             |            |               |       |              |
        | LibreOffice |            | GhostScript   |       | OCRmyPDF/    |
        | Service     |            | Service       |       | Tesseract    |
        +-------------+            +---------------+       +--------------+
```

## Components

### Frontend Layer

**ScanPro Frontend**

- **Purpose**: User interface for the application
- **Technology**: Next.js
- **Deployment**: Multiple replicas behind ingress
- **Scaling**: Horizontal Pod Autoscaler (HPA) based on CPU/memory
- **Path**: `k8s/deployment/frontend/scanpro_frontend.yaml`

### API Layer

**ScanPro API**

- **Purpose**: RESTful API endpoints for document processing
- **Technology**: Node.js/Express
- **Deployment**: Multiple replicas behind ingress
- **Scaling**: Horizontal Pod Autoscaler (HPA) based on CPU/memory
- **Path**: `k8s/deployment/backend/scanpro_api.yaml`

### Worker Layer

**ScanPro Workers**

- **Purpose**: Background processing tasks for document conversion/processing
- **Technology**: Node.js with Redis-based queue
- **Deployment**: Multiple replicas
- **Scaling**: Horizontal Pod Autoscaler (HPA) based on queue length and CPU
- **Path**: `k8s/deployment/backend/scanpro_worker.yaml`

### Database Layer

**PostgreSQL**

- **Purpose**: Primary database for user accounts, metadata, and application state
- **Technology**: PostgreSQL 14
- **Deployment**: StatefulSet with persistent volume
- **Scaling**: Vertical scaling with resource allocation
- **Path**: `k8s/deployment/database/postgres/postgres_deployment.yaml`

**Redis**

- **Purpose**: Caching, session management, and task queue
- **Technology**: Redis 7
- **Deployment**: Single pod with persistent volume
- **Scaling**: Vertical scaling (resource allocation)
- **Path**: `k8s/deployment/database/redis/redis_deployment.yaml`

### Service Layer

**LibreOffice Service**

- **Purpose**: Document format conversion
- **Technology**: LibreOffice headless
- **Deployment**: Multiple replicas
- **Path**: `k8s/deployment/services/libreoffice.yaml`

**GhostScript Service**

- **Purpose**: PDF manipulation and optimization
- **Technology**: GhostScript
- **Deployment**: Multiple replicas
- **Path**: `k8s/deployment/services/ghostscript.yaml`

**OCR Services**

- **Purpose**: Optical Character Recognition
- **Technology**: OCRmyPDF and Tesseract
- **Deployment**: Multiple replicas
- **Path**: `k8s/deployment/services/ocr/`

### Monitoring Layer

**Prometheus & Grafana**

- **Purpose**: Metrics collection and monitoring
- **Deployment**: Single pods with persistent volumes
- **Path**: `k8s/deployment/services/monitoring/prometheus_grafana.yaml`

## Storage Architecture

ScanPro uses a combination of persistent storage solutions:

1. **Database Storage**

   - PostgreSQL data: 20Gi PersistentVolume
   - Redis data: 5Gi PersistentVolume

2. **File Storage**

   - Uploads: 20Gi PersistentVolume (ReadWriteMany)
   - Conversions: 20Gi PersistentVolume (ReadWriteMany)
   - Compressions: 20Gi PersistentVolume (ReadWriteMany)
   - OCR results: 10Gi PersistentVolume (ReadWriteMany)
   - Temporary files: 10Gi PersistentVolume (ReadWriteMany)

3. **Backup Storage**
   - 50Gi PersistentVolume for database and critical file backups

## Network Architecture

### Internal Network

Services within the Kubernetes cluster communicate via the ClusterIP service type, with the following addressing scheme:

- ScanPro API: `scanpro-api:80`
- ScanPro Frontend: `scanpro-frontend:80`
- PostgreSQL: `scanpro-postgresql:5432`
- Redis: `scanpro-redis:6379`
- LibreOffice: `scanpro-libreoffice:8997`
- GhostScript: `scanpro-ghostscript:80`
- OCRmyPDF: `scanpro-ocrmypdf:80`
- Tesseract: `scanpro-tesseract:80`

### External Network

External traffic is managed through Cloudflare and Kubernetes Ingress, with these domains:

- Main application: `scanpro.cc` and `www.scanpro.cc`
- API: `api.scanpro.cc`
- Monitoring: `grafana.scanpro.cc`
- KubeSphere: `admin.scanpro.cc`

All external traffic is TLS encrypted, with certificates managed by cert-manager.

## Security Architecture

1. **Network Security**

   - All external traffic is TLS encrypted
   - Network policies restrict pod-to-pod communication
   - Cloudflare provides DDoS protection and Web Application Firewall

2. **Authentication & Authorization**

   - JWT-based authentication for API
   - Role-based access control within the application
   - Kubernetes RBAC for cluster resources

3. **Data Security**

   - Database credentials stored as Kubernetes secrets
   - Secrets encryption at rest in etcd
   - Regular automated backups

4. **Pod Security**
   - Non-root containers
   - Read-only root filesystem where possible
   - Limited capabilities

## Backup and Disaster Recovery

- Daily PostgreSQL database backups
- Weekly file backups for critical storage
- Backup retention policies:
  - Database: 7 most recent daily backups
  - Files: 3 most recent weekly backups

Backup automation is implemented as Kubernetes CronJobs.

## Scaling Strategy

### Horizontal Scaling

- Frontend and API components scaled horizontally based on CPU and memory metrics
- Worker components scaled based on queue length and CPU usage

### Vertical Scaling

- Database components primarily scaled vertically by adjusting resource allocations
- Storage volumes can be resized as needed

## Observability

### Metrics

- System metrics: CPU, memory, disk, network via Prometheus
- Application metrics: Request rates, error rates, processing times via custom endpoints

### Logging

- Container logs centralized with KubeSphere logging
- Application logs aggregated with structured JSON format

### Alerting

- Critical alerts configured in Grafana
- Notification channels: Email, Slack

## Future Architecture Considerations

1. **Geographical Distribution**

   - Multi-region deployment for lower latency and higher availability
   - Global CDN integration for static assets

2. **Enhanced Scalability**

   - Database read replicas
   - Distributed file storage solution (e.g., MinIO)

3. **Advanced Security**

   - Advanced threat detection and prevention
   - Enhanced audit logging
   - Regular security scanning and penetration testing

4. **Performance Optimizations**
   - On-demand resource allocation for processing-intensive tasks
   - Predictive scaling based on usage patterns
