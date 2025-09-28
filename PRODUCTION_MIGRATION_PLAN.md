# Production Migration Plan

## Current State Analysis

### Local Development:
- **GPX Database**: Local PostgreSQL (`strapi_clean` on `127.0.0.1:5432`)
- **Strapi CMS**: Google Cloud PostgreSQL (`hikes_db` on `35.230.146.79:5432`)
- **Backend API**: Connects to both databases

### Production:
- **Frontend**: `frontend-service-*.run.app` ✅
- **Backend**: `backend-service-*.run.app` ✅
- **Strapi CMS**: `cms-service-*.run.app` ✅
- **GPX Database**: ❌ **MISSING** - Production backend can't access local DB

## Migration Options

### Option 1: Separate GPX Database (Recommended)
Create a dedicated Google Cloud PostgreSQL instance for GPX tracks.

**Pros**:
- Clean separation of concerns
- Independent scaling
- Better security

**Steps**:
1. Create new Google Cloud SQL PostgreSQL instance
2. Export local `trails` table data
3. Import to new cloud database
4. Update production backend environment variables

### Option 2: Consolidate Databases
Add `trails` table to existing `hikes_db`.

**Pros**:
- Single database to manage
- Lower costs
- Simpler deployment

**Steps**:
1. Add `trails` table to existing `hikes_db`
2. Migrate GPX data to existing database
3. Update backend to use single database

### Option 3: Database Replication
Set up replication from local to cloud.

**Pros**:
- Automatic sync
- Backup redundancy

**Cons**:
- More complex setup
- Higher costs

## Recommended Approach: Option 2 (Consolidate)

### Step 1: Backup Current Data
```bash
# Export local trails data
pg_dump -h 127.0.0.1 -U strapi_dev -d strapi_clean -t trails > trails_backup.sql

# Export Strapi structure
pg_dump -h 35.230.146.79 -U hike_admin -d hikes_db > strapi_backup.sql
```

### Step 2: Add Trails Table to Production DB
```sql
-- Connect to hikes_db on Google Cloud
-- Run the trails table creation SQL from backend/schema.sql
```

### Step 3: Import GPX Data
```bash
# Import trails data to production database
psql -h 35.230.146.79 -U hike_admin -d hikes_db -f trails_backup.sql
```

### Step 4: Update Backend Configuration
Update production backend to use single database:

```javascript
// Production backend should connect to:
// Host: 35.230.146.79
// Database: hikes_db  (same as Strapi)
// User: hike_admin (same as Strapi)
```

### Step 5: Update Local Development
Update local setup to match production structure.

## Environment Variables to Update

### Backend Production (.env):
```
DB_HOST=35.230.146.79
DB_NAME=hikes_db
DB_USER=hike_admin
DB_PASSWORD="foaA99&I5Und!k"
DB_PORT=5432
```

### Verification Steps
1. [ ] Production backend can query `trails` table
2. [ ] Production Strapi still works
3. [ ] Production website shows maps and elevation
4. [ ] Test adding new GPX track end-to-end

## Rollback Plan
- Keep local database backups
- Keep production database backups
- Document exact commands used for rollback

## Timeline
- **Preparation**: 1-2 hours
- **Migration**: 2-3 hours
- **Testing**: 1 hour
- **Total**: 4-6 hours