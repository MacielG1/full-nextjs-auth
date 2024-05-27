'use server';

import { UserRole } from '@prisma/client';
import { auth } from '../auth';

export default async function admin() {
  const session = await auth();

  const role = session?.user?.role;

  if (role === UserRole.ADMIN) {
    return { success: 'Authorized' };
  }

  return {
    error: 'Not authorized',
  };
}
