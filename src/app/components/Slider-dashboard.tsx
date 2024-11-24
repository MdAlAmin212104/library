// app/components/Slider-dashboard.tsx
'use client'
import { AiOutlineBars } from "react-icons/ai";
import { GrLogout } from "react-icons/gr";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

const Slider: React.FC = () => {
  const [isActive, setActive] = useState<boolean>(false);

  const handleToggle = (): void => {
    setActive(!isActive);
  };

  const handleLogout = (): void => {
    console.log("User logged out");
  };

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link href="/">Home</Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive ? "translate-x-0" : "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-rose-100 mx-auto">
              <Link href="/">
                <button className="btn bg-transparent border-none dark:text-black hover:text-white">
                  <FaHome />
                  Home
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 mt-6 space-y-4 dark:text-black">
            <Link href="/dashboard/about">
              <nav className="w-full p-2 shadow-lg rounded-lg text-center bg-rose-100 mx-auto">
                Admin Home
              </nav>
            </Link>
            <Link href="/dashboard/contact">
              <nav className="w-full p-2 shadow-lg rounded-lg text-center bg-rose-100 mx-auto">
                Manage user
              </nav>
            </Link>
            <Link href="/dashboard/faq">
              <nav className="w-full p-2 shadow-lg rounded-lg text-center bg-rose-100 mx-auto">
                Payment
              </nav>
            </Link>
            <Link href="/dashboard/shop">
              <nav className="w-full p-2 shadow-lg rounded-lg text-center bg-rose-100 mx-auto">
                Survey List
              </nav>
            </Link>
          </div>
        </div>

        <div>
          <hr />
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform dark:text-black"
          >
            <GrLogout className="w-5 h-5" />
            <span className="mx-4 font-medium ">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Slider;
