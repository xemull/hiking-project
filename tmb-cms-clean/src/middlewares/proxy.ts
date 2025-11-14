export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Force Koa to trust proxy headers in production
    if (process.env.NODE_ENV === 'production') {
      ctx.app.proxy = true;
    }
    await next();
  };
};
