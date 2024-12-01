"use client";
import { fetchBook } from "@/app/features/book/bookSlices";
import { BookRegister } from "@/app/type";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const BookList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, totalPages, status, error } = useSelector(
    (state: RootState) => state.book
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleUpdate = (userId: string) => {
    console.log({ userId });
  };

  useEffect(() => {
    dispatch(fetchBook({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  console.log({ book: items, totalPages });

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      {Array.isArray(items) && items.length > 0 ? (
        <div>
          <div className="md:grid grid-cols-3 gap-6">
            {items.map((book: BookRegister) => (
              <div key={book._id} className="card bg-base-100 shadow-xl mb-6">
                {/* Book Cover */}
                <figure>
                  <Image
                    width={500}
                    height={500}
                    src={
                      book.bookCoverUrl || "https://via.placeholder.com/400x400"
                    }
                    alt={book.title}
                    className="w-full h-96 "
                  />
                </figure>

                {/* Book Details */}
                <div className="card-body">
                  <h2 className="card-title text-xl font-semibold">
                    Name: {book.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Description:{" "}
                    {book.description.length > 50
                      ? `${book.description.slice(0, 50)}...`
                      : book.description}
                  </p>

                  {/* Additional Information */}
                  <div className="mt-4 space-y-2">
                    <p>
                      <span className="font-medium">Author:</span> {book.author}
                    </p>
                    <p>
                      <span className="font-medium">Publisher:</span>{" "}
                      {book.publisher}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {book.category}
                    </p>
                    <p>
                      <span className="font-medium">Language:</span>{" "}
                      {book.language}
                    </p>
                    <p>
                      <span className="font-medium">Year:</span>{" "}
                      {book.publicationYear}
                    </p>
                    <p>
                      <span className="font-medium">Available:</span>{" "}
                      {book.availableCopies} / {book.totalCopies}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdate(book._id)}
                    >
                      Update
                    </button>
                    <button className="btn btn-error">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <p className="text-lg text-gray-500">No Book found</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
