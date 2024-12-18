
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../app/features/user/userSlices';
import BookReducer from '../app/features/book/bookSlices';
import BookBrowsingReducer from '../app/features/bookBrowsing/bookBrowsingSlice';

export const store = configureStore({
  reducer: {
    data : userReducer,
    book: BookReducer,
    bookBrowsing : BookBrowsingReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch