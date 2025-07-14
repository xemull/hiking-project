const fs = require('fs');
const { Pool } = require('pg');
const gpxParse = require('gpx-parse');

const pool = new Pool({
  user: 'hike_admin',
  host: '127.0.0.1',
  database: 'hikes_db',
  password: '***REMOVED***', // <-- Your correct password
  port: 5433,
});

const parseGpx = (filePath) => {
  return new Promise((resolve, reject) => {
    gpxParse.parseGpxFromFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const seedDatabase = async () => {
  try {
    const filename = 'my-hike.gpx'; // Your real GPX filename
    console.log(`Parsing GPX file: ${filename}...`);
    const gpxData = await parseGpx(filename);

    let points = [];
    let hikeName = 'My Real Hike';

    // Check for tracks first
    if (gpxData.tracks && gpxData.tracks.length > 0) {
      console.log('Track found. Processing track points...');
      points = gpxData.tracks[0].segments[0].points;
      hikeName = gpxData.tracks[0].name || hikeName;
    // If no tracks, check for routes
    } else if (gpxData.routes && gpxData.routes.length > 0) {
      console.log('Route found. Processing route points...');
      points = gpxData.routes[0].points;
      hikeName = gpxData.routes[0].name || hikeName;
    } else {
      throw new Error('No tracks or routes found in the GPX file.');
    }

    if (points.length === 0) {
      throw new Error('No points found within the track or route.');
    }

    // Convert points to WKT format
    const wkt = `LINESTRING(${points.map(p => `${p.lon} ${p.lat}`).join(',')})`;

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