// src/types.ts

// A simple interface for your tag-like collections
interface Tag {
  id: number;
  name: string;
}

// The main interface for a single Hike
export interface Hike {
  id: number;
  title: string;
  Length: number;
  Difficulty: string;
  Description: any; // Using 'any' for the complex Rich Text is fine for now
  mainImage: {
    url: string;
  };
  countries: Tag[];
  sceneries: Tag[];
  accommodations: Tag[];
  seasons: Tag[];
}