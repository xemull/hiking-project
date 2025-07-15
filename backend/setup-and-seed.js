const fs = require('fs');
const { Pool } = require('pg');
const xml2js = require('xml2js');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: '***REMOVED***', // Your correct password
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

const setupAndSeed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS Hikes;');
    const createTableQuery = `
      CREATE TABLE Hikes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          distance_km NUMERIC(5, 1),
          ascent_m INTEGER,
          track GEOGRAPHY(LINESTRINGZ, 4326),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Table created successfully.');

    const filename = '../data/cycling.gpx';
    console.log(`Parsing GPX file: ${filename}...`);
    const gpxData = await parseGpxManually(filename);
    
    const track = gpxData.gpx.trk[0];
    const hikeName = track.name[0] || 'My Hike';
    const segments = track.trkseg;
    
    // --- THIS IS THE FIX ---
    const points = segments.flatMap(seg =>
        (seg.trkpt || []).map(pt => {
          const elevation = pt.ele ? parseFloat(pt.ele[0]) : NaN;
          
          // If elevation is negative, treat the point as invalid by returning null
          if (elevation < 0) {
            return null;
          }
          
          return {
            lon: parseFloat(pt.$.lon),
            lat: parseFloat(pt.$.lat),
            ele: elevation,
          };
        })
    ).filter(Boolean); // This filter now removes the nulls from the negative points

    if (points.length < 2) throw new Error('Not enough valid points found.');
    
    const hasElevation = !isNaN(points[0].ele);
    if (!hasElevation) throw new Error('GPX lacks elevation data.');

    const wkt = `LINESTRING Z (${points.map(p => `${p.lon} ${p.lat} ${p.ele}`).join(',')})`;
    
    console.log('Inserting hike data...');
    const insertQuery = `
      INSERT INTO Hikes (name, distance_km, ascent_m, track)
      VALUES ($1, $2, $3, ST_GeogFromText($4))
    `;
    const values = [hikeName, 15.5, 800, wkt];
    await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    console.log(`✅ Successfully added "${hikeName}" to the database!`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ An error occurred:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

setupAndSeed();