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

const addNewHike = async (gpxFileName, hikeId = null, customName = null) => {
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

    const tolerance = 2;
    const simplifiedPoints = simplify(pointsForSimplification, tolerance, true);
    const finalProfile = simplifiedPoints.map(p => [parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(1))]);
    console.log(`📈 Simplified elevation profile from ${validPoints.length} to ${finalProfile.length} points.`);

    // Create geometry
    const hasElevation = !isNaN(validPoints[0].ele);
    const wkt = `LINESTRING${hasElevation ? ' Z' : ''} (${validPoints.map(p => `${p.lon} ${p.lat}${hasElevation ? ` ${p.ele}` : ''}`).join(',')})`;
    
    // Insert with optional custom ID
    let insertQuery, values;
    
    if (hikeId) {
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
    } else {
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
    }

    const result = await client.query(insertQuery, values);
    const insertedId = result.rows[0].id;
    console.log(`✅ Successfully added/updated "${hikeName}" with ID: ${insertedId}`);
    
    // Show current hikes
    const allHikesResult = await client.query('SELECT id, name FROM hikes ORDER BY id;');
    console.log('\n--- 🏔️  Current Hikes in Database ---');
    allHikesResult.rows.forEach(hike => {
        console.log(`ID: ${hike.id}, Name: ${hike.name}`);
    });
    console.log('----------------------------------------\n');
    
    console.log(`🎯 Next step: Add content for hike ID ${insertedId} in Strapi:`);
    console.log(`   👉 https://cms-service-623946599151.europe-west2.run.app/admin`);
    console.log(`   👉 Set hike_id to: ${insertedId}`);
    
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

📁 Examples:
  node add-hike.js salkantay.gpx
  node add-hike.js salkantay.gpx 25
  node add-hike.js salkantay.gpx 25 "Salkantay Trek"

📝 Note: GPX files should be in the ./data/ folder
      `);
      process.exit(1);
    }

    const [gpxFile, hikeId, customName] = args;
    await addNewHike(gpxFile, hikeId ? parseInt(hikeId) : null, customName);
    
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