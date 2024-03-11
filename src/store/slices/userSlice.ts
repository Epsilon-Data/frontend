import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { UserModel } from '@app/domain/UserModel';
import { persistUser, readUser } from '@app/services/localStorage.service';

export interface UserState {
  user: UserModel | null;
}

const initialState: UserState = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<UserModel | null>>('user/setUser', (userDetails) => {
  const newUser = userDetails
    ? {
        id: userDetails.sub,
        firstName: userDetails.given_name,
        lastName: userDetails.family_name,
        userName: userDetails.preferred_username,
        email: { name: userDetails.email, verified: userDetails.email_verified },
        authTime: userDetails.auth_time * 1000,
        roles: userDetails.realm_access?.roles || [],
      }
    : null;

  persistUser(newUser);
  return {
    payload: newUser,
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
