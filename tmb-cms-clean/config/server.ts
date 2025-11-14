export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'),
  proxy: env('NODE_ENV') === 'production' ? true : env.bool('IS_PROXIED', false),
});
