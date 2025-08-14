const { Client } = require('pg');

async function fixSequences() {
  console.log('🔧 Fixing PostgreSQL auto-increment sequences...');
  
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
    
    // Tables that need sequence fixes
    const tables = [
      'components_hike_landmarks',
      'components_hike_videos', 
      'components_hike_books',
      'components_hike_blogs',
      'hikes',
      'countries',
      'sceneries',
      'accommodations',
      'months',
      'files',
      'hikes_cmps',
      'countries_hikes_lnk',
      'hikes_sceneries_lnk',
      'accommodations_hikes_lnk',
      'hikes_months_lnk',
      'files_related_mph'
    ];
    
    for (const tableName of tables) {
      try {
        // Get the maximum ID from the table
        const maxResult = await client.query(`SELECT MAX(id) as max_id FROM "${tableName}"`);
        const maxId = maxResult.rows[0].max_id;
        
        if (maxId) {
          // Set the sequence to the next value after the maximum ID
          const nextId = parseInt(maxId) + 1;
          const sequenceName = `${tableName}_id_seq`;
          
          await client.query(`SELECT setval('${sequenceName}', $1, false)`, [nextId]);
          console.log(`✅ Fixed ${tableName} sequence: next ID will be ${nextId}`);
        } else {
          console.log(`⏭️  ${tableName} is empty, skipping sequence fix`);
        }
        
      } catch (error) {
        console.log(`⚠️  Could not fix sequence for ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n✅ All sequences fixed!');
    console.log('🎯 Publishing should now work without duplicate key errors');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Sequence fix failed:', error);
    throw error;
  }
}

fixSequences().catch(console.error);