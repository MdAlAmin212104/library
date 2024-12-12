/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookRegister } from "@/app/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = process.env.NEXT_PUBLIC_BackEnd_BaseUrl;

interface DataState {
  items: BookRegister[];
  totalPages: number;
  currentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: DataState = {
  items: [],
  totalPages: 0,
  currentPage: 1,
  status: "idle",
  error: null,
};

export const fetchBook = createAsyncThunk<
  { books: BookRegister[]; totalPages: number; currentPage: number },
  { page: number; limit: number }
>("data/fetchBook", async ({ page, limit }) => {
  const response = await axios.get(
    `${baseUrl}/books?page=${page}&limit=${limit}`
  );
  return response.data;
});

export const fetchSingleBook = createAsyncThunk<BookRegister, string>(
  'data/fetchSingleBook',
  async (bookId) => {
    try {
      const response = await axios.get(`${baseUrl}/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw new Error((error.response?.data?.message as string) || 'Failed to fetch book');
    }
  }
);

export const addBook = createAsyncThunk<BookRegister, BookRegister>(
  "data/addBook",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/book`, newData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error("Unexpected response status");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to add book data.";
      return rejectWithValue(errorMessage);
    }
  }
);

// bookSlices.ts

// export const deleteBook = createAsyncThunk<string, string>(
//   "data/deleteBook",
//   async (bookId, { rejectWithValue }) => {
//     try {
//       // Display the confirmation dialog
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!"
//       });

//       if (!result.isConfirmed) {
//         return rejectWithValue("Book deletion canceled by the user.");
//       }

//       const response = await axios.delete(`${baseUrl}/book/${bookId}`);

//       if (response.status === 200) {
//         // Show success message
//         await Swal.fire({
//           title: "Deleted!",
//           text: "The book has been deleted.",
//           icon: "success"
//         });
//         return bookId; // Return the deleted book ID
//       }

//       throw new Error("Unexpected response status");
//     } catch (error: any) {
//       console.error("Error:", error);
//       let errorMessage = "Failed to delete the book.";

//       if (error.response) {
//         // Server responded with an error
//         errorMessage = error.response.data?.message || errorMessage;
//       } else if (error.request) {
//         // No response from server
//         errorMessage = "No response from the server.";
//       } else {
//         // Other errors (e.g., incorrect request setup)
//         errorMessage = error.message;
//       }

//       // Show error message
//       await Swal.fire({
//         title: "Error!",
//         text: errorMessage,
//         icon: "error"
//       });
      
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

export const deleteBook = createAsyncThunk<string | null, string>(
  "data/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      // Display the confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (!result.isConfirmed) {
        // User canceled the action, exit gracefully without rejecting an error
        await Swal.fire({
          title: "Cancelled",
          text: "The book deletion was canceled.",
          icon: "info"
        });
        return null; // ✅ Return null explicitly
      }

      // Send the delete request
      const response = await axios.delete(`${baseUrl}/book/${bookId}`);

      if (response.status === 200 || response.status === 204) {
        // Show success message
        await Swal.fire({
          title: "Deleted!",
          text: "The book has been deleted.",
          icon: "success"
        });
        return bookId; // Return the deleted book ID as success response
      }

      throw new Error("Unexpected response status");
    } catch (error: any) {
      console.error("Error:", error);
      let errorMessage = "Failed to delete the book.";

      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // No response from server
        errorMessage = "No response from the server.";
      } else {
        // Other errors (e.g., incorrect request setup)
        errorMessage = error.message;
      }

      // Show error message
      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error"
      });

      return rejectWithValue(errorMessage);
    }
  }
);


export const updateBook = createAsyncThunk<
  BookRegister,
  { bookId: string; updatedData: Partial<BookRegister> }
>("data/updateBook", async ({ bookId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${baseUrl}/book/${bookId}`, updatedData);
    if (response.status === 200) {
      return response.data; // Return the updated book data
    }
    throw new Error("Unexpected response status");
  } catch (error: any) {
    console.error("Error:", error);
    const errorMessage = error.response?.data?.message || "Failed to update the book.";
    return rejectWithValue(errorMessage);
  }
});

// Slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBook.fulfilled,
        (
          state,
          action: PayloadAction<{
            books: BookRegister[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.status = "succeeded";
          state.items = action.payload.books;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
        }
      )
      .addCase(fetchBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchSingleBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSingleBook.fulfilled, (state, action: PayloadAction<BookRegister>) => {
        state.status = 'succeeded';
        state.items = [action.payload]; // Replace current items with the fetched book
      })
      .addCase(fetchSingleBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch book';
      })
      .addCase(addBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addBook.fulfilled,
        (state, action: PayloadAction<BookRegister>) => {
          state.status = "succeeded";
          state.items.push(action.payload);
        }
      )
      .addCase(addBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete book cases
      .addCase(deleteBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update book cases
      .addCase(updateBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload; // Update the specific book
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
