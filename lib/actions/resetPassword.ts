'use server';

import { z } from 'zod';
import { ResetPasswordSchema } from '../schemas';
import prisma from '../prisma';
import { generatePasswordResetToken } from '../verificationToken';
import { sendPasswordResetEmail } from '../email';

export async function resetPassword(data: z.infer<typeof ResetPasswordSchema>) {
  const validate = ResetPasswordSchema.safeParse(data);

  if (!validate.success) {
    return { error: 'Invalid email' };
  }

  const { email } = validate.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  const resetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(email, resetToken.token);

  return { success: 'Password reset email sent!' };
}
