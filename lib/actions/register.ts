'use server';

import { z } from 'zod';
import { RegisterSchema } from '../schemas';

import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export async function register(data: z.infer<typeof RegisterSchema>) {
  try {
    const validate = RegisterSchema.safeParse(data);

    if (!validate.success) {
      console.log(validate.error.errors);
      return {
        error: 'Invalid data',
      };
    }

    const { name, email, password } = validate.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: 'Email already used!',
      };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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
