import prisma from './prisma';

export async function getTwoFactorTokenConfirmation(userId: string) {
  try {
    const twoFactorToken = await prisma.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
}
