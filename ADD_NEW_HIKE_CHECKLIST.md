# Adding New GPX Hike - Checklist

## Prerequisites
- [ ] GPX file ready and accessible
- [ ] Backend server running
- [ ] Strapi CMS accessible

## Step 1: Ingest GPX into Database
1. [ ] Update `backend/ingest-gpx.js` with your GPX file path
   ```javascript
   const gpxFilePath = '../data/your-new-hike.gpx';
   ```
2. [ ] Run the ingestion script:
   ```bash
   cd backend
   node ingest-gpx.js
   ```
3. [ ] Note the assigned trail ID (e.g., "Trail inserted with ID: 9")

## Step 2: Create Strapi Content
1. [ ] Open Strapi admin panel (usually http://localhost:1337/admin)
2. [ ] Navigate to Content Manager → Hikes
3. [ ] Create new hike entry or edit existing one
4. [ ] **CRITICAL**: Set `hike_id` field to match the PostgreSQL trail ID from Step 1
5. [ ] Fill in all other content (title, description, etc.)
6. [ ] **Publish** the content

## Step 3: Clear All Caches
1. [ ] **Backend cache**: Either restart backend server OR use cache clear endpoint
2. [ ] **Frontend cache**: Click "🗑️ Clear Cache" button or run `await clearCache()` in browser console

## Step 4: Verify
1. [ ] Visit the hike page URL: `http://localhost:3000/hike/your-hike-slug`
2. [ ] **Check that map component appears** with GPS track
3. [ ] **Check that elevation profile appears**
4. [ ] Verify all content renders correctly

## Step 5: Test Different URLs
1. [ ] Test direct backend API: `http://localhost:4000/api/hikes/{id}`
2. [ ] Test slug endpoint: `http://localhost:4000/api/hikes/slug/{slug}`
3. [ ] Verify both return complete data with `track` field

## Troubleshooting
If map/elevation doesn't appear:
- [ ] Check browser console for "Track data received: null"
- [ ] Verify `hike_id` matches between Strapi and PostgreSQL
- [ ] Clear both frontend and backend caches
- [ ] Check backend logs for geodata query errors

## Cache Settings
- **Development**: Caches expire in 30s-1min
- **Production**: Caches expire in 5-15min
- **Emergency**: Use cache clear button or restart servers

## Environment Variables (Optional)
Add to `.env.local` to disable frontend cache in development:
```
NEXT_PUBLIC_BYPASS_CACHE=true
```