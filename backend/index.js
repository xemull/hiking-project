const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 4000;

// This line enables CORS
app.use(cors());

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: 'eXstas1987X!', // Your correct password
  port: 5433,
});

// This is the API endpoint to get all hikes
app.get('/api/hikes', async (req, res) => {
  try {
    const query = 'SELECT id, name, distance_km, ascent_m, ST_AsGeoJSON(track) as track, created_at FROM Hikes';
    const { rows } = await pool.query(query);

    // -- THIS IS THE FIX --
    // The 'track' from the DB is a string, so we parse it into a real object
    const hikes = rows.map(hike => {
      return {
        ...hike, // copy all the existing hike properties
        track: JSON.parse(hike.track) // overwrite the track property with the parsed object
      };
    });

    res.json(hikes);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching hikes from the database');
  }
});

// This endpoint now fetches from both PostgreSQL and Strapi
app.get('/api/hikes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get Geodata from PostgreSQL
    const geoQuery = 'SELECT id, name, ROUND((ST_Length(track) / 1000)::numeric, 1) AS distance_km, ascent_m, ST_AsGeoJSON(track) as track, created_at FROM Hikes WHERE id = $1';
    const geoResult = await pool.query(geoQuery, [id]);

    if (geoResult.rows.length === 0) {
      return res.status(404).send('Hike not found in geodatabase');
    }
    const hikeData = {
      ...geoResult.rows[0],
      track: JSON.parse(geoResult.rows[0].track)
    };

    // 2. Get Content from Strapi CMS
    // We filter to find the Strapi entry where 'hike_id' matches our hike's ID
    const strapiRes = await fetch(`http://localhost:1337/api/hikes?filters[hike_id][$eq]=${id}`);
    const strapiData = await strapiRes.json();
    
    // 3. Merge the two data sources
    const fullHikeData = {
      ...hikeData, // id, name, map data, etc. from Postgres
      content: strapiData.data[0] || null // guide, logistics, etc. from Strapi
    };

    res.json(fullHikeData);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching hike data');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});