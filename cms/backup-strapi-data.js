const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');

async function backupStrapiData() {
  console.log('🔄 Starting Strapi SQLite backup...');
  
  const dbPath = path.join(__dirname, '.tmp/data.db');
  
  if (!fs.existsSync(dbPath)) {
    console.error('❌ SQLite database file not found at:', dbPath);
    return;
  }

  try {
    const db = sqlite3(dbPath, { readonly: true });
    
    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    
    console.log(`📋 Found ${tables.length} tables to backup`);
    
    const backup = {
      timestamp: new Date().toISOString(),
      tables: {}
    };

    // Export each table
    for (const table of tables) {
      const tableName = table.name;
      console.log(`📦 Backing up table: ${tableName}`);
      
      try {
        const rows = db.prepare(`SELECT * FROM "${tableName}"`).all();
        backup.tables[tableName] = rows;
        console.log(`   ✅ ${rows.length} rows exported`);
      } catch (error) {
        console.log(`   ⚠️  Error backing up ${tableName}:`, error.message);
        backup.tables[tableName] = [];
      }
    }

    db.close();

    // Save backup to file
    const backupDir = 'backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const backupFile = path.join(backupDir, `strapi-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup completed successfully!`);
    console.log(`📁 Backup saved to: ${backupFile}`);
    
    // Show summary
    const totalRows = Object.values(backup.tables).reduce((sum, rows) => sum + rows.length, 0);
    console.log(`📊 Summary: ${tables.length} tables, ${totalRows} total rows`);
    
    return backupFile;
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Run backup
backupStrapiData().catch(console.error);