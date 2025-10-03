# Safe Production Deployment Strategy

## Risk Assessment

### 🔴 HIGH RISK (Avoid)
- Dropping production database
- Deploying all services simultaneously
- No rollback plan

### 🟡 MEDIUM RISK (Manageable)
- Creating new database instance
- Sequential service deployment
- Temporary service inconsistency

### 🟢 LOW RISK (Recommended)
- Blue-green deployment
- Parallel environment testing
- Automated rollback capability

## Recommended Approach: Blue-Green Deployment

### Phase 1: Create Parallel Environment (ZERO RISK)

#### 1.1 Create New Database Instance
```bash
# Create new database instance
gcloud sql instances create trailhead-new-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=europe-west2

# Set up database and user
gcloud sql databases create hikes_db --instance=trailhead-new-db
gcloud sql users create hike_admin --instance=trailhead-new-db --password="foaA99&I5Und!k"

# Import your new data
cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434
pg_dump -h 127.0.0.1 -U strapi_dev -d strapi_clean --no-owner --no-privileges | \
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db
```

#### 1.2 Deploy Services to Staging URLs
```bash
# Deploy backend to staging
cd backend
docker build -t backend-app .
docker tag backend-app europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:staging
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:staging

gcloud run deploy backend-service-staging \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:staging \
    --region europe-west2 \
    --set-env-vars="DB_USER=hike_admin,DB_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DB_NAME=hikes_db,DB_PASSWORD=foaA99&I5Und!k,DB_PORT=5432,STRAPI_URL=https://cms-service-staging-623946599151.europe-west2.run.app" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"

# Deploy Strapi to staging
cd cms
docker build -t strapi-cms .
docker tag strapi-cms europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:staging
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:staging

gcloud run deploy cms-service-staging \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:staging \
    --region europe-west2 \
    --set-env-vars="HOST=0.0.0.0,PORT=1337,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DATABASE_PORT=5432,DATABASE_NAME=hikes_db,DATABASE_USERNAME=hike_admin,DATABASE_PASSWORD=foaA99&I5Und!k,APP_KEYS=WusWiR+SN75muvIucGiqlA==,2IrqhhVKdM9u5ZxhlH0ZEQ==,c8dF0VWFKF3GAxsreZGxdg==,GPM83KGwi2qOsgRTZxFCNg==,API_TOKEN_SALT=5fYcTyT+abdLxFwhwinzgg==,ADMIN_JWT_SECRET=WhiBSyGBQlC79gM/2D7WOg==,TRANSFER_TOKEN_SALT=85zQRhcrrwfoasABIYHWSg==,JWT_SECRET=mrLb+H8fws/rfwJksEIgIQ==,ENCRYPTION_KEY=GOYlLkBPdKkMTG9IAmL00A==" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"

# Deploy frontend to staging
cd frontend
docker build -t frontend-app .
docker tag frontend-app europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:staging
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:staging

gcloud run deploy frontend-service-staging \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:staging \
    --region europe-west2 \
    --set-env-vars="NEXT_PUBLIC_STRAPI_URL=https://cms-service-staging-623946599151.europe-west2.run.app,NEXT_PUBLIC_CUSTOM_BACKEND_URL=https://backend-service-staging-623946599151.europe-west2.run.app"
```

### Phase 2: Test Staging Environment (ZERO RISK)

#### 2.1 Test Checklist
- [ ] Access staging frontend: `https://frontend-service-staging-*.run.app`
- [ ] Test backend API: `https://backend-service-staging-*.run.app/api/hikes`
- [ ] Test Strapi admin: `https://cms-service-staging-*.run.app/admin`
- [ ] Verify all hikes load with maps and elevation
- [ ] Test adding a new hike end-to-end
- [ ] Check cache clearing functionality
- [ ] Test mobile responsiveness

