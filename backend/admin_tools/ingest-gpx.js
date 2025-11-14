const fs = require('fs');
const { Pool } = require('pg');
const xml2js = require('xml2js');
const simplify = require('simplify-js');

// Database connection for the clean database
const pool = new Pool({
  user: 'strapi_dev',
  host: 'localhost',
  database: 'strapi_clean',
  password: 'eXstas1987X!',
  port: 5432,
});

// Haversine formula for distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Parse GPX file
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

// Create/modify the trails table for GPX data
const createHikesTable = async (client) => {
  // Create a separate table for GPX trail data
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS trails (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      track GEOGRAPHY(LINESTRINGZ, 4326),
      simplified_profile JSONB,
      distance_km DECIMAL,
      ascent_m INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  await client.query(createTableQuery);
  
  // Create the spatial index
  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_trails_track ON trails USING GIST (track);
  `;
  
  await client.query(createIndexQuery);
  console.log('Trails table created for GPX data');
};

const ingestGpxFile = async (gpxFilePath) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create table if needed
    await createHikesTable(client);
    
    console.log(`Parsing GPX file: ${gpxFilePath}...`);
    const gpxData = await parseGpxManually(gpxFilePath);
    
    let points = [];
    let hikeName = gpxData.gpx.metadata?.[0]?.name?.[0] || 'Unnamed Hike';
    
    // Handle both tracks and routes
    if (gpxData.gpx.trk && gpxData.gpx.trk.length > 0) {
      console.log(`Found ${gpxData.gpx.trk.length} track(s). Combining segments...`);
      const allSegments = gpxData.gpx.trk.flatMap(track => track.trkseg || []);
      points = allSegments.flatMap(seg => (seg.trkpt || []).map(pt => ({
        lon: parseFloat(pt.$.lon),
        lat: parseFloat(pt.$.lat),
        ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
      })));
    } else if (gpxData.gpx.rte && gpxData.gpx.rte.length > 0) {
      console.log(`Found ${gpxData.gpx.rte.length} route(s). Combining points...`);
      points = gpxData.gpx.rte.flatMap(route => (route.rtept || []).map(pt => ({
        lon: parseFloat(pt.$.lon),
        lat: parseFloat(pt.$.lat),
        ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
      })));
    } else {
      throw new Error('No track or route data found in GPX file');
    }
    
    const validPoints = points.filter(p => !isNaN(p.lon) && !isNaN(p.lat));
    if (validPoints.length < 2) {
      throw new Error('Not enough valid points found');
    }
    
    console.log(`Processing ${validPoints.length} GPS points...`);
    
    // Calculate cumulative distance for elevation profile
    let cumulativeDistance = 0;
    let totalAscent = 0;
    const pointsForSimplification = validPoints.map((p, i) => {
      if (i > 0) {
        const prev = validPoints[i - 1];
        const segmentDistance = getDistance(prev.lat, prev.lon, p.lat, p.lon);
        cumulativeDistance += segmentDistance;
        
        // Calculate ascent
        if (!isNaN(p.ele) && !isNaN(prev.ele) && p.ele > prev.ele) {
          totalAscent += (p.ele - prev.ele);
        }
      }
      return { x: cumulativeDistance, y: p.ele || 0 };
    });
    
    // Simplify elevation profile
    const tolerance = 2;
    const simplifiedPoints = simplify(pointsForSimplification, tolerance, true);
    const finalProfile = simplifiedPoints.map(p => [
      parseFloat(p.x.toFixed(2)), 
      parseFloat(p.y.toFixed(1))
    ]);
    
    console.log(`Simplified elevation profile from ${validPoints.length} to ${finalProfile.length} points`);
    
    // Create WKT string for PostGIS
    const hasElevation = !isNaN(validPoints[0].ele);
    const wkt = `LINESTRING${hasElevation ? ' Z' : ''} (${validPoints.map(p => 
      `${p.lon} ${p.lat}${hasElevation ? ` ${p.ele}` : ''}`
    ).join(',')})`;
    
    // Insert into database using PostGIS
    const insertQuery = `
      INSERT INTO trails (name, track, simplified_profile, distance_km, ascent_m)
      VALUES ($1, ST_GeogFromText($2), $3, $4, $5)
      ON CONFLICT (name) DO UPDATE SET
        track = EXCLUDED.track,
        simplified_profile = EXCLUDED.simplified_profile,
        distance_km = EXCLUDED.distance_km,
        ascent_m = EXCLUDED.ascent_m,
        updated_at = NOW()
      RETURNING id, name;
    `;
    
    const values = [
      hikeName,
      wkt,
      JSON.stringify(finalProfile),
      parseFloat(cumulativeDistance.toFixed(2)),
      Math.round(totalAscent)
    ];
    
    const result = await client.query(insertQuery, values);
    console.log(`Successfully added "${hikeName}" with ID: ${result.rows[0].id}`);
    console.log(`Distance: ${cumulativeDistance.toFixed(2)}km, Ascent: ${Math.round(totalAscent)}m`);
    
    await client.query('COMMIT');
    
    // Show all trails in database
    const allHikes = await client.query('SELECT id, name, distance_km, ascent_m FROM trails ORDER BY id');
    console.log('\n--- All Trails in Database ---');
    allHikes.rows.forEach(hike => {
      console.log(`ID: ${hike.id}, Name: ${hike.name}, Distance: ${hike.distance_km}km, Ascent: ${hike.ascent_m}m`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error ingesting GPX file:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Main execution
const main = async () => {
  try {
    // Change this to your GPX file path
    const gpxFilePath = '../data/av1.gpx';
    
    if (!fs.existsSync(gpxFilePath)) {
      console.error(`GPX file not found: ${gpxFilePath}`);
      console.log('Please update the gpxFilePath variable to point to your GPX file.');
      return;
    }
    
    await ingestGpxFile(gpxFilePath);
    console.log('GPX ingestion completed successfully!');
    
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await pool.end();
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { ingestGpxFile };