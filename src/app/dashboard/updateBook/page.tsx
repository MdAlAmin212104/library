'use client';

import { fetchSingleBook, updateBook } from '@/app/features/book/bookSlices';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UpdateBookPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id') as string;
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.book);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    edition: '',
    category: '',
    language: '',
    totalCopies: 0,
    availableCopies: 0,
    publicationYear: 2025,
    description: '',
    bookCoverUrl: '',
  });


  useEffect(() => {
    if (bookId) {
      dispatch(fetchSingleBook(bookId));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    if (items.length > 0) {
      const book = items[0];
      setBookData({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        isbn: book.isbn,
        edition: book.edition,
        category: book.category,
        language: book.language,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        publicationYear: book.publicationYear,
        description: book.description,
        bookCoverUrl: book.bookCoverUrl,
      });
    }
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the updated data in the correct structure
    const updatedBookData = {
      bookId: bookId,
      updatedData: { ...bookData },
    };


    const result = await dispatch(updateBook(updatedBookData));

    if (result.type === 'data/updateBook/fulfilled') {
        router.push('/dashboard/bookList')
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  if (items.length === 0) {
    return <p>No book found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Update Book</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Publisher */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
            Publisher
          </label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={bookData.publisher}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={bookData.isbn}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Edition */}
        <div>
          <label htmlFor="edition" className="block text-sm font-medium text-gray-700">
            Edition
          </label>
          <input
            type="text"
            id="edition"
            name="edition"
            value={bookData.edition}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={bookData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={bookData.language}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Total Copies */}
        <div>
          <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700">
            Total Copies
          </label>
          <input
            type="number"
            id="totalCopies"
            name="totalCopies"
            value={bookData.totalCopies}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Available Copies */}
        <div>
          <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700">
            Available Copies
          </label>
          <input
            type="number"
            id="availableCopies"
            name="availableCopies"
            value={bookData.availableCopies}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Publication Year */}
        <div>
          <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">
            Publication Year
          </label>
          <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            value={bookData.publicationYear}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={bookData.description}
            onChange={handleTextAreaChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Book Cover URL */}
        <div>
          <label htmlFor="bookCoverUrl" className="block text-sm font-medium text-gray-700">
            Book Cover URL
          </label>
          <input
            type="text"
            id="bookCoverUrl"
            name="bookCoverUrl"
            value={bookData.bookCoverUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBookPage;
