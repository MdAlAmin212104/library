
import { UserRegister } from '@/app/type';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BaseUrl;


interface DataState {
  items: UserRegister[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: DataState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchData = createAsyncThunk<UserRegister[]>('data/fetchData', async () => {
  const response = await axios.get(`${baseUrl}/dashboard/userList/api`);
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
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<UserRegister[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      // .addCase(fetchUserData.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserRegister[]>) => {
      //   state.status = 'succeeded';
      //   state.items = action.payload;
      // })
      // .addCase(fetchUserData.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message || 'Something went wrong';
      // })
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
