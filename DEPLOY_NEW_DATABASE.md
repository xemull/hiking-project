# Deploy New Database to Production

## Prerequisites
- [ ] Local database is working correctly with all hikes
- [ ] `pg_dump` and `psql` tools installed
- [ ] Cloud SQL Proxy installed
- [ ] gcloud CLI configured

## Step 1: Backup Current Production (Safety First!)
```bash
# Connect to current production database
cloud-sql-proxy trailhead-mvp:europe-west2:hiking-project-db-233ae46e --port=5433

# Backup current production data
pg_dump -h 127.0.0.1 -p 5433 -U hike_admin -d hikes_db > production_backup_$(date +%Y%m%d).sql
```

## Step 2: Export Local Database
```bash
# Export your new local database
pg_dump -h 127.0.0.1 -U strapi_dev -d strapi_clean --no-owner --no-privileges > new_database.sql
```

## Step 3: Deploy to Production

### Option A: Replace Existing Database (Recommended)
```bash
# 1. Connect to production
cloud-sql-proxy trailhead-mvp:europe-west2:hiking-project-db-233ae46e --port=5433

# 2. Drop and recreate database
psql -h 127.0.0.1 -p 5433 -U hike_admin -d postgres -c "DROP DATABASE IF EXISTS hikes_db;"
psql -h 127.0.0.1 -p 5433 -U hike_admin -d postgres -c "CREATE DATABASE hikes_db;"

# 3. Import new data
psql -h 127.0.0.1 -p 5433 -U hike_admin -d hikes_db < new_database.sql
```

### Option B: Create New Database Instance
```bash
# Create new instance
gcloud sql instances create trailhead-new-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=europe-west2

# Set up database and user
gcloud sql databases create hikes_db --instance=trailhead-new-db
gcloud sql users create hike_admin --instance=trailhead-new-db --password="foaA99&I5Und!k"

# Import data
cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db < new_database.sql
```

## Step 4: Update Services

### 4.1 Update Backend Service
```bash
cd backend
docker build -t backend-app .
docker tag backend-app europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest

# For Option A (existing database):
gcloud run deploy backend-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest \
    --region europe-west2 \
    --set-env-vars="DB_USER=hike_admin,DB_HOST=/cloudsql/trailhead-mvp:europe-west2:hiking-project-db-233ae46e,DB_NAME=hikes_db,DB_PASSWORD=foaA99&I5Und!k,DB_PORT=5432,STRAPI_URL=https://cms-service-623946599151.europe-west2.run.app" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:hiking-project-db-233ae46e"

# For Option B (new database instance):
gcloud run deploy backend-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest \
    --region europe-west2 \
    --set-env-vars="DB_USER=hike_admin,DB_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DB_NAME=hikes_db,DB_PASSWORD=foaA99&I5Und!k,DB_PORT=5432,STRAPI_URL=https://cms-service-623946599151.europe-west2.run.app" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"
```

### 4.2 Update Strapi CMS Service
```bash
cd cms
docker build -t strapi-cms .
docker tag strapi-cms europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest

# For Option A (existing database):
gcloud run deploy cms-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest \
    --region europe-west2 \
    --set-env-vars="HOST=0.0.0.0,PORT=1337,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/trailhead-mvp:europe-west2:hiking-project-db-233ae46e,DATABASE_PORT=5432,DATABASE_NAME=hikes_db,DATABASE_USERNAME=hike_admin,DATABASE_PASSWORD=foaA99&I5Und!k,APP_KEYS=WusWiR+SN75muvIucGiqlA==,2IrqhhVKdM9u5ZxhlH0ZEQ==,c8dF0VWFKF3GAxsreZGxdg==,GPM83KGwi2qOsgRTZxFCNg==,API_TOKEN_SALT=5fYcTyT+abdLxFwhwinzgg==,ADMIN_JWT_SECRET=WhiBSyGBQlC79gM/2D7WOg==,TRANSFER_TOKEN_SALT=85zQRhcrrwfoasABIYHWSg==,JWT_SECRET=mrLb+H8fws/rfwJksEIgIQ==,ENCRYPTION_KEY=GOYlLkBPdKkMTG9IAmL00A==" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:hiking-project-db-233ae46e"

# For Option B (new database instance):
gcloud run deploy cms-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest \
    --region europe-west2 \
    --set-env-vars="HOST=0.0.0.0,PORT=1337,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DATABASE_PORT=5432,DATABASE_NAME=hikes_db,DATABASE_USERNAME=hike_admin,DATABASE_PASSWORD=foaA99&I5Und!k,APP_KEYS=WusWiR+SN75muvIucGiqlA==,2IrqhhVKdM9u5ZxhlH0ZEQ==,c8dF0VWFKF3GAxsreZGxdg==,GPM83KGwi2qOsgRTZxFCNg==,API_TOKEN_SALT=5fYcTyT+abdLxFwhwinzgg==,ADMIN_JWT_SECRET=WhiBSyGBQlC79gM/2D7WOg==,TRANSFER_TOKEN_SALT=85zQRhcrrwfoasABIYHWSg==,JWT_SECRET=mrLb+H8fws/rfwJksEIgIQ==,ENCRYPTION_KEY=GOYlLkBPdKkMTG9IAmL00A==" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"
```

## Step 5: Verify Deployment
1. [ ] Check backend API: `https://backend-service-*.run.app/api/hikes`
2. [ ] Check Strapi admin: `https://cms-service-*.run.app/admin`
3. [ ] Check website: `https://trailhead.at/hike/alta-via-1`
4. [ ] Verify maps and elevation profiles load

## Step 6: Clean Up (Optional)
If using Option B and everything works:
```bash
# Delete old database instance (BE CAREFUL!)
gcloud sql instances delete hiking-project-db-233ae46e
```

## Rollback Plan
If something goes wrong:
```bash
# Restore from backup
psql -h 127.0.0.1 -p 5433 -U hike_admin -d hikes_db < production_backup_YYYYMMDD.sql
```

## Timeline
- **Backup**: 10 minutes
- **Export**: 5 minutes
- **Deploy database**: 15 minutes
- **Deploy services**: 20 minutes
- **Testing**: 15 minutes
- **Total**: ~65 minutes