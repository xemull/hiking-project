// check-database-schema.js
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: '127.0.0.1',
  port: 5433,
  database: 'hikes_db',
  user: 'hike_admin',
  password: process.env.DATABASE_PASSWORD,
  ssl: false
});

async function checkSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check all tables
    console.log('\n=== ALL TABLES ===');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check if hikes table exists and its structure
    console.log('\n=== HIKES TABLE STRUCTURE ===');
    try {
      const hikeColumns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'hikes'
        ORDER BY ordinal_position;
      `);
      
      if (hikeColumns.rows.length > 0) {
        console.log('Columns in hikes table:');
        hikeColumns.rows.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
        
        // Count hikes
        const count = await client.query('SELECT COUNT(*) FROM hikes');
        console.log(`\nTotal hikes: ${count.rows[0].count}`);
        
        // Show sample hike
        const sample = await client.query('SELECT * FROM hikes LIMIT 1');
        console.log('\nSample hike data:');
        console.log(sample.rows[0]);
        
      } else {
        console.log('No hikes table found');
      }
    } catch (e) {
      console.log('Error checking hikes table:', e.message);
    }
    
    // Check for Strapi system tables
    console.log('\n=== STRAPI SYSTEM TABLES ===');
    const strapiTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%strapi%' OR table_name LIKE '%migration%')
      ORDER BY table_name;
    `);
    
    if (strapiTables.rows.length > 0) {
      strapiTables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
      
      // Check migration status if table exists
      try {
        const migrations = await client.query('SELECT * FROM strapi_migrations ORDER BY time DESC LIMIT 5');
        console.log('\nRecent migrations:');
        migrations.rows.forEach(m => {
          console.log(`- ${m.name} (${m.time})`);
        });
      } catch (e) {
        console.log('No strapi_migrations table or error accessing it');
      }
    } else {
      console.log('No Strapi system tables found');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchema();