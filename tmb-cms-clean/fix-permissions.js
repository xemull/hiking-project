/**
 * Fix Strapi API Permissions Script
 * Run this with: node fix-permissions.js
 *
 * This script will update the database directly to enable public access
 * for all content types.
 */

const { createConnection } = require('typeorm');

async function fixPermissions() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'aws-1-eu-west-1.pooler.supabase.com',
    port: parseInt(process.env.DATABASE_PORT) || 6543,
    username: process.env.DATABASE_USERNAME || 'postgres.lpkaumowfuovlgjgilrt',
    password: process.env.DATABASE_PASSWORD || 'ZZH4NxTL@W^D^h',
    database: process.env.DATABASE_NAME || 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database');

    // Get the public role ID
    const publicRole = await connection.query(
      `SELECT id FROM up_roles WHERE type = 'public' LIMIT 1`
    );

    if (!publicRole || publicRole.length === 0) {
      console.error('Public role not found!');
      return;
    }

    const roleId = publicRole[0].id;
    console.log(`Public role ID: ${roleId}`);

    // Content types that need public access
    const contentTypes = [
      { type: 'api::hike.hike', actions: ['find', 'findOne'] },
      { type: 'api::tmbaccommodation.tmbaccommodation', actions: ['find', 'findOne'] },
      { type: 'api::country.country', actions: ['find', 'findOne'] },
      { type: 'api::scenery.scenery', actions: ['find', 'findOne'] },
      { type: 'api::accommodation.accommodation', actions: ['find', 'findOne'] },
      { type: 'api::month.month', actions: ['find', 'findOne'] },
      { type: 'api::tmb-stage.tmb-stage', actions: ['find', 'findOne'] },
      { type: 'api::trail-news.trail-news', actions: ['find', 'findOne'] }
    ];

    // Enable permissions for each content type
    for (const ct of contentTypes) {
      for (const action of ct.actions) {
        const actionName = `${ct.type}.${action}`;

        // Check if permission already exists
        const existing = await connection.query(
          `SELECT id FROM up_permissions WHERE role = $1 AND action = $2`,
          [roleId, actionName]
        );

        if (existing && existing.length > 0) {
          // Update existing permission to enabled
          await connection.query(
            `UPDATE up_permissions SET enabled = true WHERE id = $1`,
            [existing[0].id]
          );
          console.log(`✓ Updated permission: ${actionName}`);
        } else {
          // Create new permission
          await connection.query(
            `INSERT INTO up_permissions (role, action, enabled, created_at, updated_at)
             VALUES ($1, $2, true, NOW(), NOW())`,
            [roleId, actionName]
          );
          console.log(`✓ Created permission: ${actionName}`);
        }
      }
    }

    console.log('\n✅ All permissions fixed!');
    console.log('\nPlease restart Strapi for changes to take effect:');
    console.log('gcloud run services update cms-service --region europe-west2 --command=""');

  } catch (error) {
    console.error('Error fixing permissions:', error);
  } finally {
    await connection.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.production' });

fixPermissions().catch(console.error);
