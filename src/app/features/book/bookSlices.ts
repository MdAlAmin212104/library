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
      });
  },
});

export default dataSlice.reducer;
