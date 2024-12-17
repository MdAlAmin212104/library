"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookRegister } from "./type";
import { fetchBook } from "./features/book/bookSlices";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { roll } = session?.user ?? { roll: null };
  
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalPages, status, error } = useSelector(
    (state: RootState) => state.book
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<BookRegister | null>(null); // Track the selected book
  const [startDate, setStartDate] = useState(""); // Date range start date
  const [endDate, setEndDate] = useState(""); // Date range end date
  const itemsPerPage = 9;
  const modalRef = useRef<HTMLDialogElement | null>(null); // Reference for modal

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const openModal = (book: BookRegister) => {
    setSelectedBook(book); // Set the selected book details
    modalRef.current?.showModal(); // Show the modal
  };

  const closeModal = () => {
    modalRef.current?.close(); // Close the modal
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      alert("End date must be after the start date.");
      return;
    }
  
    console.log(`Total Days: ${differenceInDays + 1} day(s)`); // +1 to include both start and end date
  
    if (roll && selectedBook?._id) {
      const bookingData = {
        userRoll: roll,
        bookId: selectedBook._id,
        startDate,
        endDate,
        totalDays: differenceInDays + 1, // Include total days in booking data
        status: "pending"
      };
  
      console.log("Booking Data:", bookingData);
      closeModal();
    } else {
      alert("User roll or book ID is missing.");
    }
  };
  

  useEffect(() => {
    dispatch(fetchBook({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  if (status === "loading") {
    return (
      <div className="grid md:grid-cols-3 justify-center gap-4 container mx-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col m-8 rounded shadow-md w-60 sm:w-80 animate-pulse h-96"
          >
            <div className="h-48 rounded-t bg-gray-300"></div>
            <div className="flex-1 px-4 py-8 space-y-4 bg-gray-50">
              <div className="w-full h-6 rounded bg-gray-300"></div>
              <div className="w-full h-6 rounded bg-gray-300"></div>
              <div className="w-3/4 h-6 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="my-6 container mx-auto">
      {Array.isArray(items) && items.length > 0 ? (
        <div>
          <div className="md:grid grid-cols-3 gap-6">
            {items.map((book: BookRegister) => (
              <div key={book._id} className="card bg-base-100 shadow-xl mb-6">
                <figure>
                  <Image
                    width={500}
                    height={500}
                    src={book.bookCoverUrl || "https://via.placeholder.com/400x400"}
                    alt={book.title}
                    className="w-full h-96"
                  />
                </figure>

                <div className="card-body">
                  <h2 className="card-title text-xl font-semibold">Name: {book.title}</h2>
                  <p className="text-sm text-gray-600">
                    Description: {book.description.length > 80 ? `${book.description.slice(0, 80)}... See more` : book.description}
                  </p>

                  <button type="button" onClick={() => openModal(book)} className="btn">
                    Book Browsing
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="btn btn-outline btn-sm mr-2">
              Previous
            </button>
            <span className="mx-2">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="btn btn-outline btn-sm ml-2">
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">No Book found</p>
        </div>
      )}

      <dialog ref={modalRef} id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Book Details</h3>
          {selectedBook && (
            <>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher}</p>

              <div className="mt-4">
                <label htmlFor="startDate">Start Date</label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input input-bordered w-full" />
              </div>

              <div className="mt-4">
                <label htmlFor="endDate">End Date</label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input input-bordered w-full" />
              </div>

              <div className="modal-action">
                <button onClick={handleSubmit} className="btn">Submit</button>
                <button onClick={closeModal} className="btn">Close</button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
