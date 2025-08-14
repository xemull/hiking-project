const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function restoreAllContent() {
  console.log('🔄 Starting comprehensive content restoration...');
  
  // Load backup
  const backupDir = 'backup';
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('strapi-backup-'));
  const latestBackup = backupFiles.sort().pop();
  const backupFile = path.join(backupDir, latestBackup);
  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  
  console.log(`📁 Loading backup: ${backupFile}`);
  console.log(`📅 Backup date: ${backup.timestamp}`);
  
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
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        const timestamp = parseInt(value);
        if (timestamp > 0) {
          const date = new Date(timestamp);
          if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
            return date.toISOString();
          }
        }
      }
      return value;
    }
    
    // Helper function to convert JSON strings back to proper JSON
    function convertJsonField(value) {
      if (typeof value === 'string') {
        try {
          // Try to parse as JSON
          return JSON.parse(value);
        } catch (e) {
          // If it's not valid JSON, return as string
          return value;
        }
      }
      return value;
    }
    
    let totalRestored = 0;
    
    // Restoration order: base entities first, then relationships
    const restorationPlan = [
      // Base entities (no foreign dependencies)
      { table: 'countries', keyField: 'name' },
      { table: 'sceneries', keyField: 'scenery_type' },
      { table: 'accommodations', keyField: 'accommodation_type' },
      { table: 'months', keyField: 'month_tag' },
      { table: 'upload_folders', keyField: 'name' },
      { table: 'files', keyField: 'name' },
      
      // Components
      { table: 'components_hike_videos', keyField: 'title' },
      { table: 'components_hike_landmarks', keyField: 'name' },
      { table: 'components_hike_books', keyField: 'title' },
      { table: 'components_hike_blogs', keyField: 'title' },
      
      // Main content
      { table: 'hikes', keyField: 'title' },
      
      // Relationships
      { table: 'hikes_cmps', keyField: null },
      { table: 'countries_hikes_lnk', keyField: null },
      { table: 'hikes_sceneries_lnk', keyField: null },
      { table: 'accommodations_hikes_lnk', keyField: null },
      { table: 'hikes_months_lnk', keyField: null },
      { table: 'files_related_mph', keyField: null },
      { table: 'files_folder_lnk', keyField: null }
    ];
    
    for (const plan of restorationPlan) {
      const tableName = plan.table;
      const rows = backup.tables[tableName];
      
      if (!rows || rows.length === 0) {
        console.log(`⏭️  No data for ${tableName}`);
        continue;
      }
      
      console.log(`📦 Restoring ${tableName} (${rows.length} rows)...`);
      
      try {
        // Get current table structure
        const columnResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = $1 AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tableName]);
        
        const columns = columnResult.rows.map(row => ({
          name: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable === 'YES'
        }));
        
        // Clear existing data
        await client.query(`DELETE FROM "${tableName}"`);
        
        let insertedCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          try {
            const processedRow = {};
            
            // Process each column
            columns.forEach(col => {
              if (row.hasOwnProperty(col.name)) {
                let value = row[col.name];
                
                // Handle different data types
                if (value === null || value === undefined) {
                  value = col.nullable ? null : undefined;
                } else if (col.type.includes('timestamp') && value) {
                  value = convertTimestamp(value);
                } else if (col.type === 'jsonb' && value) {
                  // Handle JSON fields (this is where your rich text with bold formatting is!)
                  value = convertJsonField(value);
                } else if (col.type === 'boolean' && typeof value === 'number') {
                  value = Boolean(value);
                } else if (col.type === 'integer' && typeof value === 'string') {
                  const intValue = parseInt(value);
                  value = isNaN(intValue) ? null : intValue;
                } else if (col.type === 'numeric' && typeof value === 'string') {
                  const numValue = parseFloat(value);
                  value = isNaN(numValue) ? null : numValue;
                } else if (col.type === 'double precision' && typeof value === 'string') {
                  const numValue = parseFloat(value);
                  value = isNaN(numValue) ? null : numValue;
                }
                
                if (value !== undefined) {
                  processedRow[col.name] = value;
                }
              }
            });
            
            const rowColumns = Object.keys(processedRow);
            const rowValues = Object.values(processedRow);
            
            if (rowColumns.length === 0) continue;
            
            const placeholders = rowColumns.map((_, i) => `$${i + 1}`).join(', ');
            const query = `INSERT INTO "${tableName}" (${rowColumns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
            
            await client.query(query, rowValues);
            insertedCount++;
            
          } catch (rowError) {
            errorCount++;
            // Only log first few errors to avoid spam
            if (errorCount <= 3) {
              console.log(`     ⚠️  Row ${i + 1} error: ${rowError.message}`);
            } else if (errorCount === 4) {
              console.log(`     ⚠️  ... (suppressing further error messages)`);
            }
          }
        }
        
        console.log(`   ✅ ${insertedCount}/${rows.length} rows restored (${errorCount} errors)`);
        totalRestored += insertedCount;
        
      } catch (error) {
        console.log(`   ⚠️  Error restoring ${tableName}: ${error.message}`);
      }
    }
    
    console.log(`\n✅ Comprehensive restoration completed!`);
    console.log(`📊 Total rows restored: ${totalRestored}`);
    
    // Show what was restored
    console.log(`\n📋 Content Summary:`);
    for (const plan of restorationPlan) {
      const tableName = plan.table;
      if (backup.tables[tableName] && backup.tables[tableName].length > 0) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
          const restoredCount = countResult.rows[0].count;
          const originalCount = backup.tables[tableName].length;
          console.log(`   - ${tableName}: ${restoredCount}/${originalCount} rows`);
        } catch (e) {
          console.log(`   - ${tableName}: Error checking count`);
        }
      }
    }
    
    await client.end();
    
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Restart Strapi: npm run dev`);
    console.log(`2. Check your content in admin panel`);
    console.log(`3. Verify BOLD FORMATTING is preserved in rich text fields!`);
    console.log(`4. Test API responses to confirm formatting appears`);
    console.log(`5. Deploy to production if everything looks good`);
    
  } catch (error) {
    console.error('❌ Restoration failed:', error);
    throw error;
  }
}

restoreAllContent().catch(console.error);