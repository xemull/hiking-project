-- Enable the PostGIS extension for geospatial capabilities
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the main table to store hike information
CREATE TABLE IF NOT EXISTS Hikes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    distance_km NUMERIC(5, 1),
    ascent_m INTEGER,
    track GEOGRAPHY(LINESTRING, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);