import { MetadataRoute } from 'next';
import { blogPosts, products } from '@/lib/seed-data';

const baseUrl = 'https://senior-zen.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/ebooks', '/bundles', '/club', '/blog', '/faq', '/contact', '/legal', '/accessibility'];
  const productEntries = products.map((product) => ({
    url: `${baseUrl}/ebook/${product.slug}`,
    lastModified: new Date().toISOString(),
  }));
  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }));
  return [
    ...pages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date().toISOString() })),
    ...productEntries,
    ...blogEntries,
  ];
}
