import { UserRegister } from '@/app/type';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BaseUrl;


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
  console.log(response.data)
  return response.data;
});


export const addData = createAsyncThunk<UserRegister, UserRegister>('data/addData',async (newData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${baseUrl}/register/api`, newData);
        return response.data;
    } catch (error: any) {
        // Handle error with rejectWithValue
        return rejectWithValue(error.response?.data || 'Failed to add data');
    }
    
});

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
      });
  },
});

export default dataSlice.reducer;
