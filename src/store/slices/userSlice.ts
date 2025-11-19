import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { UserDetails } from '@app/domain/UserDetails';
import { persistUser, readUser } from '@app/services/localStorage.service';

export interface UserState {
  user: UserDetails | null;
}

const initialState: UserState = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<UserDetails | null>>('user/setUser', (userDetails) => {
  persistUser(userDetails);
  return {
    payload: userDetails,
  };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;
