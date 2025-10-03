# Adding New Hikes to Trailhead - Complete Workflow

This document outlines the complete process for adding new hiking trails to the Trailhead platform.

## Overview

The Trailhead platform consists of three main components:
- **Strapi CMS**: Content management and data storage
- **Backend API**: Data aggregation and processing
- **Frontend**: User-facing website

## Prerequisites

- Access to Strapi admin panel: https://cms-service-623946599151.europe-west2.run.app/admin
- High-quality images for the hike (main image + optional additional images)
- **GPX track file** (essential for map display and elevation profile)
- Hike research completed (route, logistics, accommodation, etc.)
- Local development environment setup (for GPX processing)

## Complete Workflow

### Phase 1: Content Preparation

#### 1.1 Research & Gather Information
- [ ] **Basic Details**
  - Hike name and alternative names
  - Country/countries
  - Total distance (km)
  - Elevation gain (meters)
  - Difficulty level (Easy/Moderate/Difficult)
  - Best hiking season
  - Route type (Loop/Point-to-Point/Out-and-Back)

- [ ] **Detailed Information**
  - Comprehensive description (2-3 paragraphs)
  - Logistics (getting there & back)
  - Accommodation options and highlights
  - Waypoints/key locations
  - Terrain profile (Mountainous/Coastal/Forest/etc.)

- [ ] **Visual Content**
  - **Main hero image** (landscape, high-quality, 1920x1080+ recommended)
  - Additional images if needed
  - Guidebook covers (if applicable)

- [ ] **GPX Track File**
  - **Source**: From GPS recording, Wikiloc, AllTrails, or official sources
  - **Format**: Standard GPX format (.gpx)
  - **Quality**: Complete route with elevation data preferred
  - **Naming**: Descriptive filename (e.g., "tour_du_mont_blanc.gpx")

- [ ] **Supplementary Content**
  - Related articles/blog posts
  - YouTube videos
  - Guidebook recommendations
  - External links

#### 1.2 Image Preparation
- **Format**: JPG or PNG
- **Main Image**: Landscape orientation, minimum 1200x800px
- **Quality**: High resolution for best results
- **Naming**: Descriptive filenames (e.g., "tour_du_mont_blanc_hero.jpg")

### Phase 2: GPX Track Processing

**⚠️ Important: GPX processing must be done BEFORE Strapi entry to get the trail ID**

#### 2.1 Process GPX File Locally
1. **Place GPX file** in `/data/` directory
2. **Edit `backend/setup-and-seed.js`**:
   ```javascript
   const filename = '../data/your-hike.gpx'; // Update this line
   ```
3. **Run GPX ingestion**:
   ```bash
   cd backend
   node setup-and-seed.js
   ```
4. **Note the trail ID** from the output for Strapi entry

#### 2.2 Deploy GPX Data to Production
1. **Export trail data** from local database
2. **Import to production** database via Cloud SQL proxy
3. **Verify** backend API serves the new trail

*See [GPX_WORKFLOW.md](./GPX_WORKFLOW.md) for detailed GPX processing instructions*

### Phase 3: Strapi CMS Data Entry

#### 3.1 Access Strapi Admin
1. Navigate to https://cms-service-623946599151.europe-west2.run.app/admin
2. Log in with admin credentials
3. Go to **Content Manager** → **Hikes**

#### 3.2 Create New Hike Entry
1. Click **"Create new entry"**
2. Fill in all required fields:

**Basic Information:**
- **Title**: Full hike name
- **Country**: Select/create country entries
- **Length**: Distance in kilometers (number)
- **Elevation_gain**: Total ascent in meters (number)
- **Difficulty**: Easy/Moderate/Difficult
- **Best_time**: e.g., "June to September"
- **Continent**: Europe/Asia/North America/etc.
- **routeType**: Loop/Point-to-Point/Out-and-Back
- **terrainProfile**: Mountainous/Coastal/Forest/etc.
- **hike_id**: Set to the trail ID from GPX processing (CRITICAL for map integration)

**Content Fields:**
- **Description**: Rich text with formatting
  - 2-3 paragraphs
  - Use **bold** for emphasis on key points
  - Include unique selling points and character of the hike

- **Logistics**: Rich text
  - Getting there and back
  - Transportation options
  - Key hubs and connections

- **Accomodation**: Rich text with lists
  - Accommodation types available
  - Highlight special/notable places to stay
  - Use bullet points for specific recommendations

- **Waypoints**: Text field
  - Comma-separated key locations
  - e.g., "Chamonix, Les Houches, Courmayeur, Champex-Lac"

#### 2.3 Upload and Associate Images
1. **Upload Main Image**:
   - Go to **Media Library**
   - Click **"Upload files"**
   - Select your main hero image
   - Wait for upload to complete (including automatic resize versions)

