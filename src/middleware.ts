import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Get the session token from the request (extract role from the token)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect to login if no token is found and the user is not trying to access the login page
  if (!token && req.nextUrl.pathname !== "/login") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Extract the role from the token
  const userRole = token.role;
  console.log(userRole, "userRole");

  // Define role-based route access control
  const roleBasedAccess = {
    admin: ['/dashboard', '/dashboard/userList', '/dashboard/bookList', '/dashboard/about', '/dashboard/addBook'],
    teacher: ['/teacher', '/teacher/about'], // teacher can access these routes
    student: ['/student', '/dashboard/overview'], // student routes
  };

  // Get the path the user is trying to access
  const currentPath = req.nextUrl.pathname;

  // Check if the role is allowed to access the current route
  const isAuthorized = Object.entries(roleBasedAccess).some(([role, paths]) => {
    if (userRole === role) {
      // Check if the user's role allows access to this path
      return paths.some(path => currentPath.startsWith(path));
    }
    return false;
  });

  // If user is not authorized, redirect to the unauthorized page
  if (!isAuthorized) {
    return NextResponse.redirect(new URL('/unauthorized', req.url)); // Redirect to unauthorized page
  }

  // Redirect based on user role (differentiated routes based on the role)
  const redirectBasedOnRole = {
    admin: '/admin-dashboard',  // Redirect admin to a specific dashboard
    teacher: '/teacher-dashboard', // Redirect teacher to a teacher's dashboard
    student: '/student-dashboard', // Redirect student to a student dashboard
  };

  // If the user is logging in (i.e., on /dashboard), check their role and redirect
  if (currentPath === '/dashboard') {
    const redirectUrl = redirectBasedOnRole[userRole];
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));  // Redirect based on role
    }
  }

  // If token exists and role is authorized, continue with the request
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*'], // Middleware will run for /dashboard and its sub-routes
};
