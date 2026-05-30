import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Allowed users are stored ONLY in the AUTH_USERS environment variable
 * (never in source code). It is a JSON array of:
 *   { "email": "...", "name": "...", "passwordHash": "<bcrypt hash>" }
 *
 * Passwords are stored exclusively as bcrypt hashes — the plaintext password
 * never exists anywhere in the repo, the env, or the client bundle.
 *
 * To add/remove who can log in, run `npm run add-user` to generate an entry,
 * then update the AUTH_USERS env var on Vercel and redeploy.
 */
type AllowedUser = { email: string; name?: string; passwordHash: string };

function getAllowedUsers(): AllowedUser[] {
  const raw = process.env.AUTH_USERS;
  if (!raw) {
    console.error("[auth] AUTH_USERS env var is not set — no users can log in.");
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AllowedUser[]) : [];
  } catch {
    console.error("[auth] AUTH_USERS env var is not valid JSON.");
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const user = getAllowedUsers().find(
          (u) => u.email.trim().toLowerCase() === email
        );

        // Always run a bcrypt compare (even when the user is unknown) so the
        // response time doesn't reveal whether an email exists.
        const hash =
          user?.passwordHash ??
          "$2a$12$0000000000000000000000000000000000000000000000000000a";
        const ok = bcrypt.compareSync(credentials.password, hash);

        if (!user || !ok) return null;

        return {
          id: user.email,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
};
