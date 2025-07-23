const fs = require('fs');
const { Pool } = require('pg');
const xml2js = require('xml2js');
const simplify = require('simplify-js');

// ... (getDistance, pool, and parseGpxManually functions remain the same) ...
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: 'eXstas1987X!', // Your correct password
  port: 5433,
});
const parseGpxManually = (filePath) => {
  return new Promise((resolve, reject) => {
    const xml = fs.readFileSync(filePath, 'utf8');
    const parser = new xml2js.Parser();
    parser.parseString(xml, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};


const addNewHike = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const filename = '../data/salkantay.gpx'; // <-- Your new filename
    console.log(`Parsing GPX file: ${filename}...`);
    const gpxData = await parseGpxManually(filename);
    
    let points = [];
    let hikeName = gpxData.gpx.metadata?.[0]?.name?.[0] || 'My New Hike';

    // --- THIS IS THE FIX ---
    // Check for a <trk> first, if not found, check for a <rte>
    // The script now combines points from all <trk> or <rte> tags found in the file.
    if (gpxData.gpx.trk && gpxData.gpx.trk.length > 0) {
        console.log(`Found ${gpxData.gpx.trk.length} track(s). Combining segments...`);
        const allSegments = gpxData.gpx.trk.flatMap(track => track.trkseg || []);
        points = allSegments.flatMap(seg => (seg.trkpt || []).map(pt => ({
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
        })));

    } else if (gpxData.gpx.rte && gpxData.gpx.rte.length > 0) {
        console.log(`Found ${gpxData.gpx.rte.length} route(s)/stage(s). Combining points...`);
        points = gpxData.gpx.rte.flatMap(route => (route.rtept || []).map(pt => ({
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
        })));
    } else {
        throw new Error('No <trk> (track) or <rte> (route) data found in the GPX file.');
    }
    
    const validPoints = points.filter(Boolean);
    if (validPoints.length < 2) throw new Error('Not enough valid points found.');
    
    // ... (rest of the data processing and insert logic remains the same)
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
    console.log(`Simplified elevation profile from ${validPoints.length} to ${finalProfile.length} points.`);
    const hasElevation = !isNaN(validPoints[0].ele);
    const wkt = `LINESTRING${hasElevation ? ' Z' : ''} (${validPoints.map(p => `${p.lon} ${p.lat}${hasElevation ? ` ${p.ele}` : ''}`).join(',')})`;
    
    const insertQuery = `
      INSERT INTO Hikes (name, track, simplified_profile)
      VALUES ($1, ST_GeogFromText($2), $3)
      ON CONFLICT (name) DO UPDATE SET
        track = EXCLUDED.track,
        simplified_profile = EXCLUDED.simplified_profile,
        created_at = NOW();
    `;
    const values = [hikeName, wkt, JSON.stringify(finalProfile)];
    await client.query(insertQuery, values);
    console.log(`✅ Successfully added or updated "${hikeName}" in the database!`);
    
    const allHikesResult = await client.query('SELECT id, name FROM Hikes ORDER BY id;');
    console.log('\n--- Hikes currently in database ---');
    allHikesResult.rows.forEach(hike => {
        console.log(`ID: ${hike.id}, Name: ${hike.name}`);
    });
    console.log('---------------------------------');
    
    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ An error occurred:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

addNewHike();