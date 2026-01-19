import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db"; // Memanggil koneksi Drizzle kamu

const handler = NextAuth({
  // 1. Ganti PrismaAdapter menjadi DrizzleAdapter
  adapter: DrizzleAdapter(db), 
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  // 2. Tambahkan session strategy jika diperlukan
  session: {
    strategy: "database", // NextAuth akan menyimpan session di tabel 'session' PostgreSQL
  },

  secret: process.env.NEXTAUTH_SECRET,

  // 3. Callback (Opsional tapi berguna agar ID user mudah diakses di frontend)
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };