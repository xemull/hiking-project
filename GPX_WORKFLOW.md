# GPX Track Ingestion Workflow

This document outlines how to add GPX track data for new hikes using the existing `setup-and-seed.js` script.

## Overview

GPX tracks provide:
- **Interactive maps** on hike detail pages
- **Elevation profiles** showing climb/descent
- **Accurate distance calculations**
- **Geographic route visualization**

## Current System Architecture

### Local Development
- **Script**: `backend/setup-and-seed.js`
- **Database**: Local PostgreSQL (`strapi_clean`)
- **Table**: `trails` (with PostGIS geography support)

### Production Database
- **Database**: Cloud SQL PostgreSQL (`trailhead-new-db`)
- **Integration**: Backend API serves combined Strapi + GPX data

## Step-by-Step GPX Ingestion

### Prerequisites
- [ ] Local development environment running
- [ ] PostgreSQL database `strapi_clean` accessible
- [ ] GPX file ready (`.gpx` format)
- [ ] Backend dependencies installed (`npm install` in `/backend`)

### 1. Prepare GPX File

**Supported Sources:**
- GPS recordings from hiking
- Downloaded from Wikiloc, AllTrails, etc.
- Official trail organization GPX files
- GPSies, Komoot exports

**File Requirements:**
- **Format**: Standard GPX 1.1
- **Structure**: Should contain `<trk>` (tracks) or `<rte>` (routes)
- **Elevation**: Elevation data preferred but not required
- **Size**: Reasonable point density (script will simplify)

**File Placement:**
```
trailhead/
├── backend/
│   └── setup-and-seed.js
├── data/
│   └── your-hike.gpx        <- Place GPX files here
```

### 2. Configure the Script

Edit `backend/setup-and-seed.js`:

```javascript
// Line 39: Update the filename
const filename = '../data/your-hike.gpx'; // <-- Change this
```

**Example for Tour du Mont Blanc:**
```javascript
const filename = '../data/tour_du_mont_blanc.gpx';
```

### 3. Run GPX Ingestion

```bash
cd backend
node setup-and-seed.js
```

**Expected Output:**
```
Parsing GPX file: ../data/your-hike.gpx...
Found 1 track(s). Combining segments...
Simplified elevation profile from 2847 to 156 points.
✅ Successfully added or updated "Tour du Mont Blanc" in the database!
```

### 4. Verify Ingestion

The script will:
- **Parse GPX data** (tracks or routes)
- **Calculate distance** using Haversine formula
- **Simplify elevation profile** (reduces points for performance)
- **Store in PostGIS format** (geographic LINESTRING)
- **Handle duplicates** (updates existing entries)

**Check results:**
```bash
# Connect to local database and verify
psql -U strapi_dev -d strapi_clean
SELECT id, name FROM trails ORDER BY id;
```

### 5. Connect to Strapi Content

In Strapi admin panel:
1. **Edit the hike entry**
2. **Find `hike_id` field**
3. **Set to the trail ID** from the database
4. **Save the entry**

The backend API will automatically combine:
- **Strapi content** (description, images, metadata)
- **GPX data** (map route, elevation profile)

## Production Deployment Strategy

### Current Challenge
- **GPX data** lives in local development database
- **Production** needs the same GPX data
- **No automated sync** between local and production databases

### Deployment Options

#### Option 1: Manual Database Migration (Current)
1. **Export from local:**
   ```sql
   pg_dump -U strapi_dev -h localhost -d strapi_clean -t trails --data-only > trails_export.sql
   ```

2. **Import to production:**
   ```bash
   # Connect to Cloud SQL proxy
   cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434

   # Import trails data
   psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db < trails_export.sql
   ```

#### Option 2: Cloud-Based GPX Processing (Recommended)
Create a production-safe version of the script that:
- Connects to production database
- Processes GPX files in a cloud environment
- Integrates with CI/CD pipeline

#### Option 3: API-Based Upload (Future Enhancement)
- Build admin interface for GPX upload
- Process GPX files server-side
- Automatic integration with Strapi content

### Current Production Process

**For immediate deployment:**

1. **Test locally first:**
   ```bash
   cd backend
   node setup-and-seed.js
   ```

