const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndReset() {
  const users = await prisma.user.findMany();
  console.log('--- Current Users in DB ---');
  users.forEach(u => console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));

  // Reset/Ensure admin password is admin123
  const newHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@nurtechschool.id' },
    update: { password: newHash },
    create: {
      name: 'Administrator Nurtech',
      email: 'admin@nurtechschool.id',
      password: newHash,
      role: 'superadmin'
    }
  });

  console.log('\n[SUCCESS] Password for admin@nurtechschool.id has been set to: admin123');
}

checkAndReset()
  .catch(err => console.error('DB Error:', err))
  .finally(() => prisma.$disconnect());
