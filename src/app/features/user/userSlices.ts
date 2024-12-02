/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRegister } from '@/app/type';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BaseUrl;
const backEndBaseUrl = process.env.NEXT_PUBLIC_BackEnd_BaseUrl;


interface DataState {
  items: UserRegister[];
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: DataState = {
  items: [],
  totalPages: 0,
  currentPage: 1,
  status: 'idle',
  error: null,
};




export const fetchData = createAsyncThunk<
  { users: UserRegister[]; totalPages: number; currentPage: number },
  { page: number; limit: number }
>('data/fetchData', async ({ page, limit }) => {
  const response = await axios.get(`${baseUrl}/dashboard/userList/api?page=${page}&limit=${limit}`);
  return response.data;
});


export const addData = createAsyncThunk<UserRegister, UserRegister>('data/addData',async (newData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${baseUrl}/register/api`, newData);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Handle error with rejectWithValue
        return rejectWithValue(error.response?.data || 'Failed to add data');
    }
    
});

console.log(baseUrl, 'this is an async function');

export const deleteUser = createAsyncThunk<string, string>(
  "data/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${backEndBaseUrl}/user/${userId}`);
      if (response.status === 200) {
        return userId; // Return the deleted user ID
      }
      throw new Error("Unexpected response status");
    } catch (error: any) {
      console.error("Error:", error);
      let errorMessage = "Failed to delete the user.";
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
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<{ users: UserRegister[]; totalPages: number; currentPage: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addData.fulfilled, (state, action: PayloadAction<UserRegister>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Delete book cases
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
  },
});

export default dataSlice.reducer;
