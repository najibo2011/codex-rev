import { blogPosts } from './seed-data';

const modules: Record<string, () => Promise<any>> = {
  'rituels-de-sommeil-apres-60-ans': () => import('@/content/blog/rituels-de-sommeil-apres-60-ans.mdx'),
  'stimuler-sa-memoire-chaque-jour': () => import('@/content/blog/stimuler-sa-memoire-chaque-jour.mdx'),
  'les-bons-reflexes-numeriques': () => import('@/content/blog/les-bons-reflexes-numeriques.mdx'),
};

export async function getBlogPost(slug: string) {
  const loader = modules[slug];
  if (!loader) return null;
  const mod = await loader();
  return {
    slug,
    metadata: mod.metadata,
    Content: mod.default,
  };
}

export async function listBlogPosts() {
  return Promise.all(
    blogPosts.map(async (post) => {
      const loaded = await getBlogPost(post.slug);
      return {
        ...post,
        ...loaded?.metadata,
      };
    })
  );
}
