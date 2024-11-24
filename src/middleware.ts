import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the user is authenticated (example assumes token in cookies)
  const token = req.cookies.get('authToken'); // Adjust key based on your auth setup

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow request to continue if authenticated
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*'], // Protect dashboard route and subroutes
};
