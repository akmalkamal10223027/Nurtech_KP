const { PrismaClient } = require('@prisma/client');

let prisma;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.warn('PrismaClient not generated yet or failed initialization:', error.message);
}

module.exports = prisma;
