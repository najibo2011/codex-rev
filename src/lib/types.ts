export type Category = 'Santé' | 'Autonomie' | 'Mémoire' | 'Loisirs';

export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  coverUrl: string;
  pdfKey: string;
  bullets: string[];
  rating: number;
  isBundle?: boolean;
  isNew?: boolean;
}

export interface ProductDetail extends ProductSummary {
  tableOfContents: string[];
  images: string[];
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
  }>;
}

export interface BundleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  items: string[];
}

export interface BlogSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}
