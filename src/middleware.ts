import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname === "/";
    const token = req.nextauth.token;

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Halaman "/" boleh diakses tanpa login, sisanya wajib login
        if (req.nextUrl.pathname === "/") return true;
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/", "/dashboard/:path*"] };