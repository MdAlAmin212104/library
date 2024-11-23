"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation"; // For back button navigation

interface User {
  name: string;
  phone?: string;
  roll?: string;
  email: string;
  photo?: string;
  department?: string;
  position?: string;
  batch?: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Hook for back button functionality

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading state while session is being fetched
  }

  if (status === "unauthenticated") {
    return <p>You are not logged in. Please sign in to view this page.</p>; // Show a message for unauthenticated users
  }

  // Ensure session?.user is typed properly
  const { name, phone, roll, email, photo, department, position, batch } = session?.user as User;

  return (
    <div>
      <h1 className="text-4xl text-center font-bold my-4">
        Profile Information
      </h1>

      

      <div className="mx-auto my-6 flex flex-col justify-center max-w-96 p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800">
        <Image
          width={300}
          height={300}
          src={photo || "https://i.ibb.co/DYQyXGW/photo.png"}
          alt="profile image"
          className="mx-auto rounded-full dark:bg-gray-500 aspect-square"
        />
        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
          <div className="my-2 space-y-1">
            <h2 className="text-xl font-semibold sm:text-2xl">{name}</h2>
            <p className="px-5 text-xs sm:text-base dark:text-gray-600">
              {department || position || 'N/A'}
            </p>
          </div>
          <div className="pt-4 space-y-2 text-center">
            <p>Email: {email}</p>
            <p>Phone: {phone || "N/A"}</p>
            {
                batch ? <>
                    <p>Batch : {batch}</p>
                    <p>Roll : {roll}</p>
                </> : <p>Id : {roll}</p>
            }
            
      <button
        onClick={() => router.back()}
        className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go Back
      </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
