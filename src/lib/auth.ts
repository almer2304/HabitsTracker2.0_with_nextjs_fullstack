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
    async jwt({ token, user, trigger, session }) {
      // 1. SAAT LOGIN: Ambil data dari database ke dalam token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        // Ambil username dari user adapter (drizzle)
        token.username = (user as any).username || null;
      }

      // 2. SAAT UPDATE: Jika ada trigger "update" dari frontend (Settings Page)
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.username = session.user.username;
      }

      return token;
    },
    async session({ session, token }) {
      // 3. KIRIM KE FRONTEND: Masukkan data token ke object session agar bisa dibaca useSession()
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Arahkan balik ke home jika butuh login
  }
};