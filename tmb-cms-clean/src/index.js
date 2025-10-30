module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🔧 Bootstrapping Strapi - Configuring API permissions...');

    try {
      // Get the public role
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.error('❌ Public role not found');
        return;
      }

      console.log(`✓ Found public role (ID: ${publicRole.id})`);

      // Content types that need public access
      const contentTypes = [
        'api::hike.hike',
        'api::tmbaccommodation.tmbaccommodation',
        'api::country.country',
        'api::scenery.scenery',
        'api::accommodation.accommodation',
        'api::month.month',
        'api::tmb-stage.tmb-stage',
        'api::trail-news.trail-news',
        'api::user.user'  // Add user for any relations
      ];

      const actions = ['find', 'findOne'];

      // Enable permissions for each content type
      for (const contentType of contentTypes) {
        for (const action of actions) {
          try {
            const permissionAction = `${contentType}.${action}`;

            // Find existing permission
            const existingPermission = await strapi
              .query('plugin::users-permissions.permission')
              .findOne({
                where: {
                  action: permissionAction,
                  role: publicRole.id,
                },
              });

            if (existingPermission) {
              // Update if not enabled
              if (!existingPermission.enabled) {
                await strapi
                  .query('plugin::users-permissions.permission')
                  .update({
                    where: { id: existingPermission.id },
                    data: { enabled: true },
                  });
                console.log(`✓ Enabled: ${permissionAction}`);
              } else {
                console.log(`✓ Already enabled: ${permissionAction}`);
              }
            } else {
              // Create new permission
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: permissionAction,
                  role: publicRole.id,
                  enabled: true,
                },
              });
              console.log(`✓ Created: ${permissionAction}`);
            }
          } catch (error) {
            // Content type might not exist, skip silently
            if (!error.message.includes('does not exist')) {
              console.warn(`⚠ Warning for ${contentType}.${action}:`, error.message);
            }
          }
        }
      }

      console.log('✅ API permissions configuration complete!');
    } catch (error) {
      console.error('❌ Error configuring permissions:', error);
    }
  },
};