2. **Associate Main Image**:
   - In the hike entry, find **"mainImage"** field
   - Click to select from Media Library
   - Choose your uploaded image
   - **Important**: Strapi automatically creates multiple sizes (thumbnail, small, medium, large)

3. **Additional Images** (if applicable):
   - Upload additional images to Media Library
   - Associate with appropriate fields

#### 2.4 Configure Relations
1. **Countries**: Select/create country entries
2. **Sceneries**: Select applicable scenery types (Alpine, Coastal, Forest, etc.)
3. **Accommodations**: Select accommodation types (Hotels, Mountain Huts, etc.)
4. **Months**: Select best hiking months

#### 2.5 Advanced Configuration
- **hike_id**: Leave empty (auto-generated)
- **featured**: Check only if this should be the featured hike on homepage
- **Books**: Add guidebook entries if applicable
- **Videos**: Add YouTube video entries if applicable
- **Blogs**: Add related article links if applicable

#### 2.6 Save and Publish
1. Click **"Save"**
2. Click **"Publish"** to make it live
3. Verify all fields are filled correctly

### Phase 3: System Integration

#### 3.1 Cache Clearing
The system includes automatic cache clearing, but you can manually trigger it:
1. Backend cache clears automatically every few hours
2. Frontend rebuilds on deployment
3. Manual cache clear: Contact system administrator if needed

#### 3.2 Verification
1. **Backend API Test**:
   - Check: https://backend-service-623946599151.europe-west2.run.app/api/hikes
   - Verify new hike appears in list

2. **Frontend Display**:
   - Check: https://trailhead.at
   - New hike should appear in the grid
   - Individual hike page: https://trailhead.at/hike/[slug]

3. **Image Quality Check**:
   - Verify main image displays in high quality
   - Check both homepage grid and individual hike page
   - Ensure proper image format selection (medium for grid, large for hero)

### Phase 4: Content Optimization

#### 4.1 SEO Optimization
- **Title**: Descriptive and search-friendly
- **Description**: Should work well for meta descriptions
- **Slug**: Automatically generated from title
- **Images**: Should have descriptive filenames

#### 4.2 Content Review
- [ ] Description is engaging and informative
- [ ] Logistics information is accurate and helpful
- [ ] Accommodation details are current
- [ ] All metadata fields are completed
- [ ] Images are high quality and properly associated

#### 4.3 Featured Hike Management
- **Only one hike should be featured at a time**
- To change featured hike:
  1. Uncheck "featured" on current featured hike
  2. Check "featured" on new hike
  3. Save both entries
  4. Frontend will update within 2 minutes

## Technical Notes

### Image Handling
- Strapi automatically generates multiple image sizes:
  - `thumbnail` (smallest)
  - `small` (grid cards)
  - `medium` (preferred for cards)
  - `large` (hero images)
  - `original` (full size)

### Caching Behavior
- **Strapi content**: Updates immediately
- **Backend API**: Caches for performance, auto-refreshes
- **Frontend**: Client-side cache (2 minutes for featured hike, 5 minutes for hikes list)

### Slug Generation
- Automatically created from hike title
- Converted to URL-friendly format
- Used for individual hike page URLs

## Quality Checklist

Before publishing a new hike, verify:

- [ ] **Content Complete**
  - All required fields filled
  - Description is 2-3 paragraphs minimum
  - Logistics and accommodation information provided
  - Waypoints listed

- [ ] **Images**
  - High-quality main image uploaded
  - Main image properly associated
  - Image displays correctly on frontend

- [ ] **Metadata**
  - Countries correctly selected
  - Sceneries and accommodations tagged
  - Difficulty and best time specified
  - Route type and terrain profile set

- [ ] **Frontend Display**
  - Hike appears in homepage grid
  - Individual hike page loads correctly
  - Images display in high quality
  - All sections render properly

- [ ] **SEO**
  - Title is descriptive
  - Content is well-formatted
  - Images have proper alt text

## Troubleshooting

### Common Issues

**1. Images not displaying:**
- Check that main image is properly associated in Strapi
- Verify image uploaded successfully to Media Library
- Ensure image format is supported (JPG/PNG)

**2. Hike not appearing on frontend:**
- Verify hike is published (not just saved)
- Check that all required fields are filled
- Wait 2-5 minutes for cache to refresh

**3. Poor image quality:**
- Upload higher resolution source image
- Check that medium/large formats are being used
- Avoid uploading pre-compressed images

**4. Featured hike not updating:**
- Ensure only one hike has "featured" checked
- Wait 2 minutes for frontend cache to refresh
- Check backend API returns correct featured hike

### Getting Help

For technical issues:
- Check this documentation first
- Review system logs in Strapi admin
- Contact system administrator if problems persist

---

*Last updated: September 2025*
*System version: Production deployment with optimized image handling*