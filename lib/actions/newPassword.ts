'use server';

import { z } from 'zod';
import { NewPasswordSchema } from '../schemas';
import { getPasswordResetTokenByToken } from '../passwordResetToken';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';

type NewPasswordData = {
  data: z.infer<typeof NewPasswordSchema>;
  token?: string | null;
};

export async function createNewPassword({ data, token }: NewPasswordData) {
  if (!token) return { error: 'Token not found' };

  const validate = NewPasswordSchema.safeParse(data);

  if (!validate.success) {
    return { error: 'Invalid password' };
  }

  const { password } = validate.data;

  const existingToken = await getPasswordResetTokenByToken(token);

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

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Password updated!' };
}
