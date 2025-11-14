# Cloud SQL to Supabase Migration History

## Migration Goal
Migrate Strapi CMS database from Google Cloud SQL to Supabase to reduce costs while maintaining all functionality, particularly TMB (Tour du Mont Blanc) stage and accommodation relationships.

## Timeline & Key Events

### Phase 1: Initial Migration Attempt
**Objective**: Move from Cloud SQL to Supabase

**Actions Taken**:
1. Set up Supabase PostgreSQL database
2. Updated CMS `.env.production` to point to Supabase
3. Deployed CMS with Supabase connection
4. Attempted to let Strapi auto-create tables

**Problems Encountered**:
- ❌ Strapi v5 in production mode doesn't auto-create tables
- ❌ Admin panel returned "An error occurred while requesting the API"
- ❌ Database connection worked but tables were missing
- ❌ Logs showed: `relation "public.admin_users" does not exist`

### Phase 2: Fresh Start Attempt
**Objective**: Create fresh Strapi instance with clean schema

**Actions Taken**:
1. Created new schema `strapi_fresh` in Supabase
2. Set `DATABASE_SCHEMA=strapi_fresh` in environment
3. Changed `NODE_ENV=development` to force table creation
4. Rebuilt and deployed CMS

**Problems Encountered**:
- ❌ CMS didn't respect `DATABASE_SCHEMA` setting
- ❌ Continued to use `public` schema
- ❌ Development mode still didn't auto-create tables on Cloud Run
- ❌ Deployment timed out with DATABASE_SCHEMA variable

**Lessons Learned**:
- Strapi v5 requires manual database setup or migration from existing instance
- Cloud Run environment differs from local - table creation doesn't work automatically
- Cannot rely on Strapi to bootstrap schema in serverless environment

### Phase 3: Nuclear Option - Drop All Tables
**Objective**: Clear Supabase and start completely fresh

**Actions Taken**:
1. Created `drop_all_tables_public.py` script
2. Dropped all 60 tables from Supabase public schema
3. Attempted fresh Strapi deployment

**Problems Encountered**:
- ❌ Same issue - tables didn't auto-create
- ❌ Lost all existing data in Supabase
- ❌ No backup of Supabase data taken beforehand

**Critical Mistake**:
- Dropped tables without having a complete backup strategy
- Assumed Strapi would recreate everything automatically

### Phase 4: TMB Content Crisis
**Objective**: Recover lost TMB data

**Discovery**:
- TMB Stages content type exists but shows 0 entries in admin panel
- TMB Accommodations content type exists but shows 0 entries
- Other content types (hikes, countries) also empty
- This was a disaster - back to square one after ~1 week of work

**User Request**:
"Create a completely fresh instance of strapi with a new database. Add content back one by one, so we can check it as it progresses. Leave tmbstage and tmbaccommodation to the end; I might need to create these manually."

**Actions Taken**:
1. User rejected fresh instance approach
2. User asked to "restore old database, but don't clear anything"
3. Pivoted strategy to find Cloud SQL backups

### Phase 5: Cloud SQL Rediscovery
**Objective**: Find original data source

**Discovery Process**:
1. Listed Cloud SQL instances:
   - `strapi-db` (35.230.146.79)
   - `trailhead-new-db` (34.39.30.216)
   - `hiking-project-db-233ae46e` (34.39.12.47)

2. Found automated backup on `trailhead-new-db`:
   - Backup ID: 1760777071712
   - Date: October 18, 2025
   - Status: SUCCESSFUL

3. Checked databases in `trailhead-new-db`:
   - postgres (likely empty)
   - hikes_db (suspected to have data)
   - strapi_test (has schema but no content)

**User Discovery**:
- User checked Cloud Shell and confirmed: `strapi_test` has TMB table structures
- User reported: "tmbstages etc" found in database

### Phase 6: Restore to Cloud SQL
**Objective**: Get live site back up using Cloud SQL

**Strategy Shift**:
- Stop trying to migrate to Supabase immediately
- Point CMS back to Cloud SQL first
- Verify everything works
- Then migrate to Supabase

**Actions Taken**:
1. Updated `.env.production`:
   ```
   DATABASE_HOST=34.39.30.216
   DATABASE_PORT=5432
   DATABASE_NAME=strapi_test
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=foaA99&I5Und!k
   ```

2. Changed `NODE_ENV=development` back to `NODE_ENV=production`

3. Rebuilt CMS:
   ```bash
   cd tmb-cms-clean && gcloud builds submit --tag gcr.io/trailhead-mvp/cms
   ```

4. Deployed CMS:
   ```bash
   gcloud run deploy cms-service --image gcr.io/trailhead-mvp/cms:latest
   ```

**Results**:
- ✅ CMS deployed successfully
- ✅ Admin panel loads
- ✅ No database connection errors
- ❌ Content types exist but show no content
- ❌ Admin panel displays 0 entries for all content types
- ❌ Live website returns 404 for all pages

### Phase 7: Current Crisis - Database Discovery
**Objective**: Understand why content is missing

**Investigation**:
- CMS logs show successful queries for other content types (hikes, accommodations, countries)
- But NO queries for TMB-specific content
- Admin panel shows content types but no entries

**Attempted Database Check**:
- Created `check_strapi_test_data.py` to query database directly
- ❌ Connection timeout from local machine
- Cloud SQL blocks direct external connections

**Critical Discovery** (Latest):
User checked Cloud Shell and found:
- **strapi_test database**: Has schema/tables but NO DATA
- **hikes_db database**: Contains all the actual TMB content!

## TMB Data Found in hikes_db

### Confirmed Content in trailhead-new-db → hikes_db:

1. **tmb_stages**: 22 rows
   - Stage information for Tour du Mont Blanc

