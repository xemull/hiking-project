const { Pool } = require('pg');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: 'eXstas1987X!', // <-- Your correct password
  port: 5433,
});

const runSchema = async () => {
  try {
    console.log("Step 1: Enabling PostGIS extension...");
    // First, try to enable the extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log("✅ PostGIS extension enabled (or already exists).");

    console.log("Step 2: Creating 'Hikes' table...");
    // Second, try to create the table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Hikes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          distance_km NUMERIC(5, 1),
          ascent_m INTEGER,
          track GEOGRAPHY(LINESTRING, 4326),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log("✅ 'Hikes' table created successfully!");

  } catch (error) {
    console.error('❌ An error occurred:', error);
  } finally {
    await pool.end();
  }
};

runSchema();