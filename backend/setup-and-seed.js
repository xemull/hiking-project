const fs = require('fs');
const { Pool } = require('pg');
const xml2js = require('xml2js');
const simplify = require('simplify-js');

// Helper function to calculate distance between two lat/lon points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// This is the database connection configuration
const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: '***REMOVED***', // Your correct password
  port: 5433,
});

// This is the GPX parsing function
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

// This is the main function to set up and seed the database
const setupAndSeed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Read the final schema from the .sql file to ensure it's always up to date
    const schemaSQL = fs.readFileSync('schema.sql', 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Table created successfully from schema.sql.');

    const filename = '../data/cycling.gpx';
    console.log(`Parsing GPX file: ${filename}...`);
    const gpxData = await parseGpxManually(filename);
    
    const track = gpxData.gpx.trk[0];
    const hikeName = track.name[0] || 'My Hike';
    const segments = track.trkseg;
    const points = segments.flatMap(seg => (seg.trkpt || []).map(pt => {
        const elevation = pt.ele ? parseFloat(pt.ele[0]) : NaN;
        // Filter out points with negative elevation
        if (elevation < 0) return null;
        return {
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: elevation,
        };
    })).filter(Boolean);

    if (points.length < 2) throw new Error('Not enough valid points found.');
    
    // Create points for simplification: {x: distance, y: elevation}
    let cumulativeDistance = 0;
    const pointsForSimplification = points.map((p, i) => {
      if (i > 0) {
        const prev = points[i-1];
        cumulativeDistance += getDistance(prev.lat, prev.lon, p.lat, p.lon);
      }
      return { x: cumulativeDistance, y: p.ele };
    });

    // Run the RDP simplification algorithm
    const tolerance = 10; // Higher number = more simplification
    const simplifiedPoints = simplify(pointsForSimplification, tolerance, true);
    
    // Format the simplified data to be stored in the database
    const finalProfile = simplifiedPoints.map(p => [parseFloat(p.x.toFixed(2)), parseFloat(p.y.toFixed(1))]);
    console.log(`Simplified elevation profile from ${points.length} to ${finalProfile.length} points.`);

    // Create the full-resolution 3D track for the map
    const wkt = `LINESTRING Z (${points.map(p => `${p.lon} ${p.lat} ${p.ele}`).join(',')})`;
    
    // Prepare the final INSERT query
    const insertQuery = `
      INSERT INTO Hikes (name, track, simplified_profile)
      VALUES ($1, ST_GeogFromText($2), $3)
    `;
    const values = [hikeName, wkt, JSON.stringify(finalProfile)];
    await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    console.log(`✅ Successfully set up table and added "${hikeName}"!`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ An error occurred:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

setupAndSeed();