2. **tmbaccommodations**: 162 rows
   - Accommodation listings along the route

3. **tmbaccommodations_stage_lnk**: 162 rows
   - One-to-one relationship links between accommodations and stages

4. **tmbaccommodations_cmps**: 364 rows
   - Component data (dynamic zones, repeatable fields)

**Source**: `summarize_tmb.py` query results

## Current Status

### What's Working
- ✅ CMS service deployed and running
- ✅ Admin panel loads without errors
- ✅ Content type definitions exist
- ✅ Database connection established
- ✅ TMB data located in `hikes_db`

### What's Broken
- ❌ CMS pointing to wrong database (`strapi_test` instead of `hikes_db`)
- ❌ All content showing as empty (0 entries)
- ❌ Live website returning 404 for all pages
- ❌ Frontend cannot fetch content from CMS API

### Root Cause
**Database Mismatch**: The CMS is connected to `strapi_test` which only has the schema/structure but no actual content. All the real data is in `hikes_db`.

## Key Challenges Encountered

### 1. Strapi v5 Production Mode Limitations
- Cannot auto-create tables in production environment
- Requires pre-existing database with schema
- Different behavior from Strapi v4

### 2. Cloud Run Environment Constraints
- No persistent storage between deployments
- Cannot run database migrations automatically
- Requires fully-configured database before deployment

### 3. Multiple Database Confusion
- 3 Cloud SQL instances with multiple databases each
- Unclear which database contained live data
- `strapi_test` vs `hikes_db` naming confusion

### 4. Connection Issues
- Cannot connect to Cloud SQL from local machine (timeout)
- Can only access via Cloud Shell or Cloud Run services
- Made debugging difficult

### 5. Backup Strategy Gaps
- No automated backups of Supabase before dropping tables
- Relied on Cloud SQL backups from October (outdated?)
- Lost recent changes when clearing Supabase

### 6. Strapi v5 Document System
- Uses `document_id` for draft/publish system
- Relationships more complex than v4
- TMB accommodations ↔ stages relationship critical

## Lessons Learned

1. **Always backup before destructive operations**
   - Should have exported complete Supabase dump before dropping tables
   - Should have verified Cloud SQL backups were recent

2. **Test in staging first**
   - Should have created test database to verify migration process
   - Should have tested Strapi table creation in Cloud Run environment

3. **Understand database topology**
   - Need clear map of which database contains what
   - Should have documented live configuration before making changes

4. **Strapi v5 is different from v4**
   - Production mode behavior changed
   - Cannot rely on auto-bootstrapping
   - Need proper migration strategy

5. **Cloud services have limitations**
   - Cloud Run is stateless
   - Cloud SQL has connection restrictions
   - Need appropriate tools for each environment

## Next Steps to Resolve

### Immediate Priority: Restore Live Site

1. **Update CMS database connection**
   ```
   DATABASE_NAME=hikes_db  # Change from strapi_test
   ```

2. **Rebuild and redeploy CMS**
   ```bash
   cd tmb-cms-clean && gcloud builds submit --tag gcr.io/trailhead-mvp/cms
   gcloud run deploy cms-service --image gcr.io/trailhead-mvp/cms:latest
   ```

3. **Verify in admin panel**
   - Check TMB Stages shows 22 entries
   - Check TMB Accommodations shows 162 entries
   - Test relationships between stages and accommodations

4. **Test live site**
   - Visit existing hike pages
   - Verify TMB accommodation directory works
   - Confirm no 404 errors

### Secondary Priority: Complete Supabase Migration

1. **Export hikes_db from Cloud SQL**
   ```bash
   gcloud sql export sql trailhead-new-db \
     gs://trailhead-backup-temp/hikes_db_export.sql \
     --database=hikes_db
   ```

2. **Import to Supabase**
   - Download export from Cloud Storage
   - Use psql to import to Supabase
   - Verify all tables and data present

3. **Update CMS to Supabase**
   - Change DATABASE_HOST to Supabase
   - Update credentials
   - Deploy and test

4. **Update backend service**
   - Ensure backend also uses Supabase
   - Test all API endpoints

5. **Shutdown Cloud SQL**
   - After confirming everything works
   - Archive final backup
   - Delete Cloud SQL instances to save costs

## Migration Checklist (For Next Attempt)

- [ ] Document current live configuration
- [ ] Create complete backup of current database
- [ ] Export hikes_db to local SQL file
- [ ] Create Supabase test database
- [ ] Import to test database
- [ ] Deploy CMS pointing to test database
- [ ] Verify all content appears correctly
- [ ] Test all relationships work
- [ ] Run full site test suite
- [ ] Create production Supabase database
- [ ] Import verified data
- [ ] Update production CMS configuration
- [ ] Deploy production CMS
- [ ] Monitor for 24 hours
- [ ] Archive Cloud SQL backups
- [ ] Delete Cloud SQL instances

## Risk Mitigation

1. **Always have rollback plan**
   - Keep Cloud SQL running until Supabase proven stable
   - Maintain multiple backups
   - Document exact steps to revert

2. **Test everything twice**
   - Use staging environment
   - Verify each step before proceeding
   - Check both admin panel AND live site

3. **Communication**
   - Update user on progress
   - Confirm before destructive operations
   - Document discoveries immediately

## Conclusion

The migration from Cloud SQL to Supabase has been challenging due to:
- Strapi v5's production mode limitations
- Multiple databases causing confusion
- Lack of proper backup strategy
- Insufficient testing before major changes

Currently, the project is in a broken state because the CMS is connected to an empty database (`strapi_test`) while the actual data lives in `hikes_db`. The immediate fix is to point the CMS to the correct database, then proceed with the Supabase migration more carefully.

The key lesson: **Always verify which database contains the live data before making changes**.
