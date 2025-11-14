# Trailhead Project Architecture

## Project Overview
Trailhead is a hiking guide platform featuring trail information, accommodations, and guides. The project consists of a Next.js frontend, Node.js backend, and Strapi CMS.

## Tech Stack
- **Frontend**: Next.js (React) - Static site generation and dynamic pages
- **Backend**: Node.js/Express - API server for data processing
- **CMS**: Strapi v5.24.1 - Headless CMS for content management
- **Database**: PostgreSQL (currently Cloud SQL, migrating to Supabase)
- **Hosting**: Google Cloud Run (containerized services)
- **Container Registry**: Google Container Registry (gcr.io)

## Project Structure
```
trailhead/
├── frontend/              # Next.js application
├── backend/               # Node.js API server
├── tmb-cms-clean/         # Strapi CMS v5
└── admin-scripts/         # Database management scripts
```

## Deployment Architecture

### Services on Google Cloud Run

1. **Frontend Service**
   - URL: https://frontend-service-623946599151.europe-west2.run.app
   - Also: https://trailhead.at
   - Region: europe-west2
   - Image: gcr.io/trailhead-mvp/frontend
   - Fetches data from CMS API for SSG/SSR

2. **Backend Service**
   - URL: https://backend-service-623946599151.europe-west2.run.app
   - Region: europe-west2
   - Image: gcr.io/trailhead-mvp/backend
   - Connects to: Supabase PostgreSQL (currently)
   - Connection: aws-1-eu-west-1.pooler.supabase.com:6543

3. **CMS Service (Strapi)**
   - URL: https://cms-service-623946599151.europe-west2.run.app
   - Admin Panel: https://cms-service-623946599151.europe-west2.run.app/admin
   - Region: europe-west2
   - Image: gcr.io/trailhead-mvp/cms
   - Currently connects to: Cloud SQL trailhead-new-db/strapi_test
   - Port: 1337
   - Memory: 1Gi

## Database Architecture

### Cloud SQL Instances (Google Cloud)

1. **strapi-db** (35.230.146.79)
   - Region: europe-west2-a
   - Version: PostgreSQL 14
   - Databases: postgres, hikes_db
   - Status: Running but legacy

2. **trailhead-new-db** (34.39.30.216) - CURRENT DATA SOURCE
   - Region: europe-west2-c
   - Version: PostgreSQL 15
   - Databases: postgres, hikes_db, strapi_test
   - **hikes_db contains all live TMB data**
   - Backup available: October 18, 2025 (ID: 1760777071712)
   - Status: Running, publicly accessible (0.0.0.0/0)

3. **hiking-project-db-233ae46e** (34.39.12.47)
   - Region: europe-west2-c
   - Version: PostgreSQL 14
   - Databases: postgres, hikes_db, strapi_content
   - Status: Running

### Supabase (Target Database)
- Host: aws-1-eu-west-1.pooler.supabase.com
- Port: 6543 (Session Pooler for IPv4)
- Database: postgres
- User: postgres.lpkaumowfuovlgjgilrt
- Status: Active, public schema currently empty
- Purpose: Target for migration from Cloud SQL

## Content Types in Strapi

### Standard Content Types
- Hikes (api::hike.hike)
- Accommodations (api::accommodation.accommodation)
- Countries (api::country.country)
- Months (api::month.month)
- Trail News (api::trail-news.trail-news)
- Users (plugin::users-permissions.user)

### TMB-Specific Content Types
- TMB Stages (api::tmb-stage.tmb-stage)
- TMB Accommodations (api::tmbaccommodation.tmbaccommodation)

## TMB (Tour du Mont Blanc) Data Structure

Located in: `trailhead-new-db` → `hikes_db` database

### Tables
1. **tmb_stages** (22 rows)
   - Stage information for TMB trail
   - Fields: id, name, stage_number, published_at, etc.

2. **tmbaccommodations** (162 rows)
   - Accommodation listings along TMB route
   - Fields: id, name, published_at, stage_id, etc.

3. **tmbaccommodations_stage_lnk** (162 rows)
   - One-to-one links between accommodations and stages
   - Relationship table

4. **tmbaccommodations_cmps** (364 rows)
   - Component data for accommodations
   - Dynamic zones and repeatable components

## Build & Deploy Process

### Building Images
```bash
# Frontend
cd frontend && gcloud builds submit --tag gcr.io/trailhead-mvp/frontend

# Backend
cd backend && gcloud builds submit --tag gcr.io/trailhead-mvp/backend

# CMS
cd tmb-cms-clean && gcloud builds submit --tag gcr.io/trailhead-mvp/cms
```

### Deploying to Cloud Run
```bash
# CMS Service
gcloud run deploy cms-service \
  --image gcr.io/trailhead-mvp/cms:latest \
  --platform managed \
  --region europe-west2 \
  --allow-unauthenticated \
  --port=1337 \
  --memory=1Gi \
  --timeout=300
```

## Environment Configuration

### CMS (.env.production)
```
NODE_ENV=production
DATABASE_HOST=34.39.30.216
DATABASE_PORT=5432
DATABASE_NAME=strapi_test
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=foaA99&I5Und!k
STRAPI_ADMIN_BACKEND_URL=https://cms-service-623946599151.europe-west2.run.app
```

### Backend (.env)
```
DB_HOST=aws-1-eu-west-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.lpkaumowfuovlgjgilrt
DB_PASSWORD=ZZH4NxTL@W^D^h
STRAPI_URL=https://cms-service-623946599151.europe-west2.run.app
```

## API Structure

### CMS API Endpoints
- Public API: `/api/{content-type}`
- Admin API: `/admin`
- Content Manager: `/content-manager`

### Example Queries
```
GET /api/hikes?populate=*
GET /api/tmbaccommodations?populate=stage
GET /api/tmb-stages?populate=accommodations
```

## Key Features

### Strapi v5 Features Used
- Draft & Publish system (document_id based)
- Relations between content types
- Dynamic zones for flexible content
- Component system for reusable content blocks
- Media library for image management

### Authentication
- Strapi admin users (stored in admin_users table)
- JWT-based authentication for admin panel
- Public API with permission controls

## Known Issues & Considerations

1. **Database Mismatch**: CMS currently points to `strapi_test` which has schema but no content
2. **TMB Data Location**: Actual TMB data is in `hikes_db`, not `strapi_test`
3. **Supabase Migration**: Incomplete - target database empty
4. **Local Access**: Cannot connect to Cloud SQL from local machine (connection timeout)
5. **Version**: Strapi v5 doesn't auto-create tables in production mode

## Monitoring & Logs

### Cloud Run Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=cms-service" \
  --limit=50 --project=trailhead-mvp --freshness=10m
```

### Database Access (from Cloud Shell only)
```bash
gcloud sql connect trailhead-new-db --database=hikes_db --project=trailhead-mvp
```

## Project Credentials

### GCP Project
- Project ID: trailhead-mvp
- Project Number: 623946599151
- Region: europe-west2

### Cloud SQL Users
- trailhead-new-db: postgres / foaA99&I5Und!k
- Supabase: postgres.lpkaumowfuovlgjgilrt / ZZH4NxTL@W^D^h

## Next Steps

1. Point CMS to `hikes_db` instead of `strapi_test` to restore content
2. Export `hikes_db` from Cloud SQL
3. Import to Supabase for cost reduction
4. Update all services to point to Supabase
5. Verify TMB relationships work correctly
6. Consider shutting down Cloud SQL after successful migration
