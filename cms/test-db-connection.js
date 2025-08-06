// test-db-connection.js
// Run this in your cms folder: node test-db-connection.js

const { Client } = require('pg');
require('dotenv').config();

// Read environment variables with fallbacks
const config = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: false // Since we're going through the proxy
};

const client = new Client(config);

async function testConnection() {
  try {
    console.log('Attempting to connect with:');
    console.log('Host:', client.host);
    console.log('Port:', client.port);
    console.log('Database:', client.database);
    console.log('User:', client.user);
    console.log('Password length:', client.password ? client.password.length : 0);
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    await client.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testConnection();