require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const xml2js = require('xml2js');
const simplify = require('simplify-js');

// Configuration - supports both local and production
const pool = new Pool({
  user: process.env.DB_USER || 'hike_admin',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hikes_db',
  password: process.env.DB_PASSWORD || 'eXstas1987X!',
  port: process.env.DB_PORT || 5433,
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const parseGpxManually = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`GPX file not found: ${filePath}`));
      return;
    }
    const xml = fs.readFileSync(filePath, 'utf8');
    const parser = new xml2js.Parser();
    parser.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

const addNewHike = async (gpxFileName, hikeId = null, customName = null, replaceMode = false) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const filename = path.join(__dirname, 'data', gpxFileName);
    console.log(`\n📁 Parsing GPX file: ${filename}...`);
    
    const gpxData = await parseGpxManually(filename);
    
    let points = [];
    let hikeName = customName || gpxData.gpx.metadata?.[0]?.name?.[0] || path.basename(gpxFileName, '.gpx');

    // Parse track or route data
    if (gpxData.gpx.trk && gpxData.gpx.trk.length > 0) {
        console.log(`📍 Found ${gpxData.gpx.trk.length} track(s). Combining segments...`);
        const allSegments = gpxData.gpx.trk.flatMap(track => track.trkseg || []);
        points = allSegments.flatMap(seg => (seg.trkpt || []).map(pt => ({
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
        })));
    } else if (gpxData.gpx.rte && gpxData.gpx.rte.length > 0) {
        console.log(`🗺️  Found ${gpxData.gpx.rte.length} route(s). Combining points...`);
        points = gpxData.gpx.rte.flatMap(route => (route.rtept || []).map(pt => ({
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
        })));
    } else {
        throw new Error('❌ No <trk> (track) or <rte> (route) data found in the GPX file.');
    }
    
    const validPoints = points.filter(Boolean);
    if (validPoints.length < 2) throw new Error('❌ Not enough valid points found.');
    
    console.log(`📊 Processing ${validPoints.length} GPS points...`);

    // Create elevation profile
    let cumulativeDistance = 0;
    const pointsForSimplification = validPoints.map((p, i) => {
      if (i > 0) {
        const prev = validPoints[i-1];
        cumulativeDistance += getDistance(prev.lat, prev.lon, p.lat, p.lon);
      }
      return { x: cumulativeDistance, y: p.ele };
    });

    const tolerance = 10;
    const simplifiedPoints = simplify(pointsForSimplification, tolerance, true);
    const finalProfile = simplifiedPoints.map(p => [parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(1))]);
    console.log(`📈 Simplified elevation profile from ${validPoints.length} to ${finalProfile.length} points.`);

    // Create geometry
    const hasElevation = !isNaN(validPoints[0].ele);
    const wkt = `LINESTRING${hasElevation ? ' Z' : ''} (${validPoints.map(p => `${p.lon} ${p.lat}${hasElevation ? ` ${p.ele}` : ''}`).join(',')})`;
    
    let insertQuery, values, insertedId;

    if (replaceMode && hikeId) {
      // Replace mode: Check if hike exists, then update it
      console.log(`🔄 Replace mode: Updating hike ID ${hikeId}...`);
      
      const existingHike = await client.query('SELECT id, name FROM hikes WHERE id = $1', [hikeId]);
      if (existingHike.rows.length === 0) {
        throw new Error(`❌ Hike with ID ${hikeId} not found. Cannot replace non-existent hike.`);
      }

      const originalName = existingHike.rows[0].name;
      console.log(`📝 Found existing hike: "${originalName}"`);
      
      // Keep original name unless custom name provided
      const finalName = customName || originalName;
      
      insertQuery = `
        UPDATE hikes 
        SET name = $1, track = ST_GeogFromText($2), simplified_profile = $3, created_at = NOW()
        WHERE id = $4
        RETURNING id;
      `;
      values = [finalName, wkt, JSON.stringify(finalProfile), hikeId];
      
      const result = await client.query(insertQuery, values);
      insertedId = result.rows[0].id;
      console.log(`✅ Successfully replaced GPX data for "${finalName}" (ID: ${insertedId})`);
      
    } else if (hikeId) {
      // Specific ID mode (original functionality)
      insertQuery = `
        INSERT INTO hikes (id, name, track, simplified_profile)
        VALUES ($1, $2, ST_GeogFromText($3), $4)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          track = EXCLUDED.track,
          simplified_profile = EXCLUDED.simplified_profile,
          created_at = NOW()
        RETURNING id;
      `;
      values = [hikeId, hikeName, wkt, JSON.stringify(finalProfile)];
      
      const result = await client.query(insertQuery, values);
      insertedId = result.rows[0].id;
      console.log(`✅ Successfully added/updated "${hikeName}" with ID: ${insertedId}`);
      
    } else {
      // Auto-increment mode (original functionality)
      insertQuery = `
        INSERT INTO hikes (name, track, simplified_profile)
        VALUES ($1, ST_GeogFromText($2), $3)
        ON CONFLICT (name) DO UPDATE SET
          track = EXCLUDED.track,
          simplified_profile = EXCLUDED.simplified_profile,
          created_at = NOW()
        RETURNING id;
      `;
      values = [hikeName, wkt, JSON.stringify(finalProfile)];
      
      const result = await client.query(insertQuery, values);
      insertedId = result.rows[0].id;
      console.log(`✅ Successfully added/updated "${hikeName}" with ID: ${insertedId}`);
    }
    
    // Show current hikes
    const allHikesResult = await client.query('SELECT id, name FROM hikes ORDER BY id;');
    console.log('\n--- 🏔️  Current Hikes in Database ---');
    allHikesResult.rows.forEach(hike => {
        console.log(`ID: ${hike.id}, Name: ${hike.name}`);
    });
    console.log('----------------------------------------\n');
    
    if (!replaceMode) {
      console.log(`🎯 Next step: Add content for hike ID ${insertedId} in Strapi:`);
      console.log(`   👉 https://cms-service-623946599151.europe-west2.run.app/admin`);
      console.log(`   👉 Set hike_id to: ${insertedId}`);
    } else {
      console.log(`🎯 GPX data replaced! Your Strapi content for hike ID ${insertedId} remains unchanged.`);
    }
    
    await client.query('COMMIT');
    return insertedId;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error occurred:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Command line interface
