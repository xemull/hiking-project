require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fetch = require('node-fetch');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const app = express();
const port = process.env.PORT || 4000;
app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://frontend-service-623946599151.europe-west2.run.app'  // Production frontend
  ],
  credentials: true
}));
app.use(express.json()); // Add this line to parse JSON bodies

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
            'populate[mainImage]=true',
            'populate[countries]=true',
            'populate[sceneries]=true',
            'populate[months]=true',
            'populate[accommodations]=true',
            'populate[Videos]=true',
            'populate[Blogs]=true',
            'populate[landmarks]=true',
            'populate[Books][populate][0]=cover_image'
        ].join('&');
        
        const strapiRes = await fetch(`${STRAPI_URL}/api/hikes?${populateParams}`);
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
            'populate[mainImage]=true',
            'populate[countries]=true',
            'populate[sceneries]=true',
            'populate[months]=true',
            'populate[accommodations]=true',
            'populate[Videos]=true',
            'populate[Blogs]=true',
            'populate[landmarks]=true',
            'populate[Books][populate][0]=cover_image',
            `filters[hike_id][$eq]=${id}`
        ].join('&');
        
        const strapiRes = await fetch(`${STRAPI_URL}/api/hikes?${populateParams}`);
        
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

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email } = req.body;
    
    // Basic email validation
    if (!email || !email.includes('@')) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address' 
        });
    }
    
    try {
        // Create table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT true
            )
        `);
        
        // Insert email (ignore if already exists)
        const query = `
            INSERT INTO newsletter_subscribers (email) 
            VALUES ($1) 
            ON CONFLICT (email) DO UPDATE SET 
                subscribed_at = CURRENT_TIMESTAMP,
                is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(query, [email.toLowerCase().trim()]);
        
        console.log('Newsletter subscription:', email);
        res.json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter!' 
        });
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Subscription failed. Please try again.' 
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});