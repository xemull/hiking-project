const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const app = express();
const port = 4000;
app.use(cors());

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: '***REMOVED***',
  port: 5433,
});

// Utility function to create URL-friendly slugs
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim('-');                   // Remove leading/trailing hyphens
}

// Endpoint to get all hikes
app.get('/api/hikes', async (req, res) => {
    try {
        const query = 'SELECT id, name FROM Hikes';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error in /api/hikes:', error);
        res.status(500).send('Error fetching hikes');
    }
});

// New endpoint to get hike by slug
app.get('/api/hikes/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    console.log('🔍 Looking for hike with slug:', slug);
    
    try {
        // First, get all hikes from Strapi to find the one with matching slug
        const populateParams = [
            'populate=*',
        ].join('&');
        
        const strapiRes = await fetch(`http://localhost:1337/api/hikes?${populateParams}`);
        const strapiCollection = await strapiRes.json();
        
        if (!strapiCollection.data || strapiCollection.data.length === 0) {
            console.error('Strapi returned no data:', strapiCollection);
            return res.status(404).send('No hikes found');
        }
        
        // Find hike by matching slug
        const matchingHike = strapiCollection.data.find(hike => {
            const hikeSlug = createSlug(hike.title);
            console.log(`Comparing "${slug}" with "${hikeSlug}" for hike: ${hike.title}`);
            return hikeSlug === slug;
        });
        
        if (!matchingHike) {
            console.log('❌ No hike found with slug:', slug);
            return res.status(404).send('Hike not found');
        }
        
        console.log('✅ Found matching hike:', matchingHike.title, 'with hike_id:', matchingHike.hike_id);
        
        // Now get the geodata using the hike_id
        const geoQuery = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes WHERE id = $1';
        const geoResult = await pool.query(geoQuery, [matchingHike.hike_id]);

        if (geoResult.rows.length === 0) {
            console.log('❌ No geodata found for hike_id:', matchingHike.hike_id);
            // Return Strapi data without geodata
            const fullHikeData = { 
                id: matchingHike.hike_id, 
                name: matchingHike.title, 
                track: null, 
                simplified_profile: null,
                content: matchingHike 
            };
            return res.json(fullHikeData);
        }
        
        const cleanTrackString = (geoResult.rows[0].track || '{}').replace(/NaN/g, 'null');
        const hikeData = { ...geoResult.rows[0], track: JSON.parse(cleanTrackString) };
        
        // LOG COUNTRIES DATA FOR DEBUGGING
        if (matchingHike && matchingHike.countries) {
            console.log('🌍 COUNTRIES FOUND:', matchingHike.countries.map(c => c.name).join(', '));
        }
        
        // Combine geodata with Strapi content
        const fullHikeData = { ...hikeData, content: matchingHike };
        
        console.log('🎉 Successfully found and combined hike data for:', matchingHike.title);
        res.json(fullHikeData);

    } catch (error) {
        console.error(`Error in /api/hikes/slug/${slug}:`, error);
        res.status(500).send('Error fetching hike data');
    }
});

// Original endpoint to get a single hike by its ID (keep for backwards compatibility)
app.get('/api/hikes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const geoQuery = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes WHERE id = $1';
        const geoResult = await pool.query(geoQuery, [id]);

        if (geoResult.rows.length === 0) {
            return res.status(404).send('Hike not found in geodatabase');
        }
        const cleanTrackString = (geoResult.rows[0].track || '{}').replace(/NaN/g, 'null');
        const hikeData = { ...geoResult.rows[0], track: JSON.parse(cleanTrackString) };

        // CONSERVATIVE: Use populate=* to avoid relation validation errors
        const populateParams = [
            'populate=*',
            `filters[hike_id][$eq]=${id}`
        ].join('&');
        
        const strapiRes = await fetch(`http://localhost:1337/api/hikes?${populateParams}`);
        
        const strapiCollection = await strapiRes.json();
        
        // Add null check for data
        if (!strapiCollection.data || strapiCollection.data.length === 0) {
            console.error('Strapi returned no data:', strapiCollection);
            const fullHikeData = { ...hikeData, content: null };
            return res.json(fullHikeData);
        }
        
        const strapiEntry = strapiCollection.data.find(entry => entry.hike_id == id);
        
        // LOG THE COVER IMAGE TO VERIFY IT'S THERE
        if (strapiEntry && strapiEntry.Books && strapiEntry.Books.length > 0) {
            console.log('📚 BOOK FOUND:', strapiEntry.Books[0].title);
            console.log('🖼️  COVER IMAGE URL:', strapiEntry.Books[0].cover_image?.url);
            console.log('📏 IMAGE DIMENSIONS:', 
                strapiEntry.Books[0].cover_image?.width, 'x', 
                strapiEntry.Books[0].cover_image?.height);
        }
        
        // LOG COUNTRIES DATA FOR DEBUGGING
        if (strapiEntry && strapiEntry.countries) {
            console.log('🌍 COUNTRIES FOUND:', strapiEntry.countries.map(c => c.name).join(', '));
        }
        
        const fullHikeData = { ...hikeData, content: strapiEntry || null };
        res.json(fullHikeData);

    } catch (error) {
        console.error(`Error in /api/hikes/${id}:`, error);
        res.status(500).send('Error fetching hike data');
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});