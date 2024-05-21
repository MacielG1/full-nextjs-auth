'use server';

import { z } from 'zod';
import { LoginSchema } from '../schemas';

export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    const validate = LoginSchema.safeParse(data);

    if (!validate.success) {
      console.log(validate.error.errors);
      return {
        error: 'Invalid data',
      };
    }

    return {
      success: 'Logged in successfully',
    };
  } catch (err) {
    console.log('Error in login.ts', err);
    return {
      error: 'An error occurred',
    };
  }
}
