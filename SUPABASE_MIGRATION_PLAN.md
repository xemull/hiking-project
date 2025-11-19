# Deployment & Data Snapshot

This note documents how Trailhead is currently deployed and where critical data lives so we can
reproduce the environment or troubleshoot quickly.

## Cloud Run Services (production)

| Service | Region | Image | Public URL | Primary Data Source |
| --- | --- | --- | --- | --- |
| `frontend-service` | europe-west2 | `gcr.io/trailhead-mvp/frontend:latest` | https://trailhead.at (alias of `https://frontend-service-623946599151.europe-west2.run.app`) | Reads hikes/guides from CMS API and Supabase-fed backend |
| `backend-service` | europe-west2 | `gcr.io/trailhead-mvp/backend:latest` | `https://backend-service-623946599151.europe-west2.run.app` | Connects to Supabase PostgreSQL (`aws-1-eu-west-1.pooler.supabase.com:6543`) |
| `cms-service` (Strapi) | europe-west2 | `gcr.io/trailhead-mvp/cms:latest` | `https://cms-service-623946599151.europe-west2.run.app` | Talks to legacy Cloud SQL (`trailhead-new-db`, `strapi_test`) for authoring |

All services run as fully managed Cloud Run instances with unauthenticated
access enabled. Deployments follow the workflow:

```
cd <service> && gcloud builds submit --tag gcr.io/trailhead-mvp/<service>
gcloud run deploy <service>-service --image gcr.io/trailhead-mvp/<service>:latest --region=europe-west2 --platform=managed --allow-unauthenticated
```

## Databases & Credentials

### Supabase (production data)

- Host: `aws-1-eu-west-1.pooler.supabase.com`
- Port: `6543` (session pooler – IPv4)
- Database: `postgres`
- User: `postgres.lpkaumowfuovlgjgilrt`
- Password: stored in backend `.env` (`ZZH4NxTL@W^D^h`)
- Purpose: authoritative store for hikes/TMB content surfaced by the backend and
  Next.js frontend.

### Legacy Cloud SQL instances (kept for backup/Strapi authoring)

| Instance | Region / Zone | Tier | Disk | PG Version | Primary IP | Connection name | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `trailhead-new-db` | europe-west2 / `-c` | `db-f1-micro` | 10 GB PD-SSD | PostgreSQL 15.14 | `34.39.30.216` | `trailhead-mvp:europe-west2:trailhead-new-db` | Holds `hikes_db` (live content) and `strapi_test`; Strapi CMS writes here. |
| `strapi-db` | europe-west2 / `-a` | `db-custom-1-3840` | 20 GB PD-SSD | PostgreSQL 14.19 | `35.230.146.79` | `trailhead-mvp:europe-west2:strapi-db` | Legacy copy of hikes data; safe to decommission after final validation. |
| `hiking-project-db-233ae46e` | europe-west2 / `-c` | `db-g1-small` | 10 GB PD-SSD | PostgreSQL 14.19 | `34.39.12.47` | `trailhead-mvp:europe-west2:hiking-project-db-233ae46e` | Contains historic Strapi content; retained only for reference. |

- All instances expose public IPv4 (0.0.0.0/0) and are zonal.
- Per-instance service accounts can be retrieved with  
  `gcloud sql instances describe <instance> --format="value(serviceAccountEmailAddress)"`.

## Backups & Artifacts

- Latest manual exports live in `gs://trailhead-backups/`
  (`trailhead-new-db-final.sql.gz`, `trailhead-new-db-strapi.sql.gz`, etc.).
- Frontend image revisions are stored in `gcr.io/trailhead-mvp/frontend`.
  Latest known deployment: Cloud Run revision `frontend-service-00066-24j`.

## Operational Notes

- Cloud SQL storage auto-resize is currently ON; minimum disk sizes are 10 GB
  (shared-core) and 20 GB (custom). Tier adjustments require instance restarts.
- Binary logging is disabled on `trailhead-new-db` (`--no-enable-bin-log`) and
  maintenance window is Mondays 00:00 UTC.
- Anytime new routes are added to the frontend, update
  `frontend/src/app/sitemap.ts`, rebuild, and deploy with the workflow above.

This document intentionally omits completed migration task lists; it tracks only
what matters for the live deployment footprint. Update it whenever endpoints,
images, service accounts, or backup locations change.
