import pkg, { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient; // eslint-disable-line
}

let prisma;

if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  const { PrismaClient } = pkg;
  prisma = new PrismaClient();
}

export default prisma;
