import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const password = await bcrypt.hash('password', 10); // Use a secure default password

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' }, // Check if 'admin' user already exists
    update: {}, // If exists, do nothing
    create: {
      username: 'admin',
      password: password,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`Created admin user: ${adminUser.username}`);
  console.log(`Login with username: 'admin' and password: 'password'`);
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });