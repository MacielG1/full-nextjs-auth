import prisma from './prisma';

export default async function getAccount(userId: string) {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
      },
    });
  } catch (error) {
    return null;
  }
}
