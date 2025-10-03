import type { Schema, Struct } from '@strapi/strapi';

export interface AccommodationService extends Struct.ComponentSchema {
  collectionName: 'components_accommodation_services';
  info: {
    displayName: 'Service';
  };
  attributes: {
    additional_cost: Schema.Attribute.Decimal;
    available: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    notes: Schema.Attribute.String;
    service_details: Schema.Attribute.String;
    service_name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HikeBlog extends Struct.ComponentSchema {
  collectionName: 'components_hike_blogs';
  info: {
    displayName: 'Blog';
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
  };
  attributes: {
    title: Schema.Attribute.String;
    youtube_url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'accommodation.service': AccommodationService;
      'hike.blog': HikeBlog;
      'hike.books': HikeBooks;
      'hike.landmark': HikeLandmark;
      'hike.video': HikeVideo;
    }
  }
}
