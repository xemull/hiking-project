// src/types.ts

// --- SHARED SUB-TYPES ---
interface Tag {
  id: number;
  name: string;
}

interface SceneryTag {
  id: number;
  SceneryType: string; // Note: it's SceneryType, not name
}

interface MonthTag {
  id: number;
  MonthTag: string; // Note: it's MonthTag, not name
}

interface Media {
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface Video {
  id: number;
  title: string;
  youtube_url: string;
}

interface Book {
  id: number;
  title: string;
  url: string;
  cover_image?: Media;
}

interface AccommodationTag {
  id: number;
  AccommodationType: string;
}

// --- TYPE FOR THE HOMEPAGE LIST (from Strapi) ---
export interface HikeSummary {
  id: number; // Strapi database ID
  documentId: string;
  title: string;
  Length: number;
  Difficulty: string;
  Description?: any; // Add description for preview
  hike_id?: number; // GPX ID for linking to detail page
  countries: Tag[];
  sceneries: SceneryTag[]; // Updated to use SceneryTag
  mainImage: Media | null; // Can be null
}

// --- TYPE FOR THE DETAIL PAGE (from the custom backend) ---
export interface Hike {
  id: number; // This is the GPX/PostGIS ID
  name: string; // The GPX track name
  track: any; // GeoJSON object for the map
  simplified_profile: [number, number][]; // Data for the elevation chart
  
  // All the content from Strapi is nested here
  content: {
    title: string;
    Length: number;
    Difficulty: string;
    Elevation_gain: number;
    Best_time: string;
    routeType: string;
    Description: any;
    Logistics: any;
    Accommodation: any;
    mainImage: Media;
    countries: Tag[];
    sceneries: SceneryTag[];
    months: MonthTag[]; // Changed from seasons to months
    accommodations: AccommodationTag[];
    Videos: Video[];
    Books: Book[];
    landmarks: any[];
  };
}