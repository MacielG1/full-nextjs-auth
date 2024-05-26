'use server';

import { z } from 'zod';
import { LoginSchema } from '../schemas';
import { signIn } from '@/lib/auth';
import { defaultLoginRedirect } from '@/middleware';
import { AuthError } from 'next-auth';
import prisma from '../prisma';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '../verificationToken';
import { sendEmailVerification, sendTwoFactorTokenEmail } from '../email';
import { getTwoFactorTokenByEmail } from '../twoFactorToken';
import { getTwoFactorTokenConfirmation } from '../twoFactorConfirmation';

export async function login(data: z.infer<typeof LoginSchema>) {
  const validate = LoginSchema.safeParse(data);

  if (!validate.success) {
    console.log(validate.error.errors);
    return {
      error: 'Invalid data',
    };
  }

  const { email, password, twoFactorCode } = validate.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: 'Invalid credentials',
    };
  }

  if (!existingUser.emailVerified) {
    const token = await generateVerificationToken(email);

    await sendEmailVerification(email, token.token);

    return {
      success: 'Verification email sent!',
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: 'Invalid two factor code',
        };
      }

      if (twoFactorToken.token !== twoFactorCode) {
        return {
          error: 'Invalid two factor code',
        };
      }

      const expiresAt = new Date(twoFactorToken.expiresAt) < new Date();

      if (expiresAt) {
        return {
          error: 'Two factor code expired',
        };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorTokenConfirmation(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            userId: existingUser.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.id);

      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: defaultLoginRedirect,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === 'CredentialsSignin') {
        return { error: 'Invalid credentials' };
      } else {
        return { error: 'An error occurred' };
      }
    }
    throw err;
  }
  return {
    success: 'Logged in successfully',
  };
}
