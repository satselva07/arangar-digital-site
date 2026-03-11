import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(8),
  otp: z.string().trim().optional(),
});

const adminUser = process.env.ADMIN_USERNAME;
const adminPass = process.env.ADMIN_PASSWORD;
const isAdmin2faRequired = process.env.ADMIN_2FA_REQUIRED === "true";

const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        if (!adminUser || !adminPass) {
          console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not configured.");
          return null;
        }

        const { username, password, otp } = parsed.data;
        if (username !== adminUser || password !== adminPass) {
          return null;
        }

        if (isAdmin2faRequired) {
          if (!otp) {
            return null;
          }

          const { verifyAdminOtp } = await import("@/lib/admin-2fa");
          const otpValid = await verifyAdminOtp(otp);
          if (!otpValid) {
            return null;
          }
        }

        return {
          id: "admin",
          name: "Admin",
          email: process.env.ADMIN_EMAIL ?? "admin@arangardigital.local",
          role: "admin",
        } as const;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "user";
      }
      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      if (!pathname.startsWith("/admin")) {
        return true;
      }

      return auth?.user?.role === "admin";
    },
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
