/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBook } from "@/app/features/book/bookSlices";

const AddBook: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const dispatch = useDispatch<AppDispatch>();

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    edition: "",
    category: "",
    language: "",
    totalCopies: 0,
    availableCopies: 0,
    publicationYear: 2025,
    description: "",
    bookCoverUrl: "",
    files: null, // Placeholder for file attachments
  });

  // Handle file input change and set file to state
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setNewBookData((prevData: any) => ({
        ...prevData,
        files: file, // Store the file for later upload
      }));
      console.log("Selected file:", file);
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    if (newBookData.files) {
      const file = newBookData.files;
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API; // Replace with your imgbb API key
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Upload image to ImgBB (replace 'YOUR_IMGBB_API_KEY' with your actual ImgBB API key)
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          formData
        );

        // If upload is successful, set the image URL in the form data
        const imageUrl = response.data.data.url;
        setValue("bookCoverUrl", imageUrl); // Save the image URL in the form state
        console.log("Image uploaded successfully:", imageUrl);

        // Now submit the rest of the form data with the image URL
        const bookData = {
          ...data,
          bookCoverUrl: imageUrl, // Add the image URL to the form data
        };
        console.log(bookData, "this is the book cover");

        // Dispatch the action to add the book
        const result = await dispatch(addBook(bookData));
        // Check if the book was successfully added (you might want to modify your redux action to return success/failure status)
        if (result.type === "data/addBook/fulfilled") {
          alert("Book added successfully");
          reset();
        } else {
          alert("Failed to add the book."); // Set error message
        }
        console.log(result, "Book added successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      alert("Please select an image for the book cover");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Add / Edit Book
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Controller
            name="title"
            control={control}
            defaultValue={newBookData.title}
            render={({ field }) => (
              <input
                type="text"
                id="title"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
            rules={{ required: "Title is required" }}
          />
          {errors.title && (
            <p className="text-red-600 text-sm">
              {errors.title?.message}
            </p>
          )}
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Author
          </label>
          <Controller
            name="author"
            control={control}
            defaultValue={newBookData.author}
            render={({ field }) => (
              <input
                type="text"
                id="author"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Publisher */}
        <div>
          <label
            htmlFor="publisher"
            className="block text-sm font-medium text-gray-700"
          >
            Publisher
          </label>
          <Controller
            name="publisher"
            control={control}
            defaultValue={newBookData.publisher}
            render={({ field }) => (
              <input
                type="text"
                id="publisher"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* ISBN */}
        <div>
          <label
            htmlFor="isbn"
            className="block text-sm font-medium text-gray-700"
          >
            ISBN
          </label>
          <Controller
            name="isbn"
            control={control}
            defaultValue={newBookData.isbn}
            render={({ field }) => (
              <input
                type="text"
                id="isbn"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Edition */}
        <div>
          <label
            htmlFor="edition"
            className="block text-sm font-medium text-gray-700"
          >
            Edition
          </label>
          <Controller
            name="edition"
            control={control}
            defaultValue={newBookData.edition}
            render={({ field }) => (
              <input
                type="text"
                id="edition"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <Controller
            name="category"
            control={control}
            defaultValue={newBookData.category}
            render={({ field }) => (
              <input
                type="text"
                id="category"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Language */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700"
          >
            Language
          </label>
          <Controller
            name="language"
            control={control}
            defaultValue={newBookData.language}
            render={({ field }) => (
              <input
                type="text"
                id="language"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Total Copies */}
        <div>
          <label
            htmlFor="totalCopies"
            className="block text-sm font-medium text-gray-700"
          >
            Total Copies
          </label>
          <Controller
            name="totalCopies"
            control={control}
            defaultValue={newBookData.totalCopies}
            render={({ field }) => (
              <input
                type="number"
                id="totalCopies"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Available Copies */}
        <div>
          <label
            htmlFor="availableCopies"
            className="block text-sm font-medium text-gray-700"
          >
            Available Copies
          </label>
          <Controller
            name="availableCopies"
            control={control}
            defaultValue={newBookData.availableCopies}
            render={({ field }) => (
              <input
                type="number"
                id="availableCopies"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Publication Year */}
        <div>
          <label
            htmlFor="publicationYear"
            className="block text-sm font-medium text-gray-700"
          >
            Publication Year
          </label>
          <Controller
            name="publicationYear"
            control={control}
            defaultValue={newBookData.publicationYear}
            render={({ field }) => (
              <input
                type="number"
                id="publicationYear"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Controller
            name="description"
            control={control}
            defaultValue={newBookData.description}
            render={({ field }) => (
              <textarea
                id="description"
                {...field}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        {/* Book Cover Image */}
        <div>
          <label
            htmlFor="bookCover"
            className="block text-sm font-medium text-gray-700"
          >
            Book Cover
          </label>
          <input
            type="file"
            id="bookCover"
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
