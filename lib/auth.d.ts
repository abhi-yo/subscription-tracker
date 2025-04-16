import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
} 