const { Client } = require('pg');

async function fixMigrationConflicts() {
  console.log('🔧 Fixing Strapi v5 migration conflicts...');
  
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
    
    // Clear the strapi_migrations table so migrations can run fresh
    console.log('🗑️  Clearing migration history...');
    await client.query('DELETE FROM strapi_migrations');
    await client.query('DELETE FROM strapi_migrations_internal');
    
    // The migration error is related to document_id structure in v5
    // We need to clear tables that might have v4 structure
    console.log('🗑️  Clearing tables that need v5 migration...');
    
    const tablesToClear = [
      'accommodations',
      'countries', 
      'sceneries',
      'months',
      'hikes'
    ];
    
    for (const table of tablesToClear) {
      try {
        await client.query(`DELETE FROM ${table}`);
        console.log(`   ✅ Cleared ${table}`);
      } catch (error) {
        console.log(`   ⚠️  Could not clear ${table}: ${error.message}`);
      }
    }
    
    // Also clear relationship tables
    const relationTables = [
      'countries_hikes_lnk',
      'hikes_sceneries_lnk', 
      'accommodations_hikes_lnk',
      'hikes_months_lnk',
      'hikes_cmps'
    ];
    
    for (const table of relationTables) {
      try {
        await client.query(`DELETE FROM ${table}`);
        console.log(`   ✅ Cleared ${table}`);
      } catch (error) {
        console.log(`   ⚠️  Could not clear ${table}: ${error.message}`);
      }
    }
    
    console.log('✅ Migration conflicts fixed!');
    console.log('📝 Note: You will need to recreate your main content (hikes, countries, etc.)');
    console.log('📦 But your components, files, and system settings are preserved');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    throw error;
  }
}

fixMigrationConflicts().catch(console.error);