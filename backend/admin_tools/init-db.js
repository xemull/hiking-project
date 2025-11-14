const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: 'eXstas1987X!', // Your correct password
  port: 5433,
});

const runSchema = async () => {
  try {
    const schema = fs.readFileSync('schema.sql', 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema created successfully from file!');
  } catch (error) {
    console.error('❌ Error executing schema:', error);
  } finally {
    await pool.end();
  }
};

runSchema();