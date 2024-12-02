'use client';

import { fetchSingleBook } from '@/app/features/book/bookSlices';
import { AppDispatch, RootState } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UpdateBookPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id') as string; 


  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.book);

  useEffect(() => {
    dispatch(fetchSingleBook(bookId));
  }, [dispatch, bookId]);


  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  if (items.length === 0) {
    return <p>No book found.</p>;
  }

  const book = items[0];


  return (
    <div>
      <h1>Update Book</h1>
      <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      {/* Render other details */}
    </div>
    </div>
  );
};

export default UpdateBookPage;