2. **Export new trails:**
   ```bash
   pg_dump -U strapi_dev -h localhost -d strapi_clean -t trails --data-only --inserts > new_trails.sql
   ```

3. **Deploy to production database:**
   ```bash
   # Start Cloud SQL proxy
   cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434

   # Import (in separate terminal)
   psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -f new_trails.sql
   ```

4. **Update Strapi content:**
   - Set correct `hike_id` in production Strapi
   - Verify API returns combined data

## Detailed Production Deployment Steps

### Step 1: Verify Local GPX Processing
```bash
# Ensure your GPX was processed successfully
cd backend
node setup-and-seed.js

# Expected output:
# ✅ Successfully added or updated "Your Hike Name" in the database!
```

**Note the trail ID from the output - you'll need this for Strapi.**

### Step 2: Export Trail Data from Local Database

#### Option A: Export All Trails (Safest)
```bash
# Export all trails with INSERT statements
pg_dump -U strapi_dev -h localhost -d strapi_clean -t trails --data-only --inserts --no-owner --no-privileges > all_trails.sql
```

#### Option B: Export Only New/Specific Trail
```bash
# First, find the trail ID
psql -U strapi_dev -h localhost -d strapi_clean -c "SELECT id, name FROM trails ORDER BY created_at DESC LIMIT 5;"

# Export specific trail (replace ID with actual trail ID)
pg_dump -U strapi_dev -h localhost -d strapi_clean -t trails --data-only --inserts --no-owner --no-privileges --where="id=YOUR_TRAIL_ID" > new_trail.sql
```

### Step 3: Start Cloud SQL Proxy
```bash
# Download Cloud SQL Proxy if you don't have it
# https://cloud.google.com/sql/docs/postgres/connect-auth-proxy

# Start the proxy (this will run continuously)
cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434

# Expected output:
# Ready for new connections on localhost:5434
```

**⚠️ Keep this terminal window open - the proxy must stay running**

### Step 4: Import to Production Database

**Open a NEW terminal window and run:**

#### Option A: Import All Trails
```bash
# Import all trails (will update existing, add new)
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -f all_trails.sql

# Enter password when prompted: foaA99&I5Und!k
```

#### Option B: Import Specific Trail
```bash
# Import just the new trail
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -f new_trail.sql

# Enter password when prompted: foaA99&I5Und!k
```

**Expected output:**
```
INSERT 0 1
INSERT 0 1
...
```

### Step 5: Verify Production Database

```bash
# Check that your trail was imported
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -c "SELECT id, name, distance_km, ascent_m FROM trails ORDER BY created_at DESC LIMIT 5;"

# Expected output:
#  id |        name         | distance_km | ascent_m
# ----+--------------------+-------------+----------
#   5 | Your New Hike Name |      172.50 |    11000
#   4 | Tour du Mont Blanc |      170.00 |    10500
```

### Step 6: Test Backend API

```bash
# Test the trails endpoint
curl "https://backend-service-623946599151.europe-west2.run.app/api/hikes"

# You should see your new trail in the list
```

```bash
# Test specific trail by ID (replace 5 with your trail ID)
curl "https://backend-service-623946599151.europe-west2.run.app/api/hikes/5"

# Expected: JSON with track data and simplified_profile
```

### Step 7: Update Strapi with Trail ID

1. **Go to Strapi admin**: https://cms-service-623946599151.europe-west2.run.app/admin
2. **Edit your hike entry**
3. **Set `hike_id` field** to the trail ID from Step 5
4. **Save and publish**

### Step 8: Final Verification

```bash
# Test the combined endpoint (replace with your hike slug)
curl "https://backend-service-623946599151.europe-west2.run.app/api/hikes/slug/your-hike-name"

# Should return combined Strapi + GPX data
```

**Test frontend:**
1. Go to https://trailhead.at/hike/your-hike-slug
2. Verify map displays the route
3. Check elevation profile shows up

## Troubleshooting Production Deployment

### Cloud SQL Proxy Issues

**Connection refused:**
```bash
# Ensure you're authenticated with Google Cloud
gcloud auth login
gcloud auth application-default login
```

**Wrong instance name:**
```bash
# Verify the instance name
gcloud sql instances list
# Should show: trailhead-new-db
```

**Port already in use:**
```bash
# Use a different port
cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5435
# Then use -p 5435 in psql commands
```

