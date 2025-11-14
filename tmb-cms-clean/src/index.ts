export default {
  async bootstrap({ strapi }) {
    // Set up permissions for TMB stages and accommodations
    console.log('[BOOTSTRAP] Setting up API permissions...');

    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        // Get all permissions for public role
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: publicRole.id },
        });

        // Define which endpoints should be enabled
        const permissionsToEnable = [
          { controller: 'tmb-stage', action: 'find' },
          { controller: 'tmb-stage', action: 'findOne' },
          { controller: 'tmbaccommodation', action: 'find' },
          { controller: 'tmbaccommodation', action: 'findOne' },
        ];

        for (const perm of permissionsToEnable) {
          const existingPermission = permissions.find(
            p => p.action === `api::${perm.controller}.${perm.controller}.${perm.action}`
          );

          if (existingPermission && !existingPermission.enabled) {
            await strapi.query('plugin::users-permissions.permission').update({
              where: { id: existingPermission.id },
              data: { enabled: true },
            });
            console.log(`[BOOTSTRAP] Enabled: ${perm.controller}.${perm.action}`);
          }
        }

        console.log('[BOOTSTRAP] API permissions setup complete');
      }
    } catch (error) {
      console.error('[BOOTSTRAP] Error setting up permissions:', error);
    }
  },
};
