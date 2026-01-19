import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt", // Database strategy untuk persistensi session
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 1. Simpan user ID ke dalam token JWT saat login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 2. Kirim user ID dari token ke object session agar bisa dipakai di frontend
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore (jika typescript komplain)
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Arahkan balik ke home jika butuh login
  }
};