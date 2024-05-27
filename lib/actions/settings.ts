'use server';

import { z } from 'zod';
import { userSettingsSchema } from '../schemas';
import { auth } from '../auth';
import prisma from '../prisma';
import { generateVerificationToken } from '../verificationToken';
import { sendEmailVerification } from '../email';
import bcrypt from 'bcryptjs';

export default async function settings(
  data: z.infer<typeof userSettingsSchema>
) {
  const user = await auth();

  if (!user) {
    return { error: 'Not authorized' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.user.id },
  });

  if (!existingUser) {
    return { error: 'User not found' };
  }

  if (user.user.isOAuth) {
    data.email = undefined;
    data.password = undefined;
    data.newPassword = undefined;
    data.isTwoFactorEnabled = undefined;
  }

  if (data.email && data.email !== existingUser.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail && existingEmail.id !== user.user.id) {
      return { error: 'Email already in use' };
    }

    const verificationToken = await generateVerificationToken(data.email);

    await sendEmailVerification(data.email, verificationToken.token);

    return { success: 'Verification email sent' };
  }

  if (data.newPassword && data.password && existingUser.password) {
    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { error: 'Incorrect password' };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    data.password = hashedPassword;
    data.newPassword = undefined;
  }
  if (existingUser)
    await prisma.user.update({
      where: { id: user.user.id },
      data,
    });

  return { success: 'Settings updated!' };
}
