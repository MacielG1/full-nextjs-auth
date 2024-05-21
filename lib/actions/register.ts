'use server';

import { z } from 'zod';
import { RegisterSchema } from '../schemas';

export async function register(data: z.infer<typeof RegisterSchema>) {
  try {
    const validate = RegisterSchema.safeParse(data);

    if (!validate.success) {
      console.log(validate.error.errors);
      return {
        error: 'Invalid data',
      };
    }

    return {
      success: 'Registered in successfully',
    };
  } catch (err) {
    console.log('Error in register.ts', err);
    return {
      error: 'An error occurred',
    };
  }
}
