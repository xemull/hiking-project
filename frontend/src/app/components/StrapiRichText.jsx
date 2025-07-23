'use client';

import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function StrapiRichText({ content }) {
  if (!content) {
    return null;
  }
  return <BlocksRenderer content={content} />;
}