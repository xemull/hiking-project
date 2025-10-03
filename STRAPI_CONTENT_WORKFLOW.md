# Strapi Content Management Workflow

## Which Strapi Instance to Use?

### 🖥️ Local Instance (http://localhost:1337/admin)
**Use for:**
- ✅ Uploading new images/media files
- ✅ Testing content changes before production
- ✅ Developing new content types
- ✅ Making structural changes

### ☁️ Production Instance (https://cms-service-623946599151.europe-west2.run.app/admin)
**Use for:**
- ✅ Adding/editing text content (hike descriptions, titles, etc.)
- ✅ Creating new hikes
- ✅ Updating existing hike data
- ✅ Managing relationships (countries, sceneries, accommodations)
- ⚠️ **DO NOT upload images here** - they will disappear on container restart

## Complete Workflow

### Scenario 1: Adding a New Hike with Images

#### Step 1: Upload Images Locally
```bash
cd C:\Users\xemul\trailhead\tmb-cms-clean
npm run develop
```
1. Open http://localhost:1337/admin
2. Go to Content Manager → Upload → Files
3. Upload all images for the new hike
4. Note down image names/IDs

#### Step 2: Rebuild and Deploy
```bash
# Build Docker image
docker build -t strapi-cms .
docker tag strapi-cms europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest

# Deploy to Cloud Run
gcloud run deploy cms-service \
    --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest \
    --region europe-west2
```

#### Step 3: Add Content on Production
1. Go to https://cms-service-623946599151.europe-west2.run.app/admin
2. Create new hike entry
3. Add title, description, length, difficulty
4. Select the images you uploaded (they're now available in Media Library)
5. Add countries, sceneries, accommodations
6. Save and publish

### Scenario 2: Editing Existing Hike (Text Only)

**Use Production Instance directly:**
1. Go to https://cms-service-623946599151.europe-west2.run.app/admin
2. Navigate to Content Manager → Hikes
3. Select the hike to edit
4. Update text content
5. Save
6. Changes appear immediately on website ✅

**No rebuild needed!** Text content is stored in the database.

### Scenario 3: Replacing/Adding Images to Existing Hike

#### Step 1: Upload New Images Locally
```bash
cd C:\Users\xemul\trailhead\tmb-cms-clean
npm run develop
```
- Upload new images at http://localhost:1337/admin

#### Step 2: Rebuild and Deploy
```bash
docker build -t strapi-cms .
docker tag strapi-cms europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest
docker push europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest
gcloud run deploy cms-service --image europe-west2-docker.pkg.dev/trailhead-mvp/trailhead-repo/cms:latest --region europe-west2
```

#### Step 3: Update Hike on Production
1. Go to production CMS
2. Edit the hike
3. Replace/add the new images
4. Save

### Scenario 4: Deleting Images

**Important:** If you delete images, they're only removed from the database, not from the Docker image.

To properly remove images:
1. Delete from production CMS (removes database reference)
2. Delete from `tmb-cms-clean/public/uploads/` locally
3. Rebuild and deploy

## Quick Reference Table

| Task | Where to Do It | Rebuild Needed? |
|------|----------------|-----------------|
| Upload images | Local | ✅ Yes |
| Add text content | Production | ❌ No |
| Edit text content | Production | ❌ No |
| Create new hike | Production | ❌ No |
| Change content structure | Local | ✅ Yes |
| Delete images | Both (Local + Production) | ✅ Yes |
| Add countries/tags | Production | ❌ No |

## Database Sync

### Important: Database is Shared!
Both local and production Strapi connect to the **same Google Cloud PostgreSQL database**.

**This means:**
- Content changes on production appear locally (after refresh)
- Content changes locally appear on production (after refresh)
- Image **references** are shared, but image **files** must be in Docker image

### Example Flow:
1. Upload image "mountain.jpg" locally → saved to `public/uploads/`
2. Rebuild and deploy → image file now in production container
3. Create hike on production, select "mountain.jpg" → database stores reference
4. Refresh local Strapi → you see the new hike with the image

## Best Practices

### ✅ DO:
- Upload all images locally first, then deploy
- Add/edit text content directly on production
- Test new content types locally before deploying
- Keep `tmb-cms-clean/public/uploads/` in sync with production

### ❌ DON'T:
- Upload images on production (they will disappear)
- Edit content structure on production directly
- Delete images without rebuilding
- Forget to rebuild after uploading new images

## Troubleshooting

### "Image shows in Media Library but not on website"
- You forgot to rebuild/deploy after uploading
- Image exists in database but not in Docker container
- **Fix:** Rebuild and deploy

### "I added content on production but don't see it locally"
- Refresh your browser on local instance
- Database change should appear immediately

### "I uploaded image on production and it disappeared"
- This is expected behavior!
- Production uploads go to container's ephemeral storage
- **Fix:** Upload locally, then rebuild/deploy

## Summary

**Simple Rule:**
- **Images** → Always upload locally, then rebuild/deploy
- **Everything else** → Add/edit directly on production

This workflow ensures:
- ✅ Images persist and are always available
- ✅ Content updates are fast (no rebuild needed)
- ✅ No data loss
- ✅ Efficient development process
