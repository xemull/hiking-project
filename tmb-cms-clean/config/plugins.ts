export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCS_BUCKET_NAME', 'trailhead-strapi-uploads'),
        projectId: env('GCS_PROJECT_ID', 'trailhead-mvp'),
        publicFiles: true,
        uniform: true,
        baseUrl: 'https://storage.googleapis.com/trailhead-strapi-uploads',
      },
    },
  },
});
