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

// Endpoint to get a single hike by its ID
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

        // FINAL: Deep populate Books with cover_image, populate other components
        const populateParams = [
            'populate[Books][populate]=cover_image',  // Deep populate Books with cover_image
            'populate[Blogs]=*',                      // Populate Blogs component
            'populate[Videos]=*',                     // Populate Videos component
            'populate[landmarks]=*',                  // Populate landmarks component
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