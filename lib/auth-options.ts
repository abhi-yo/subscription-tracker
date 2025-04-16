import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

export interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

const clientSecrets = JSON.parse(process.env.GOOGLE_CLIENT_SECRETS || "{}");

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: clientSecrets.web?.client_id || "",
      clientSecret: clientSecrets.web?.client_secret || "",
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const customToken = token as CustomToken;
      if (account) {
        customToken.accessToken = account.access_token;
        customToken.refreshToken = account.refresh_token;
        customToken.expiresAt = account.expires_at;
      }
      return customToken;
    },
    async session({ session, token }) {
      const customToken = token as CustomToken;
      session.accessToken = customToken.accessToken;
      session.error = customToken.error;
      if (!session.user) {
        session.user = {};
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 