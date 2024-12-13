import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // 1️⃣ Get the session token from the request (Extract role from the token)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 2️⃣ If no token is found, redirect to the login page
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3️⃣ Extract the role from the token
  const userRole = token.role;
  console.log(userRole, 'userRole');

  // 4️⃣ Define role-based route access control
  const roleBasedAccess = {
    admin: ['/dashboard', '/dashboard/userList', '/dashboard/bookList', '/dashboard/about', '/dashboard/addBook'],
    teacher: ['/teacher', '/teacher/about'], // teacher routes
    student: ['/student', '/dashboard/overview'], // student routes
  };

  // 5️⃣ Get the path the user is trying to access
  const currentPath = req.nextUrl.pathname;

  // 6️⃣ Check if the user's role allows access to the current route
  const isAuthorized = roleBasedAccess[userRole]?.some(path => currentPath.startsWith(path)) ?? false;

  // 7️⃣ If user is not authorized, redirect to the home page
  if (!isAuthorized) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home page
  }

  // 8️⃣ Redirect users to their respective dashboards if they visit /dashboard
  const redirectBasedOnRole = {
    admin: '/admin',
    teacher: '/teacher-dashboard',
    student: '/student-dashboard',
  };

  if (currentPath === '/dashboard') {
    const redirectUrl = redirectBasedOnRole[userRole];
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  // 9️⃣ Allow access to the route
  return NextResponse.next();
}

// 🔥 Apply middleware to specific routes
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect dashboard and its sub-routes
    '/teacher/:path*',   // Protect teacher routes
    '/student/:path*',   // Protect student routes
  ],
};
