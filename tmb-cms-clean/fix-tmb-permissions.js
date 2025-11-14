// Script to enable public API permissions for TMB content types
const fs = require('fs');
const path = require('path');

// Function to update permissions
const updatePermissions = () => {
  const permissionsPath = path.join(__dirname, 'src', 'extensions', 'users-permissions', 'config', 'permissions.json');

  // Create directory structure if it doesn't exist
  const dirPath = path.dirname(permissionsPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const permissions = {
    "public": {
      "api::tmbaccommodation.tmbaccommodation": {
        "controllers": {
          "tmbaccommodation": {
            "find": { "enabled": true },
            "findOne": { "enabled": true }
          }
        }
      },
      "api::tmb-stage.tmb-stage": {
        "controllers": {
          "tmb-stage": {
            "find": { "enabled": true },
            "findOne": { "enabled": true }
          }
        }
      }
    }
  };

  fs.writeFileSync(permissionsPath, JSON.stringify(permissions, null, 2));
  console.log('✅ TMB permissions configuration created');
  console.log('📍 File:', permissionsPath);
  console.log('\n⚠️  You need to manually enable these permissions in Strapi admin:');
  console.log('1. Go to Settings → Users & Permissions Plugin → Roles');
  console.log('2. Click on "Public" role');
  console.log('3. Scroll to "Tmbaccommodation" section');
  console.log('4. Check: find, findOne');
  console.log('5. Scroll to "Tmb-stage" section');
  console.log('6. Check: find, findOne');
  console.log('7. Click "Save"');
};

updatePermissions();
