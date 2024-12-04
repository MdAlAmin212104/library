/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store"; // Ensure these types are properly defined in your store
import { fetchData } from "../features/user/userSlices";

const Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Type the useSelector return value correctly
  const { items, status, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <div>
      <h1>User List</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <ul>
        {items.map((item: any) => (
          <li key={item._id}>
            {item.name} - {item.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
