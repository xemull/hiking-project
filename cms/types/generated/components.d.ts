import type { Schema, Struct } from '@strapi/strapi';

export interface HikeBlog extends Struct.ComponentSchema {
  collectionName: 'components_hike_blogs';
  info: {
    displayName: 'Blog';
    icon: 'pencil';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HikeBooks extends Struct.ComponentSchema {
  collectionName: 'components_hike_books';
  info: {
    displayName: 'Books';
    icon: 'book';
  };
  attributes: {
    cover_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HikeLandmark extends Struct.ComponentSchema {
  collectionName: 'components_hike_landmarks';
  info: {
    displayName: 'Landmark';
  };
  attributes: {
    distance: Schema.Attribute.Decimal;
    name: Schema.Attribute.String;
  };
}

export interface HikeVideo extends Struct.ComponentSchema {
  collectionName: 'components_hike_videos';
  info: {
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    title: Schema.Attribute.String;
    youtube_url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hike.blog': HikeBlog;
      'hike.books': HikeBooks;
      'hike.landmark': HikeLandmark;
      'hike.video': HikeVideo;
    }
  }
}
