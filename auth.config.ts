import type { NextAuthConfig } from 'next-auth';
import { LoginSchema } from './lib/schemas';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validate = LoginSchema.safeParse(credentials);

        if (validate.success) {
          const { email, password } = validate.data;

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !user.password) {
            return null;
          }
          console.log('user', user);

          const isValid = await bcrypt.compare(password, user.password);

          console.log('isValid', isValid);
          if (isValid) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
