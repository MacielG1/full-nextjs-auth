'use server';

import { z } from 'zod';
import { userSessionSchema } from '../schemas';
import { auth } from '../auth';
import prisma from '../prisma';

export default async function settings(
  data: z.infer<typeof userSessionSchema>
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

  await prisma.user.update({
    where: { id: user.user.id },
    data,
  });

  return { success: 'Settings updated!' };
}
