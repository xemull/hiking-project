# New Hike Quick Checklist

## Pre-Content Preparation
- [ ] Research completed
- [ ] High-quality main image ready (1200x800px minimum)
- [ ] **GPX track file ready** (essential for maps)
- [ ] All text content written and reviewed

## GPX Processing (FIRST!)
- [ ] **GPX file placed** in `/data/` directory
- [ ] **`setup-and-seed.js` updated** with correct filename
- [ ] **GPX script run** locally (`node setup-and-seed.js`)
- [ ] **Trail ID noted** for Strapi entry
- [ ] **GPX data deployed** to production database

## Strapi CMS Entry (https://cms-service-623946599151.europe-west2.run.app/admin)

### Required Fields
- [ ] **Title**: Full hike name
- [ ] **Country**: Selected/created
- [ ] **Length**: Distance in km (number)
- [ ] **Elevation_gain**: Total ascent in meters
- [ ] **Difficulty**: Easy/Moderate/Difficult
- [ ] **Best_time**: e.g., "June to September"
- [ ] **Description**: 2-3 paragraphs with **bold** emphasis
- [ ] **Logistics**: Getting there & back info
- [ ] **Accomodation**: Where to stay + highlights
- [ ] **Waypoints**: Key locations (comma-separated)
- [ ] **hike_id**: Trail ID from GPX processing (CRITICAL!)

### Advanced Fields
- [ ] **Continent**: Selected
- [ ] **routeType**: Loop/Point-to-Point/Out-and-Back
- [ ] **terrainProfile**: Mountainous/Coastal/etc.
- [ ] **Sceneries**: Tagged (Alpine, Forest, etc.)
- [ ] **Accommodations**: Tagged (Hotels, Huts, etc.)
- [ ] **Months**: Best hiking months selected

### Images & Media
- [ ] **Main image uploaded** to Media Library
- [ ] **Main image associated** with hike entry
- [ ] **Image quality verified** (check frontend display)

### Publishing
- [ ] **Save** entry
- [ ] **Publish** entry
- [ ] **Featured status** set correctly (only one featured at a time)

## Verification
- [ ] **Backend API**: Hike appears in https://backend-service-623946599151.europe-west2.run.app/api/hikes
- [ ] **Homepage**: Hike visible in grid at https://trailhead.at
- [ ] **Individual page**: https://trailhead.at/hike/[slug] loads correctly
- [ ] **Image quality**: High-res images display properly
- [ ] **All sections render**: Description, logistics, stats, etc.

## Notes
- Cache refresh: 2-5 minutes for changes to appear
- Image formats: System auto-generates thumbnail, small, medium, large
- Featured hike: Changes appear within 2 minutes
- Slug: Auto-generated from title for URL

---
*Quick reference for adding hikes to Trailhead platform*