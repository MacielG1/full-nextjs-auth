import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  twoFactorCode: z.string().optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const userSettingsSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),

    isTwoFactorEnabled: z.boolean().optional(),
    role: z.enum([UserRole.USER, UserRole.ADMIN]),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Both password and new password are required',
      path: ['newPassword', 'password'],
    }
  );
