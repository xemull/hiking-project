const fs = require('fs');
const { Pool } = require('pg');
const xml2js = require('xml2js');

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
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const seedDatabase = async () => {
  try {
    const filename = '../data/cycling.gpx'; // Change to the GPX file you want to add
    console.log(`Parsing GPX file: ${filename}...`);
    const gpxData = await parseGpxManually(filename);

    let points = [];
    let hikeName = 'My Hike';

    const track = gpxData.gpx.trk[0];
    hikeName = track.name[0] || hikeName;
    const segments = track.trkseg;

    if (segments && segments.length > 0) {
      points = segments.flatMap(seg =>
        (seg.trkpt || []).map(pt => ({
          lon: parseFloat(pt.$.lon),
          lat: parseFloat(pt.$.lat),
          // Check if elevation exists, otherwise it will be NaN
          ele: pt.ele ? parseFloat(pt.ele[0]) : NaN,
        }))
      );
    }
    
    if (points.length === 0) {
      throw new Error('No valid points found in the GPX file.');
    }

    // --- THIS IS THE FIX ---
    // Check if the first valid point has elevation data.
    const hasElevation = !isNaN(points[0].ele);
    let wkt;

    if (hasElevation) {
      console.log('Building 3D trail with elevation...');
      wkt = `LINESTRING Z (${points.map(p => `${p.lon} ${p.lat} ${p.ele}`).join(',')})`;
    } else {
      console.log('Building 2D trail...');
      wkt = `LINESTRING(${points.map(p => `${p.lon} ${p.lat}`).join(',')})`;
    }

    console.log('Inserting hike data into the database...');
    
    const distanceKm = 15.5; // Placeholder
    const ascentM = 800;   // Placeholder

    const insertQuery = `
      INSERT INTO Hikes (name, distance_km, ascent_m, track)
      VALUES ($1, $2, $3, ST_GeogFromText($4))
    `;
    const values = [hikeName, distanceKm, ascentM, wkt];

    await pool.query(insertQuery, values);
    console.log(`✅ Successfully added "${hikeName}" to the database!`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();