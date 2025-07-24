// src/types.ts

interface Tag {
  id: number;
  attributes: {
    name: string;
  };
}

// The main interface for a single Hike from your API response
export interface Hike {
  id: number;
  documentId: string; // <-- Add this line
  attributes: {
    title: string;
    Length: number;
    Difficulty: string;
    Description: any;
    mainImage: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    countries: Tag[];
    sceneries: Tag[];
    // ... add any other attributes here
  };
}