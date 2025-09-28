# Adding New Hikes to Production

## Prerequisites
- [ ] GPX file processed locally with `ingest-gpx.js` (to get the trail data)
- [ ] Cloud SQL Proxy installed and configured
- [ ] Access to Strapi admin panel

## Step 1: Add GPX Data to Production Database

### 1.1 Connect to Production Database
```bash
# Start Cloud SQL Proxy
cloud-sql-proxy trailhead-mvp:europe-west2:hiking-project-db-233ae46e --port=5433

# In another terminal, connect to database
psql -h 127.0.0.1 -p 5433 -U hike_admin -d hikes_db
```

### 1.2 Insert Trail Data
Get the trail data from your local ingestion, then run:
```sql
INSERT INTO trails (id, name, track, simplified_profile, distance_km, ascent_m)
VALUES (
    9,  -- Next available ID
    'Your Hike Name',
    ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[lng,lat,elev],...]}'),
    '[[0,100],[5,200],[10,150]]',  -- Simplified elevation points
    150,  -- Distance in km
    2500  -- Total ascent in meters
);
```

**Note the ID number** - you'll need it for Strapi.

## Step 2: Add Content to Strapi

### 2.1 Access Strapi Admin
Go to: https://cms-service-623946599151.europe-west2.run.app/admin

### 2.2 Create Hike Entry
1. Navigate to "Hikes" in sidebar
2. Click "Create new entry"
3. Fill in all fields:
   - **hike_id**: Match the trail ID from Step 1 (e.g., 9)
   - Title, Description, Country, etc.
   - Upload images
   - Set relations (countries, sceneries, accommodations)
4. **Save and Publish**

## Step 3: Verify
1. Visit your hike page: `https://trailhead.at/hike/your-hike-slug`
2. Check that map and elevation appear
3. Test API directly: `https://backend-service-*.run.app/api/hikes/slug/your-slug`

## Step 4: Clear Cache (If Needed)
If data doesn't appear immediately:
```bash
curl -X POST https://backend-service-623946599151.europe-west2.run.app/api/cache/clear
```

## No Code Deployment Needed!
Since you're only adding data (not changing code), you don't need to rebuild/deploy any services.

## Troubleshooting
- **Map not showing**: Check that `hike_id` matches between Strapi and database
- **Elevation not showing**: Verify `simplified_profile` is valid JSON array
- **Cache issues**: Use cache clear endpoint or wait for TTL expiry

## Local Development Sync
If you want to test locally first:
1. Add to local database using `ingest-gpx.js`
2. Add to local Strapi
3. Test locally
4. Then repeat the process for production