### Database Import Issues

**Permission denied:**
```bash
# Verify user permissions
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -c "\du"
# hike_admin should have CREATE privileges
```

**Table doesn't exist:**
```bash
# Create trails table first
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -c "
CREATE TABLE IF NOT EXISTS trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  track GEOGRAPHY(LINESTRINGZ, 4326),
  simplified_profile JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);"
```

**Duplicate key errors:**
```bash
# If trail already exists, update instead:
# Edit your .sql file to use INSERT ... ON CONFLICT DO UPDATE
```

### API Issues

**Trail not appearing:**
- Check `hike_id` in Strapi matches trail ID in database
- Clear backend cache: `curl -X POST "https://backend-service-623946599151.europe-west2.run.app/api/cache/clear" -H "Content-Length: 0"`

**No map data:**
- Verify trail has valid track geometry
- Check browser console for API errors

## Security Notes

- **Never commit database passwords** to version control
- **Use environment variables** for production credentials
- **Limit database access** to necessary IPs only
- **Keep Cloud SQL proxy updated**

## Quick Reference Commands

```bash
# Export all trails
pg_dump -U strapi_dev -h localhost -d strapi_clean -t trails --data-only --inserts --no-owner --no-privileges > trails.sql

# Start proxy
cloud-sql-proxy trailhead-mvp:europe-west2:trailhead-new-db --port=5434

# Import to production
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -f trails.sql

# Verify import
psql -h 127.0.0.1 -p 5434 -U hike_admin -d hikes_db -c "SELECT id, name FROM trails ORDER BY id;"

# Test API
curl "https://backend-service-623946599151.europe-west2.run.app/api/hikes/TRAIL_ID"
```

## Technical Details

### Database Schema
```sql
CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  track GEOGRAPHY(LINESTRINGZ, 4326),  -- PostGIS geography
  simplified_profile JSONB,            -- Elevation profile
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Processing
- **Distance calculation**: Haversine formula between GPS points
- **Elevation simplification**: Douglas-Peucker algorithm (tolerance: 15)
- **Coordinate system**: WGS84 (EPSG:4326)
- **Output format**: GeoJSON for frontend consumption

### API Integration
Backend serves combined data:
```javascript
// GET /api/hikes/:id
{
  id: 1,
  name: "Tour du Mont Blanc",
  track: { /* GeoJSON LineString */ },
  simplified_profile: [[0, 1200], [5.2, 1450], ...],
  content: { /* Strapi CMS data */ }
}
```

## Troubleshooting

### Common Issues

**1. GPX file not found:**
```
ENOENT: no such file or directory, open '../data/your-hike.gpx'
```
- **Solution**: Check file path and ensure GPX file exists

**2. No track data found:**
```
No <trk> (track) or <rte> (route) data found in the GPX file.
```
- **Solution**: Verify GPX file contains `<trk>` or `<rte>` elements
- **Check**: Open GPX file in text editor to inspect structure

**3. Database connection error:**
```
connection to server at "localhost" (127.0.0.1), port 5432 failed
```
- **Solution**: Ensure PostgreSQL is running locally
- **Verify**: Connection credentials in script match your setup

**4. Duplicate name error:**
```
duplicate key value violates unique constraint "trails_name_key"
```
- **Expected**: Script updates existing entries with same name
- **Check**: Verify the update completed successfully

### Validation Steps

**1. Check GPX file structure:**
```bash
grep -E '<trk>|<rte>|<trkpt>|<rtept>' your-hike.gpx | head -10
```

**2. Verify database entry:**
```sql
SELECT id, name, ST_NumPoints(track) as points_count
FROM trails
WHERE name = 'Your Hike Name';
```

**3. Test API endpoint:**
```bash
curl "https://backend-service-623946599151.europe-west2.run.app/api/hikes/1"
```

## Best Practices

1. **File naming**: Use descriptive, consistent GPX filenames
2. **Point density**: Reasonable GPS point frequency (not every second)
3. **Elevation data**: Include elevation if available for better profiles
4. **Testing**: Always test locally before production deployment
5. **Backup**: Keep original GPX files for reference

---

*This workflow uses the existing `setup-and-seed.js` script for GPX processing*
*Last updated: September 2025*