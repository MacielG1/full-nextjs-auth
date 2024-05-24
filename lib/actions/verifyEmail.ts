'use server';

import prisma from '../prisma';

export async function verifyEmail(token: string) {
  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!existingToken) {
    return { error: 'Token not found' };
  }

  const tokenExpired = new Date(existingToken.expiresAt) < new Date();

  if (tokenExpired) {
    return { error: 'Token expired' };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Email verified!' };
}
