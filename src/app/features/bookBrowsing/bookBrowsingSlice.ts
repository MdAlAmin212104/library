/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookBrowsing } from "@/app/type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Ensure baseUrl is a string and throw an error if it's undefined
const baseUrl = process.env.NEXT_PUBLIC_BackEnd_BaseUrl as string;
if (!baseUrl) {
  throw new Error("Base URL is not defined in the environment variables.");
}

interface DataState {
  items: BookBrowsing[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: DataState = {
  items: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch book browsing data
export const fetchBookBrowsing = createAsyncThunk<
  { books: BookBrowsing[]; totalPages: number; currentPage: number }
>("data/fetchBookBrowsing", async () => {
  const response = await axios.get(`${baseUrl}/bookBrowsing`);
  return response.data;
});

// Async thunk to add a new book to the browsing list
export const addBookBrowsing = createAsyncThunk<
  BookBrowsing, // Return type of fulfilled action
  BookBrowsing, // Argument type when dispatching the thunk
  { rejectValue: string } // Type for rejectWithValue payload
>(
  "data/addBookBrowsing",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.post<BookBrowsing>(`${baseUrl}/bookBrowsing`, newData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error("Unexpected response status");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Failed to add book data.";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("Unexpected error occurred.");
    }
  }
);

// Redux slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchBookBrowsing async thunk
      .addCase(fetchBookBrowsing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookBrowsing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.books;
      })
      .addCase(fetchBookBrowsing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      })
      
      // Handle addBookBrowsing async thunk
      .addCase(addBookBrowsing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBookBrowsing.fulfilled, (state, action: PayloadAction<BookBrowsing>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addBookBrowsing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string; // assert that the payload is a string
      });
  },
});

export default dataSlice.reducer;
