'use server';

import { z } from 'zod';
import { LoginSchema } from '../schemas';
import { signIn } from '@/lib/auth';
import { defaultLoginRedirect } from '@/middleware';
import { AuthError } from 'next-auth';
import prisma from '../prisma';
import { generateVerificationToken } from '../verificationToken';
import { sendEmailVerification } from '../email';

export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    const validate = LoginSchema.safeParse(data);

    if (!validate.success) {
      console.log(validate.error.errors);
      return {
        error: 'Invalid data',
      };
    }

    const { email, password } = validate.data;

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

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: defaultLoginRedirect,
      });

      return {
        success: 'Logged in successfully',
      };
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
  } catch (err) {
    console.log('Error in login.ts', err);
    return {
      error: 'An error occurred',
    };
  }
}
