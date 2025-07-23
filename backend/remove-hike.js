const { Pool } = require('pg');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: '***REMOVED***', // Your correct password
  port: 5433,
});

const removeHike = async () => {
  const idToRemove = process.argv[2]; // Get the ID from the command line

  if (!idToRemove) {
    console.error('❌ Please provide a hike ID to remove. Usage: node remove-hike.js <ID>');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('DELETE FROM Hikes WHERE id = $1', [idToRemove]);

    if (result.rowCount === 0) {
      console.log(`⚠️ No hike found with ID: ${idToRemove}. Nothing deleted.`);
    } else {
      console.log(`✅ Successfully deleted hike with ID: ${idToRemove}.`);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ An error occurred:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

removeHike();