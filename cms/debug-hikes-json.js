const fs = require('fs');
const path = require('path');

async function debugHikesJson() {
  console.log('🔍 Debugging hikes JSON format...');
  
  // Load backup
  const backupDir = 'backup';
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('strapi-backup-'));
  const latestBackup = backupFiles.sort().pop();
  const backupFile = path.join(backupDir, latestBackup);
  const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  
  const hikeRows = backup.tables['hikes'];
  if (!hikeRows || hikeRows.length === 0) {
    console.log('❌ No hikes data found');
    return;
  }
  
  console.log(`📦 Found ${hikeRows.length} hikes in backup`);
  
  // Examine the first hike
  const firstHike = hikeRows[0];
  console.log('\n📋 First hike structure:');
  Object.keys(firstHike).forEach(key => {
    const value = firstHike[key];
    const type = typeof value;
    console.log(`   - ${key}: ${type}`);
    
    // Show JSON fields in detail
    if (key === 'description' || key === 'accommodation' || key === 'logistics') {
      console.log(`     Content: ${typeof value === 'string' ? value.substring(0, 100) + '...' : JSON.stringify(value).substring(0, 100) + '...'}`);
      
      // Try to parse if it's a string
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          console.log(`     ✅ Valid JSON (${Array.isArray(parsed) ? 'array' : typeof parsed})`);
          
          // Show first element if array
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`     First element: ${JSON.stringify(parsed[0], null, 2).substring(0, 200)}...`);
          }
        } catch (e) {
          console.log(`     ❌ Invalid JSON: ${e.message}`);
          console.log(`     Raw value: ${value.substring(0, 200)}...`);
        }
      }
    }
  });
  
  // Check if any hikes have problematic JSON
  console.log('\n🔍 Checking all hikes for JSON issues...');
  let validCount = 0;
  let invalidCount = 0;
  
  hikeRows.forEach((hike, index) => {
    let hikeValid = true;
    
    ['description', 'accommodation', 'logistics'].forEach(field => {
      if (hike[field] && typeof hike[field] === 'string') {
        try {
          JSON.parse(hike[field]);
        } catch (e) {
          if (hikeValid) {
            console.log(`❌ Hike ${index + 1} (${hike.title}): Invalid ${field} JSON`);
            console.log(`   Error: ${e.message}`);
            console.log(`   Value: ${hike[field].substring(0, 100)}...`);
            hikeValid = false;
          }
        }
      }
    });
    
    if (hikeValid) {
      validCount++;
    } else {
      invalidCount++;
    }
  });
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Valid hikes: ${validCount}`);
  console.log(`❌ Invalid hikes: ${invalidCount}`);
  
  if (invalidCount > 0) {
    console.log('\n🔧 Need to fix JSON format before importing');
  } else {
    console.log('\n✅ All hikes have valid JSON format');
  }
}

debugHikesJson().catch(console.error);