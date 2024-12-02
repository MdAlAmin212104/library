/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookRegister } from "@/app/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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
        console.log("Response Data:", response.data);
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
export const deleteBook = createAsyncThunk<string, string>(
  "data/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}/book/${bookId}`);
      if (response.status === 200) {
        return bookId; // Return the deleted book ID
      }
      throw new Error("Unexpected response status");
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete the book.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBook = createAsyncThunk<
  BookRegister,
  { bookId: string; updatedData: Partial<BookRegister> }
>("data/updateBook", async ({ bookId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${baseUrl}/book/${bookId}`, updatedData);
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
