// Import the pg package
const { Client } = require('pg');

// Database connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hiking_db',
  password: 'eXstas1987X!', // <-- IMPORTANT: Replace with your password
  port: 5432,
});

// Function to test the connection
async function testConnection() {
  try {
    // Attempt to connect to the database
    await client.connect();
    console.log('✅ Successfully connected to the database!');

    // Optional: Run a query to check PostGIS
    const res = await client.query('SELECT PostGIS_Full_Version()');
    console.log('PostGIS Version:', res.rows[0].postgis_full_version);

  } catch (err) {
    // If connection fails, log the error
    console.error('❌ Error connecting to the database');
    console.error(err.stack);
  } finally {
    // Close the connection
    await client.end();
  }
}

// Run the test
testConnection();