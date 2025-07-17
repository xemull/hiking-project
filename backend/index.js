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
        // This query now includes the track and simplified_profile
        const query = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes';
        const { rows } = await pool.query(query);

        // We also need to parse the track string for each hike
        const hikes = rows.map(hike => ({
            ...hike,
            track: JSON.parse(hike.track)
        }));

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
        const geoQuery = 'SELECT id, name, simplified_profile, ST_AsGeoJSON(track) as track FROM Hikes WHERE id = $1';
        const geoResult = await pool.query(geoQuery, [id]);

        if (geoResult.rows.length === 0) {
            return res.status(404).send('Hike not found in geodatabase');
        }
        const hikeData = { ...geoResult.rows[0], track: JSON.parse(geoResult.rows[0].track) };

        const strapiRes = await fetch(`http://localhost:1337/api/hikes?filters[hike_id][$eq]=${id}&populate=*`);
        const strapiCollection = await strapiRes.json();

        // --- THIS IS THE FIX ---
        // Find the entry without looking inside an 'attributes' object
        const strapiEntry = strapiCollection.data.find(entry => entry?.hike_id == id);

        // Merge the whole entry as the content
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