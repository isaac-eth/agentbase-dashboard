import { withAuth } from "next-auth/middleware";

/**
 * Auth gate for the whole app.
 *
 * Every page requires a valid session EXCEPT the login page ("/"). This is a
 * deny-by-default design: instead of listing the routes to protect (which let
 * /manual and /manual-mini slip through before), we protect everything and
 * explicitly allow the few public paths. Any new route is protected
 * automatically.
 *
 * Unauthenticated requests are redirected to "/" (our custom login page) via
 * the `pages.signIn` option below.
 */
export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // The login page itself is always reachable.
      if (req.nextUrl.pathname === "/") return true;
      // Everything else requires a signed-in user.
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Run on every request EXCEPT:
     *   - /api/auth/*        NextAuth's own endpoints (sign in/out, session)
     *   - /_next/static/*    build assets
     *   - /_next/image/*     image optimizer
     *   - favicon.ico
     *   - any file with an extension (logo.jpg, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
