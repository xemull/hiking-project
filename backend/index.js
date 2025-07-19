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
  password: '***REMOVED***', // Your correct password
  port: 5433,
});

// Endpoint to get all hikes
app.get('/api/hikes', async (req, res) => {
    try {
        const query = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes';
        const { rows } = await pool.query(query);

        const hikes = rows.map(hike => {
            // FIX: Add a fallback for potentially null track data
            const cleanTrackString = (hike.track || '{}').replace(/NaN/g, 'null');
            return {
                ...hike,
                track: JSON.parse(cleanTrackString)
            };
        });
        
        res.json(hikes);

    } catch (error) {
        console.error('Error in /api/hikes:', error);
        res.status(500).send('Error fetching hikes');
    }
});

// Endpoint to get a single hike by its ID
app.get('/api/hikes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const geoQuery = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track, created_at FROM Hikes WHERE id = $1';
        // FIX: Use the correct variable name 'geoQuery' here
        const geoResult = await pool.query(geoQuery, [id]);

        if (geoResult.rows.length === 0) {
            return res.status(404).send('Hike not found in geodatabase');
        }
        
        const cleanTrackString = (geoResult.rows[0].track || '{}').replace(/NaN/g, 'null');
        const hikeData = { ...geoResult.rows[0], track: JSON.parse(cleanTrackString) };

        const strapiRes = await fetch(`http://localhost:1337/api/hikes?populate=*`);
        const strapiCollection = await strapiRes.json();
        
        // FIX: Remove '.attributes' to match your Strapi data structure
        const strapiEntry = strapiCollection.data.find(entry => entry?.hike_id == id);
        
        // FIX: Merge the whole entry, not the non-existent '.attributes'
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