-- Delete the old table if it exists, ensuring a clean slate
DROP TABLE IF EXISTS Hikes;

-- Enable the PostGIS extension for geospatial capabilities
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the main table to store hike information
CREATE TABLE Hikes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    track GEOGRAPHY(LINESTRINGZ, 4326),
    simplified_profile JSONB, -- This will store the simplified [distance, elevation] points
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);