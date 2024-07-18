const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function measureExecutionTime(fn, label) {
  const start = process.hrtime();
  await fn();
  const end = process.hrtime(start);
  console.log(`${label} took ${end[0]}s ${end[1] / 1000000}ms`);
}

async function main() {
  // Generate dynamic URL and ID for the test
  const dynamicUrl = faker.internet.url();
  const dynamicId = faker.string.uuid()

  // Measure query performance for finding items by URL
  await measureExecutionTime(
    () => prisma.item1.findMany({ where: { url: { contains: "example" } } }),
    'Querying Item1 by URL (url as primary key)'
  );

  await measureExecutionTime(
    () => prisma.item2.findMany({ where: { url: { contains: "example" } } }),
    'Querying Item2 by URL (uuid as primary key with unique url)'
  );

  // Measure insertion performance with dynamic data
  await measureExecutionTime(
    () => prisma.item1.create({
      data: {
        url: dynamicUrl,
        title: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url()
      },
    }),
    'Inserting into Item1 (url as primary key)'
  );

  await measureExecutionTime(
    () => prisma.item2.create({
      data: {
        id: dynamicId,
        url: dynamicUrl,
        title: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url()
      },
    }),
    'Inserting into Item2 (uuid as primary key)'
  );

  // Measure upsert performance with dynamic data
  await measureExecutionTime(
    () => prisma.item1.upsert({
      where: {
        url: 'https://infatuated-tornado.name0',
      },
      update: {
        title: 'Updated Product',
        price: 79.99,
        thumbnail: 'https://updateditem.com/product123.jpg',
        updatedAt: new Date(),
      },
      create: {
        url: 'https://infatuated-tornado.name0',
        title: 'Updated Product',
        price: 79.99,
        thumbnail: 'https://updateditem.com/product123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    'Upserting Item1 (url as primary key)'
  );

  await measureExecutionTime(
    () => prisma.item2.upsert({
      where: {
        url: "https://infatuated-tornado.name0",
      },
      update: {
        url: 'https://infatuated-tornado.name0',
        title: 'Updated Product',
        price: 79.99,
        thumbnail: 'https://updateditem.com/product123.jpg',
        updatedAt: new Date(),
      },
      create: {
        id: dynamicId,
        url: 'https://infatuated-tornado.name0',
        title: 'Updated Product',
        price: 79.99,
        thumbnail: 'https://updateditem.com/product123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    'Upserting Item2 (uuid as primary key)'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
