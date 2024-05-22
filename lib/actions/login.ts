'use server';

import { z } from 'zod';
import { LoginSchema } from '../schemas';
import { signIn } from '@/lib/auth';
import { defaultLoginRedirect } from '@/middleware';
import { AuthError } from 'next-auth';

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
