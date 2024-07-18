const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  const data1 = [];
  const data2 = [];

  for (let i = 0; i < 100000; i++) {
    const url = `${faker.internet.url()}${i}`;
    const title = faker.commerce.productName();
    const price = parseFloat(faker.commerce.price());
    const thumbnail = faker.image.imageUrl();

    data1.push({
      url,
      title,
      price,
      thumbnail,
    });

    data2.push({
      url,
      title,
      price,
      thumbnail,
    });
  }

  await prisma.item1.createMany({ data: data1 });
  await prisma.item2.createMany({ data: data2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
