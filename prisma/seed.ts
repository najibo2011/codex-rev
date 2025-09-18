import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { blogPosts, bundles, coupons, products } from '../src/lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.info('Seeding database…');
  await prisma.entitlement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.post.deleteMany();
  await prisma.coupon.deleteMany();

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category as any,
        coverUrl: product.coverUrl,
        pdfKey: product.pdfKey,
        shortBulletPoints: product.bullets,
        tableOfContents: product.tableOfContents,
        isBundle: false,
      },
    });
  }

  for (const bundle of bundles) {
    const bundleItemIds = products
      .filter((product) => bundle.items.includes(product.title))
      .map((product) => product.id);
    await prisma.product.create({
      data: {
        id: bundle.id,
        slug: bundle.slug,
        title: bundle.title,
        description: bundle.description,
        price: bundle.price,
        category: 'Loisirs',
        coverUrl: `/images/covers/${bundle.slug}.svg`,
        pdfKey: `bundles/${bundle.slug}.zip`,
        shortBulletPoints: bundle.items,
        tableOfContents: bundle.items,
        isBundle: true,
        bundleItemIds,
      },
    });
  }

  for (const post of blogPosts) {
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${post.slug}.mdx`);
    const content = await fs.readFile(filePath, 'utf-8');
    await prisma.post.create({
      data: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentMdx: content,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }

  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: {
        code: coupon.code,
        percentOff: coupon.percentOff,
        amountOff: coupon.amountOff ?? null,
        validFrom: new Date(coupon.validFrom),
        validTo: new Date(coupon.validTo),
        maxRedemptions: coupon.maxRedemptions,
      },
    });
  }

  console.info('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
