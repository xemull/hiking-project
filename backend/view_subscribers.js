const { Pool } = require('pg');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: 'eXstas1987X!',
  port: 5433,
});

async function viewSubscribers() {
  try {
    const result = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    console.log('Newsletter Subscribers:');
    console.table(result.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

viewSubscribers();