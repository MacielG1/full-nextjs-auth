import authConfig from './auth.config';
import NextAuth from 'next-auth';

export const { auth } = NextAuth(authConfig);

export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/password-reset',
  '/auth/new-password',
];
export const publicRoutes = ['/', '/auth/verify-email'];
export const defaultLoginRedirect = '/settings';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let previousUrl = nextUrl.pathname;
    if (nextUrl.searchParams) {
      previousUrl += nextUrl.search;
    }
    const newUrl = encodeURIComponent(previousUrl);

    return Response.redirect(
      new URL(`/auth/login?previousUrl=${newUrl}`, nextUrl)
    );
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
