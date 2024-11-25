'use client';
import { fetchData } from '@/app/features/user/userSlices';
import { UserRegister } from '@/app/type';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type User = {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
};

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Typed useSelector return
  const { items, status, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      <h1 className="text-center font-bold text-4xl my-6">
        User List {items.length}
      </h1>

      <div className="overflow-x-auto">
        <table className="table">
          {/* Table Head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {items.map((user: UserRegister) => (
              <tr key={user._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Image
                          width={50}
                          height={50}
                          src={
                            user.profilePictureUrl ||
                            'https://img.daisyui.com/images/profile/demo/2@94.webp'
                          }
                          alt={`${user.name}'s Avatar`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                      <div className="text-sm opacity-50">{user.phone}</div>
                    </div>
                  </div>
                </td>
                <td>
                  Zemlak, Daniel and Leannon
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    Desktop Support Technician
                  </span>
                </td>
                <td>Purple</td>
                <th>
                  <button className="btn btn-ghost btn-xs">details</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
