const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function restoreStrapiData() {
  console.log('🔄 Starting Strapi data restoration (v3)...');
  
  // Find the backup file
  const backupDir = 'backup';
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('strapi-backup-'));
  
  if (backupFiles.length === 0) {
    console.error('❌ No backup files found in backup directory');
    return;
  }
  
  // Use the most recent backup
  const latestBackup = backupFiles.sort().pop();
  const backupFile = path.join(backupDir, latestBackup);
  
  console.log(`📁 Loading backup from: ${backupFile}`);
  
  try {
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Backup timestamp: ${backup.timestamp}`);
    
    // Connect to PostgreSQL directly
    const client = new Client({
      host: '35.230.146.79',
      port: 5432,
      database: 'hikes_db',
      user: 'hike_admin',
      password: 'foaA99&I5Und!k',
    });
    
    await client.connect();
    console.log('🔗 Connected to PostgreSQL database');
    
    // Get existing tables in PostgreSQL
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const existingTables = result.rows.map(row => row.table_name);
    console.log(`📋 Found ${existingTables.length} tables in PostgreSQL`);
    
    // Define restoration order - dependencies first, then content, then relationships
    const tableOrder = [
      // Base system tables first (no dependencies)
      'i18n_locale',
      'strapi_core_store_settings',
      'upload_folders',
      
      // User/admin system
      'up_roles',
      'admin_roles', 
      'admin_users',
      'up_permissions',
      'admin_permissions',
      
      // Files (depends on upload_folders)
      'files',
      
      // Components (no dependencies)
      'components_hike_videos',
      'components_hike_landmarks', 
      'components_hike_books',
      'components_hike_blogs',
      
      // Main content (depends on files and components)
      'hikes',
      
      // Relationship tables last (depend on everything else)
      'hikes_cmps',
      'files_related_mph',
      'hikes_localizations_lnk',
      'files_folder_lnk'
    ];
    
    // Add any remaining tables not in the ordered list
    const remainingTables = Object.keys(backup.tables).filter(tableName => 
      existingTables.includes(tableName) && 
      !tableOrder.includes(tableName) &&
      !tableName.startsWith('strapi_migrations') &&
      !tableName.startsWith('strapi_database_schema') &&
      backup.tables[tableName].length > 0
    );
    
    const tablesToRestore = [...tableOrder.filter(t => existingTables.includes(t)), ...remainingTables];
    
    console.log(`📦 Will restore ${tablesToRestore.length} tables in dependency order`);
    
    let totalRestored = 0;
    
    // Helper function to convert SQLite timestamp to PostgreSQL
    function convertTimestamp(value) {
      if (typeof value === 'number' && value > 0) {
        // SQLite timestamp is in milliseconds
        const date = new Date(value);
        if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
          return date.toISOString();
        }
      }
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        // String number - convert to integer first
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
    
    for (const tableName of tablesToRestore) {
      const rows = backup.tables[tableName];
      
      if (!rows || rows.length === 0) {
        console.log(`⏭️  Skipping empty table: ${tableName}`);
        continue;
      }
      
      console.log(`📦 Restoring ${tableName} (${rows.length} rows)...`);
      
      try {
        // Get column information
        const columnResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = $1 AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tableName]);
        
        if (columnResult.rows.length === 0) {
          console.log(`   ⚠️  No columns found for ${tableName}, skipping...`);
          continue;
        }
        
        const columns = columnResult.rows.map(row => ({ 
          name: row.column_name, 
          type: row.data_type,
          nullable: row.is_nullable === 'YES'
        }));
        
        // Clear existing data
        await client.query(`DELETE FROM "${tableName}"`);
        
        // Insert data row by row with better error handling
        let insertedCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          try {
            // Process and convert data
            const processedRow = {};
            
            columns.forEach(col => {
              if (row.hasOwnProperty(col.name)) {
                let value = row[col.name];
                
                // Convert timestamps for date/time columns
                if ((col.type.includes('timestamp') || col.name.includes('_at') || col.name === 'created_at' || col.name === 'updated_at') && value) {
                  value = convertTimestamp(value);
                }
                
                // Handle null values
                if (value === null || value === undefined) {
                  value = col.nullable ? null : undefined;
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
        // Continue with other tables
      }
    }
    
    console.log(`\n✅ Restoration completed!`);
    console.log(`📊 Total rows restored: ${totalRestored}`);
    
    await client.end();
    
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Start Strapi: npm run dev`);
    console.log(`2. Check your content in admin panel`);
    console.log(`3. Verify bold formatting is preserved`);
    
  } catch (error) {
    console.error('❌ Restoration failed:', error);
    throw error;
  }
}

// Run restoration
restoreStrapiData().catch(console.error);