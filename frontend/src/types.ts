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
  cover_image?: Media; // Optional since it might not always be present
}

interface Blog {
  id: number;
  title: string;
  url: string;
}

interface AccommodationTag {
  id: number;
  AccommodationType: string;
}

// --- QUIZ TYPES ---
export interface QuizAnswer {
  text: string;
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  name: string;
  tags: string[];
  persona: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  country: string;
  highlights: string;
  slug: string;
}

export interface QuizCompletion {
  id?: number;
  answers: QuizAnswer[];
  result: QuizResult;
  email?: string;
  completionTimeMs?: number;
  completedAt?: string;
}

export interface QuizAnalytics {
  totalCompletions: number;
  uniqueEmailCompletions: number;
  avgCompletionTimeMs: number;
  topResults: Array<{
    hikeName: string;
    persona: string;
    count: number;
  }>;
  conversionRates: {
    emailCapture: number;
    newsletterSignup: number;
  };
}

// --- TYPE FOR THE HOMEPAGE LIST (from Strapi) ---
export interface HikeSummary {
  id: number; // Strapi database ID
  documentId: string;
  title: string;
  Length: number;
  Difficulty: string;
  Best_time: string;
  continent: string;
  Description?: any; // Add description for preview
  hike_id?: number; // GPX ID for linking to detail page
  routeType?: string; // ADDED: Route type field
  countries: Tag[];
  sceneries: SceneryTag[]; // Updated to use SceneryTag
  months: MonthTag[]; // Added months field
  accommodations: AccommodationTag[]; // ADDED: Missing accommodations field
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
    Accomodation: any;
    mainImage: Media;
    countries: Tag[];
    sceneries: SceneryTag[];
    months: MonthTag[]; // Changed from seasons to months
    accommodations: AccommodationTag[];
    Videos: Video[];
    Books: Book[];
    Blogs: Blog[]; // ADDED: Missing Blogs field
    landmarks: any[];
  };
}

// --- NEWSLETTER TYPES ---
export interface NewsletterSubscription {
  email: string;
  source?: 'general' | 'quiz' | 'footer' | 'modal';
  quizResult?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

// --- TRAIL NEWS TYPES ---
export interface TrailNews {
  id: number;
  documentId: string;
  title: string;
  date: string; // ISO date string
  category: 'Trail Update' | 'Weather' | 'Accommodation' | 'Event' | 'Alert';
  trail?: string;
  summary: string;
  content?: string;
  severity: 'info' | 'warning' | 'critical';
  isActive: boolean;
  expiryDate?: string; // ISO date string
  source?: string;
  image?: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}