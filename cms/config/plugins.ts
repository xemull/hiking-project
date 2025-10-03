import path from 'path';

export default {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: 'trailhead-strapi-uploads',
        publicFiles: true,
        uniform: true,
        basePath: '',
        serviceAccount: process.env.GCS_SERVICE_ACCOUNT
          ? JSON.parse(process.env.GCS_SERVICE_ACCOUNT)
          : require(path.join(process.cwd(), 'gcs-credentials.json')),
      },
    },
  },
};