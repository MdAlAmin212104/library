'use client';
import { deleteUser, fetchData } from '@/app/features/user/userSlices';
import { UserRegister } from '@/app/type';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const UserList: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { items, totalPages, status, error } = useSelector((state: RootState) => state.data);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  // const handleUpdate = (bookId: string) => {
  //  console.log(bookId);
  // }



  const handleDeleteUser = (userId: string) => {
    console.log(userId, 'delete user');
    dispatch(deleteUser(userId));
  }

  useEffect(() => {
    dispatch(fetchData({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User Information</th>
                <th>Department/Position</th>
                <th>Batch</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user: UserRegister) => (
                <tr key={user._id}>
                  
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
                    {user.department || user.position}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {user.roll}
                    </span>
                  </td>
                  <td>{user.batch || 'Teacher'}</td>
                  <th>
                    <Link href={{ pathname: '/dashboard/updateUser', query: { id: user._id } }} className="btn btn-ghost"><FaEdit className='text-3xl' /></Link>
                  </th>
                  <th>
                    <button onClick={() => handleDeleteUser(user._id ?? '')} className="btn btn-ghost"><MdDelete className='text-3xl text-red-500'/></button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn btn-outline btn-sm mr-2"
            >
              Previous
            </button>

            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn btn-outline btn-sm ml-2"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