#### 2.2 Performance Testing
```bash
# Test API response times
curl -w "@curl-format.txt" -s https://backend-service-staging-*.run.app/api/hikes

# Test multiple hike pages
for hike in "alta-via-1" "alta-via-2" "south-west-coast-path"; do
  echo "Testing $hike..."
  curl -I https://frontend-service-staging-*.run.app/hike/$hike
done
```

### Phase 3: Production Cutover (MINIMAL RISK)

#### 3.1 Prepare Production Switch
```bash
# Build production-ready images
cd backend
docker tag backend-app europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest

cd cms
docker tag strapi-cms europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest

cd frontend
docker tag frontend-app europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:latest
```

#### 3.2 Production Deployment (5-10 minute downtime)
```bash
# Deploy in sequence (fastest to slowest recovery)

# 1. Frontend (30 seconds)
gcloud run deploy frontend-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/frontend-app:latest \
    --region europe-west2

# 2. Backend (1-2 minutes)
gcloud run deploy backend-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/backend-app:latest \
    --region europe-west2 \
    --set-env-vars="DB_USER=hike_admin,DB_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DB_NAME=hikes_db,DB_PASSWORD=foaA99&I5Und!k,DB_PORT=5432,STRAPI_URL=https://cms-service-623946599151.europe-west2.run.app" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"

# 3. Strapi (2-3 minutes)
gcloud run deploy cms-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/strapi-cms:latest \
    --region europe-west2 \
    --set-env-vars="HOST=0.0.0.0,PORT=1337,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/trailhead-mvp:europe-west2:trailhead-new-db,DATABASE_PORT=5432,DATABASE_NAME=hikes_db,DATABASE_USERNAME=hike_admin,DATABASE_PASSWORD=foaA99&I5Und!k,APP_KEYS=WusWiR+SN75muvIucGiqlA==,2IrqhhVKdM9u5ZxhlH0ZEQ==,c8dF0VWFKF3GAxsreZGxdg==,GPM83KGwi2qOsgRTZxFCNg==,API_TOKEN_SALT=5fYcTyT+abdLxFwhwinzgg==,ADMIN_JWT_SECRET=WhiBSyGBQlC79gM/2D7WOg==,TRANSFER_TOKEN_SALT=85zQRhcrrwfoasABIYHWSg==,JWT_SECRET=mrLb+H8fws/rfwJksEIgIQ==,ENCRYPTION_KEY=GOYlLkBPdKkMTG9IAmL00A==" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:trailhead-new-db"
```

### Phase 4: Verification & Cleanup

#### 4.1 Production Testing
- [ ] Test https://trailhead.at immediately
- [ ] Verify all critical hike pages
- [ ] Test Strapi admin access
- [ ] Clear caches: `curl -X POST https://backend-service-*.run.app/api/cache/clear`

#### 4.2 Cleanup (After 24-48 hours)
```bash
# Delete staging services
gcloud run services delete frontend-service-staging --region=europe-west2
gcloud run services delete backend-service-staging --region=europe-west2
gcloud run services delete cms-service-staging --region=europe-west2

# Delete old database (AFTER confirming everything works)
gcloud sql instances delete hiking-project-db-233ae46e
```

## Rollback Plan

### Immediate Rollback (If something breaks)
```bash
# Rollback to previous service versions
gcloud run services replace production-service-backup.yaml --region=europe-west2

# Or rollback database connection
gcloud run deploy backend-service \
    --set-env-vars="DB_HOST=/cloudsql/trailhead-mvp:europe-west2:hiking-project-db-233ae46e" \
    --add-cloudsql-instances="trailhead-mvp:europe-west2:hiking-project-db-233ae46e"
```

### Complete Rollback
Keep old database instance for 48 hours as backup.

## Timeline
- **Phase 1**: 45 minutes (parallel environment)
- **Phase 2**: 30 minutes (testing)
- **Phase 3**: 10 minutes (cutover)
- **Phase 4**: 15 minutes (verification)
- **Total**: 100 minutes, **10 minutes downtime**

## Cost Impact
- Temporary additional database: ~$10-20/month
- Staging services: ~$5-10/month
- **Total extra cost during deployment**: <$50