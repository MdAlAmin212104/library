import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token1 = req.cookies.get("next-auth.session-token");
  if (!token1 && req.nextUrl.pathname !== "/login") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  // Get the session token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token, 'this is token');

  // If no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If token exists, continue with the request
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*'], // Middleware will run for /dashboard and its sub-routes
};
