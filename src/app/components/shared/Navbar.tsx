'use client'
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { role } = session?.user ?? { role: null };
  
  const dashboardLink = role === 'admin' 
    ? '/dashboard/home' 
    : role === 'teacher' 
    ? '/teacher' 
    : '/student'; // Default fallback link (optional)

  const link = (
    <>
      <li><Link href='/'>Home</Link></li>
      <li><Link href='/bookList'>Book Catalog</Link></li>
      <li><Link href='/about'>About</Link></li>
    </>
  );

  return (
    <div className="bg-base-100">
      <div className="navbar container mx-auto ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {link}
            </ul>
          </div>
          <Link href='/' className="btn btn-ghost text-xl">
            <Image
              src="/image/Logo.jpg"
              width={40}
              height={40}
              alt="Logo picture"
              className="rounded-full"
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {link}
          </ul>
        </div>
        <div className="navbar-end space-x-4">
          {status === 'loading' && <h6>Loading....</h6>}
          {status === 'unauthenticated' &&
            <Link href='/login' className="btn btn-primary">Login</Link>}
          {status === 'authenticated' &&
            <>
              <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </button>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <Image
                      width={50}
                      height={50}
                      src={session.user?.photo as string || 
                        "https://lh3.googleusercontent.com/a/ACg8ocKfSrgZFBvoQ6s12ZB8gHSg3E625KGpnaiYthDiKIfNqh1g62wg=s96-c"} 
                      alt="profile photo"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href='/profile' className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li><Link href={dashboardLink}>Dashboard</Link></li>
                  <li><span onClick={() => signOut()}>Logout</span></li>
                </ul>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
