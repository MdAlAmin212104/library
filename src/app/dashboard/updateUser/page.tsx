"use client";
import { fetchSingleUser, updateUser } from "@/app/features/user/userSlices";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UpdateUserPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.data);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    roll: "",
    department: "",
    batch: "",
    position: "",
    profilePictureUrl: "",
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (items.length > 0) {
      const user = items[0];
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        roll: user.roll || "",
        department: user.department || "",
        batch: user.batch || "",
        position: user.position || "",
        profilePictureUrl: user.profilePictureUrl || '',
      });
    }
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUserData = {
        userId: userId,
        updatedData: { ...userData },
      };

    try {
      const result = await dispatch(updateUser(updatedUserData));

      if (result.type === "data/updateUser/fulfilled") {
        router.push("/dashboard/userList");
      } else {
        console.error("Update failed:", result);
        alert("Failed to update user. Please try again.");
      }
    } catch (err) {
      console.error("Error during update:", err);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(userData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md`}
          >
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserPage;
