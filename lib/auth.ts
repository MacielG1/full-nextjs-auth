import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, User, UserRole } from '@prisma/client';
import authConfig from '@/auth.config';
import prisma from './prisma';

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

      token.role = user.role;

      return token;
    },
    async session({ session, token, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.id,
        },
      });

      if (!existingUser?.emailVerified) return false;

      return true;
    },
  },
});

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