const main = async () => {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log(`
📖 Usage: 
  node add-hike.js <gpx-filename> [hike-id] [custom-name]
  node add-hike.js --replace <hike-id> <gpx-filename> [custom-name]

📁 Examples:
  # Add new hike
  node add-hike.js salkantay.gpx
  node add-hike.js salkantay.gpx 25
  node add-hike.js salkantay.gpx 25 "Salkantay Trek"
  
  # Replace existing hike's GPX data
  node add-hike.js --replace 25 new-salkantay.gpx
  node add-hike.js --replace 25 new-salkantay.gpx "Updated Salkantay Trek"

📝 Note: 
  - GPX files should be in the ./data/ folder
  - Replace mode updates the GPX track data while keeping the same hike ID
  - Replace mode preserves the original name unless you provide a custom-name
      `);
      process.exit(1);
    }

    // Parse arguments for replace mode
    if (args[0] === '--replace') {
      if (args.length < 3) {
        console.error('❌ Replace mode requires: --replace <hike-id> <gpx-filename> [custom-name]');
        process.exit(1);
      }
      const [, hikeId, gpxFile, customName] = args;
      await addNewHike(gpxFile, parseInt(hikeId), customName, true);
    } else {
      // Original mode
      const [gpxFile, hikeId, customName] = args;
      await addNewHike(gpxFile, hikeId ? parseInt(hikeId) : null, customName, false);
    }
    
  } catch (error) {
    console.error('💥 Failed to add hike:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  main();
}

module.exports = { addNewHike };