import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const user1Email = `alice${Date.now()}@prisma.io`;
  const user2Email = `bob${Date.now()}@prisma.io`;

  // Seed the database with users and API keys
  const user1 = await prisma.user.create({
    data: {
      email: user1Email,
      name: 'Alice',
      apiKeys: {
        create: {
          name: 'Alice API Key',
          key: `alice-key-${Date.now()}`,
          prefix: 'alice-',
          hashedKey: `hashed-alice-${Date.now()}`,
          isEnabled: true,
        },
      },
    },
    include: {
      apiKeys: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: user2Email,
      name: 'Bob',
      apiKeys: {
        create: [
          {
            name: 'Bob API Key 1',
            key: `bob-key1-${Date.now()}`,
            prefix: 'bob1-',
            hashedKey: `hashed-bob1-${Date.now()}`,
            isEnabled: true,
          },
          {
            name: 'Bob API Key 2',
            key: `bob-key2-${Date.now()}`,
            prefix: 'bob2-',
            hashedKey: `hashed-bob2-${Date.now()}`,
            isEnabled: false,
          },
        ],
      },
    },
    include: {
      apiKeys: true,
    },
  });

  console.log(
    `Created users: ${user1.name} (${user1.apiKeys.length} API key) and ${user2.name} (${user2.apiKeys.length} API keys)`,
  );

  // Retrieve all enabled API keys
  const allEnabledApiKeys = await prisma.apiKey.findMany({
    where: { isEnabled: true },
  });
  console.log(`Retrieved all enabled API keys: ${JSON.stringify(allEnabledApiKeys)}`);

  // Create a new API key for user1
  const newApiKey = await prisma.apiKey.create({
    data: {
      name: 'New Alice API Key',
      key: `alice-new-key-${Date.now()}`,
      prefix: 'alice-new-',
      hashedKey: `hashed-alice-new-${Date.now()}`,
      isEnabled: false,
      user: {
        connect: {
          email: user1Email,
        },
      },
    },
  });
  console.log(`Created a new API key: ${JSON.stringify(newApiKey)}`);

  // Enable the new API key
  const updatedApiKey = await prisma.apiKey.update({
    where: {
      id: newApiKey.id,
    },
    data: {
      isEnabled: true,
    },
  });
  console.log(`Enabled the newly created API key: ${JSON.stringify(updatedApiKey)}`);

  // Retrieve all API keys by user with email alice@prisma.io
  const apiKeysByUser = await prisma.apiKey.findMany({
    where: {
      user: {
        email: user1Email,
      },
    },
  });
  console.log(`Retrieved all API keys from a specific user: ${JSON.stringify(apiKeysByUser)}`);
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