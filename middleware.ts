export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/account/:path*', '/library/:path*', '/admin/:path*'],
};
