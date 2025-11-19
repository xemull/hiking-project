# Database Configuration

## Production Database (Supabase)

### Connection Details
- **Host:** `aws-1-eu-west-1.pooler.supabase.com`
- **Port:** `6543` (Pooler/Transaction mode)
- **Database:** `postgres`
- **Username:** `postgres.lpkaumowfuovlgjgilrt`
- **Password:** `ZZH4NxTL@W^D^h`
- **SSL:** Required (`DATABASE_SSL=true`)

### Direct Connection (IPv6)
```
postgresql://postgres:[PASSWORD]@db.lpkaumowfuovlgjgilrt.supabase.co:5432/postgres
```

### Connection String (IPv4 Compatible)
```
postgresql://postgres.lpkaumowfuovlgjgilrt:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

### Strapi Config File
`tmb-cms-clean/.env.production`

---

## Staging Database (Supabase)

### Connection Details
- **Host:** `aws-1-eu-west-1.pooler.supabase.com`
- **Port:** `6543` (Pooler/Transaction mode)
- **Database:** `postgres`
- **Username:** `postgres.pauwggqdunpztijfxdyv`
- **Password:** `ZZH4NxTL@W^D^h`
- **SSL:** Required (`DATABASE_SSL=true`)

### Direct Connection (IPv6)
```
postgresql://postgres:[PASSWORD]@db.pauwggqdunpztijfxdyv.supabase.co:5432/postgres
```

### Connection String (IPv4 Compatible)
```
postgresql://postgres.pauwggqdunpztijfxdyv:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

### Strapi Config File
`tmb-cms-clean/.env.staging`

### Data Status
- Restored from production backup: `backups/supabase_backup_20251119.sql`
- Date restored: November 19, 2025
- Contains: 83 TMB accommodations (matching production at time of backup)

---

## Switching Between Environments

### Switch to Staging (for testing schema changes)
```bash
cd tmb-cms-clean
cp .env.staging .env
npm run develop
```

Access Strapi at: http://localhost:1337

### Switch Back to Production
```bash
cd tmb-cms-clean
cp .env.production .env
npm run develop
```

### Check Current Environment
```bash
cd tmb-cms-clean
grep DATABASE_USERNAME .env
```
- If you see `postgres.lpkaumowfuovlgjgilrt` → Production
- If you see `postgres.pauwggqdunpztijfxdyv` → Staging

---

## Safe Schema Change Workflow

### Step 1: Test in Staging
1. Switch to staging environment
2. Start Strapi locally
3. Make content type changes in Strapi admin
4. Test thoroughly:
   - Create/edit test entries
   - Verify existing data is unaffected
   - Check API responses

### Step 2: Verify Database Changes
Connect to staging database and inspect schema changes:
```bash
PGPASSWORD="ZZH4NxTL@W^D^h" psql -h aws-1-eu-west-1.pooler.supabase.com -U postgres.pauwggqdunpztijfxdyv -d postgres -p 6543
```

### Step 3: Apply to Production
Once validated in staging:
1. Stop local Strapi
2. **Option A:** Make same changes via production Strapi admin panel (Cloud Run)
3. **Option B:** Update local config to production and deploy

---

## Backup Information

### Latest Backups (as of Nov 19, 2025)

**Supabase Production Database:**
- File: `backups/supabase_backup_20251119.sql`
- Size: 14 MB
- Format: PostgreSQL dump (pg_dump)

**Strapi Content (API Export):**
- Directory: `backups/strapi_content_20251119/`
- Size: 1.4 MB
- Format: JSON files
- Contents:
  - hikes.json (191 KB)
  - sceneries.json (582 KB)
  - media-files.json (275 KB)
  - tmb-stages.json (53 KB)
  - And more...

### Creating New Backups

**Supabase Database:**
```bash
PGPASSWORD="ZZH4NxTL@W^D^h" "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h aws-1-eu-west-1.pooler.supabase.com -U postgres.lpkaumowfuovlgjgilrt -d postgres -p 6543 -f backups/supabase_backup_YYYYMMDD.sql
```

**Strapi Content via API:**
```bash
mkdir -p backups/strapi_content_YYYYMMDD
curl -H "Authorization: Bearer [API_TOKEN]" "https://cms-service-623946599151.europe-west2.run.app/api/hikes?populate=*" -o backups/strapi_content_YYYYMMDD/hikes.json
```

### Restoring from Backup

**To Staging:**
```bash
PGPASSWORD="ZZH4NxTL@W^D^h" "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h aws-1-eu-west-1.pooler.supabase.com -U postgres.pauwggqdunpztijfxdyv -d postgres -p 6543 -f backups/supabase_backup_20251119.sql
```

**To Production (⚠️ USE WITH CAUTION):**
```bash
PGPASSWORD="ZZH4NxTL@W^D^h" "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h aws-1-eu-west-1.pooler.supabase.com -U postgres.lpkaumowfuovlgjgilrt -d postgres -p 6543 -f backups/supabase_backup_YYYYMMDD.sql
```

---

## Database Statistics

### Production Database
```sql
-- Count TMB accommodations
SELECT COUNT(*) FROM tmbaccommodations WHERE published_at IS NOT NULL;
-- Result: 83

-- List all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

### Quick Database Check
```bash
# Production
PGPASSWORD="ZZH4NxTL@W^D^h" "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h aws-1-eu-west-1.pooler.supabase.com -U postgres.lpkaumowfuovlgjgilrt -d postgres -p 6543 -t -c "SELECT COUNT(*) FROM tmbaccommodations WHERE published_at IS NOT NULL;"

# Staging
PGPASSWORD="ZZH4NxTL@W^D^h" "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h aws-1-eu-west-1.pooler.supabase.com -U postgres.pauwggqdunpztijfxdyv -d postgres -p 6543 -t -c "SELECT COUNT(*) FROM tmbaccommodations WHERE published_at IS NOT NULL;"
```

---

## Cloud Services

### Strapi CMS (Production)
- **URL:** https://cms-service-623946599151.europe-west2.run.app
- **Platform:** Google Cloud Run
- **Region:** europe-west2
- **Connected to:** Production Supabase database

### Backend API
- **URL:** https://backend-service-623946599151.europe-west2.run.app
- **Platform:** Google Cloud Run
- **Region:** europe-west2

### Frontend
- **URL:** https://frontend-service-623946599151.europe-west2.run.app
- **Platform:** Google Cloud Run
- **Region:** europe-west2

---

## Important Notes

⚠️ **Safety Reminders:**
- Always verify which environment is active before making changes
- Test all schema changes in staging first
- Create backups before making significant changes
- Staging and production databases are completely isolated
- Both environments currently share the same Google Cloud Storage bucket for media

💡 **Best Practices:**
- Back up databases weekly (automated recommended)
- Test schema migrations in staging
- Document all schema changes
- Keep staging database synced with production periodically

📝 **Future Improvements:**
- Consider separate GCS bucket for staging media
- Implement automated backup schedule
- Set up CI/CD pipeline with staging deployment
- Add database migration version control
