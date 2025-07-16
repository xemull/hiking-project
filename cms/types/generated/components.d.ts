import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'hike.landmark': HikeLandmark;
    }
  }
}
