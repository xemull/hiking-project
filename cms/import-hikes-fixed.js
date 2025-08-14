const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function importHikesFixed() {
  console.log('🔄 Starting fixed hikes import...');
  
  // Load backup
  const backupDir = 'backup';
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('strapi-backup-'));
  const latestBackup = backupFiles.sort().pop();
  const backupFile = path.join(backupDir, latestBackup);
  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  
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
    
    // Helper function to convert SQLite timestamp to PostgreSQL
    function convertTimestamp(value) {
      if (typeof value === 'number' && value > 0) {
        const date = new Date(value);
        if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
          return date.toISOString();
        }
      }
      return null;
    }
    
    // Get hikes data
    const hikeRows = backup.tables['hikes'];
    if (!hikeRows || hikeRows.length === 0) {
      console.log('❌ No hikes data found');
      return;
    }
    
    console.log(`📦 Importing ${hikeRows.length} hikes...`);
    
    // Clear existing hikes
    await client.query('DELETE FROM "hikes"');
    
    let importedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < hikeRows.length; i++) {
      const hike = hikeRows[i];
      
      try {
        // Prepare the hike data with proper JSON handling
        const hikeData = {
          id: hike.id,
          document_id: hike.document_id,
          title: hike.title,
          description: typeof hike.description === 'string' ? JSON.parse(hike.description) : hike.description,
          country: hike.country,
          difficulty: hike.difficulty,
          best_time: hike.best_time,
          length: hike.length,
          elevation_gain: hike.elevation_gain,
          accommodation: typeof hike.accommodation === 'string' ? JSON.parse(hike.accommodation) : hike.accommodation,
          logistics: typeof hike.logistics === 'string' ? JSON.parse(hike.logistics) : hike.logistics,
          waypoints: hike.waypoints,
          hike_id: hike.hike_id,
          terrain_profile: hike.terrain_profile,
          continent: hike.continent,
          route_type: hike.route_type,
          featured: Boolean(hike.featured),
          created_at: convertTimestamp(hike.created_at),
          updated_at: convertTimestamp(hike.updated_at),
          published_at: hike.published_at ? convertTimestamp(hike.published_at) : null,
          created_by_id: hike.created_by_id,
          updated_by_id: hike.updated_by_id,
          locale: hike.locale || 'en'
        };
        
        // Insert the hike
        const query = `
          INSERT INTO "hikes" (
            id, document_id, title, description, country, difficulty, best_time, length, 
            elevation_gain, accommodation, logistics, waypoints, hike_id, terrain_profile, 
            continent, route_type, featured, created_at, updated_at, published_at, 
            created_by_id, updated_by_id, locale
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
          )
        `;
        
        const values = [
          hikeData.id,
          hikeData.document_id,
          hikeData.title,
          JSON.stringify(hikeData.description), // Convert back to JSON string for PostgreSQL
          hikeData.country,
          hikeData.difficulty,
          hikeData.best_time,
          hikeData.length,
          hikeData.elevation_gain,
          JSON.stringify(hikeData.accommodation),
          JSON.stringify(hikeData.logistics),
          hikeData.waypoints,
          hikeData.hike_id,
          hikeData.terrain_profile,
          hikeData.continent,
          hikeData.route_type,
          hikeData.featured,
          hikeData.created_at,
          hikeData.updated_at,
          hikeData.published_at,
          hikeData.created_by_id,
          hikeData.updated_by_id,
          hikeData.locale
        ];
        
        await client.query(query, values);
        importedCount++;
        
        console.log(`   ✅ Imported: ${hike.title}`);
        
      } catch (error) {
        errorCount++;
        console.log(`   ❌ Failed to import "${hike.title}": ${error.message}`);
        
        // Show detailed error for first few failures
        if (errorCount <= 3) {
          console.log(`      Error details: ${error.stack}`);
        }
      }
    }
    
    console.log(`\n✅ Hikes import completed!`);
    console.log(`📊 Successfully imported: ${importedCount}/${hikeRows.length} hikes`);
    console.log(`⚠️  Errors: ${errorCount}`);
    
    if (importedCount > 0) {
      console.log('\n🎯 Now importing relationships...');
      
      // Import hike components
      const hikeComponentRows = backup.tables['hikes_cmps'];
      if (hikeComponentRows && hikeComponentRows.length > 0) {
        console.log(`📦 Importing ${hikeComponentRows.length} hike components...`);
        
        await client.query('DELETE FROM "hikes_cmps"');
        
        let compImported = 0;
        for (const comp of hikeComponentRows) {
          try {
            await client.query(`
              INSERT INTO "hikes_cmps" (id, entity_id, cmp_id, component_type, field, "order")
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [comp.id, comp.entity_id, comp.cmp_id, comp.component_type, comp.field, comp.order]);
            compImported++;
          } catch (error) {
            // Skip failed components
          }
        }
        console.log(`   ✅ ${compImported} components imported`);
      }
      
      // Import country relationships
      const countryLinks = backup.tables['countries_hikes_lnk'];
      if (countryLinks && countryLinks.length > 0) {
        console.log(`📦 Importing ${countryLinks.length} country relationships...`);
        
        await client.query('DELETE FROM "countries_hikes_lnk"');
        
        let countryImported = 0;
        for (const link of countryLinks) {
          try {
            await client.query(`
              INSERT INTO "countries_hikes_lnk" (id, country_id, hike_id, hike_ord, country_ord)
              VALUES ($1, $2, $3, $4, $5)
            `, [link.id, link.country_id, link.hike_id, link.hike_ord, link.country_ord]);
            countryImported++;
          } catch (error) {
            // Skip failed relationships
          }
        }
        console.log(`   ✅ ${countryImported} country relationships imported`);
      }
      
      // Import other relationships similarly...
      const relationshipTables = [
        'hikes_sceneries_lnk',
        'accommodations_hikes_lnk', 
        'hikes_months_lnk'
      ];
      
      for (const tableName of relationshipTables) {
        const relationships = backup.tables[tableName];
        if (relationships && relationships.length > 0) {
          console.log(`📦 Importing ${relationships.length} ${tableName} relationships...`);
          
          await client.query(`DELETE FROM "${tableName}"`);
          
          let relImported = 0;
          for (const rel of relationships) {
            try {
              const columns = Object.keys(rel);
              const values = Object.values(rel);
              const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
              
              await client.query(`
                INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})
                VALUES (${placeholders})
              `, values);
              relImported++;
            } catch (error) {
              // Skip failed relationships
            }
          }
          console.log(`   ✅ ${relImported} ${tableName} relationships imported`);
        }
      }
    }
    
    await client.end();
    
    console.log(`\n🎉 ALL CONTENT RESTORED!`);
    console.log(`🔄 Now restart Strapi to see your content with preserved formatting!`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

importHikesFixed().catch(console.error);