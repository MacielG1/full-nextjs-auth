import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import authConfig from '@/auth.config';
import prisma from './prisma';
import { getTwoFactorTokenConfirmation } from './twoFactorConfirmation';
import getAccount from './getAccount';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });
      if (!user) return token;

      const existingAccount = getAccount(user.id);

      token.isOAuth = !!existingAccount;
      token.email = user.email;
      token.name = user.name;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      console.log(user);

      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorTokenConfirmation(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: {
            userId: existingUser.id,
          },
        });
      }

      return true;
    },
  },
});

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
