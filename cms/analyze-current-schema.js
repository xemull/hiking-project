const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function analyzeSchema() {
  console.log('🔍 Analyzing current PostgreSQL schema and backup data...');
  
  const client = new Client({
    host: '35.230.146.79',
    port: 5432,
    database: 'hikes_db',
    user: 'hike_admin',
    password: 'foaA99&I5Und!k',
  });
  
  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL database');
    
    // Get all table structures
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Current PostgreSQL Tables (${tables.rows.length}):`);
    
    for (const table of tables.rows) {
      const tableName = table.table_name;
      
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      console.log(`\n📦 ${tableName} (${columns.rows.length} columns):`);
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    }
    
    // Load and analyze backup data
    const backupDir = 'backup';
    const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('strapi-backup-'));
    
    if (backupFiles.length > 0) {
      const latestBackup = backupFiles.sort().pop();
      const backupFile = path.join(backupDir, latestBackup);
      const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      
      console.log(`\n📁 Backup Analysis:`);
      console.log(`📅 Backup date: ${backup.timestamp}`);
      console.log(`📊 Tables in backup: ${Object.keys(backup.tables).length}`);
      
      // Show sample hike data structure
      if (backup.tables.hikes && backup.tables.hikes.length > 0) {
        const sampleHike = backup.tables.hikes[0];
        console.log(`\n📦 Sample hike data structure:`);
        Object.keys(sampleHike).forEach(key => {
          const value = sampleHike[key];
          const type = typeof value;
          const preview = type === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value;
          console.log(`   - ${key}: ${type} = ${preview}`);
        });
      }
      
      // Show content counts
      console.log(`\n📊 Content counts in backup:`);
      Object.keys(backup.tables).forEach(tableName => {
        const rows = backup.tables[tableName];
        if (rows && rows.length > 0) {
          console.log(`   - ${tableName}: ${rows.length} rows`);
        }
      });
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  }
}

analyzeSchema().catch(console.error);