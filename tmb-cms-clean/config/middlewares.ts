export default ({ env }) => {
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:1337',
    'https://frontend-service-623946599151.europe-west2.run.app',
    'https://cms-service-623946599151.europe-west2.run.app',
  ];

  return [
    'global::proxy',
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'https://market-assets.strapi.io',
              'https://storage.googleapis.com',
            ],
            'media-src': [
              "'self'",
              'data:',
              'blob:',
              'https://storage.googleapis.com',
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: env.array('CORS_ORIGINS', defaultOrigins),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    {
      name: 'strapi::session',
      config: {
        cookie: {
          secure: env('NODE_ENV') === 'production',
          sameSite: env('NODE_ENV') === 'production' ? 'lax' : false,
        },
      },
    },
    'strapi::favicon',
    'strapi::public',
  ];
};
