import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const url = 'https://senior-zen.example';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
