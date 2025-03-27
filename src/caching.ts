import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient()
  .$extends(withAccelerate());

async function main() {
  const startTime = performance.now();

  const cachedUsersWithApiKeys = await prisma.user.findMany({
    where: {
      email: { contains: "alice" }
    },
    include: {
      apiKeys: true  // Changed from posts to apiKeys
    },
    cacheStrategy: {
      swr: 30,
      ttl: 60
    }
  });

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  console.log(`The query took ${elapsedTime}ms.`);
  console.log(`It returned the following data: \n`, cachedUsersWithApiKeys);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });