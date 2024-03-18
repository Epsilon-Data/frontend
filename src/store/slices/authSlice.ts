import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ResetPasswordRequest,
  login,
  signUp,
  SignUpRequest,
  resetPassword,
  verifySecurityCode,
  SecurityCodePayload,
  NewPasswordData,
  setNewPassword,
  doPageLoad,
  signOut,
} from '@app/api/auth.api';
import { setUser } from '@app/store/slices/userSlice';
import { deleteCsrf, deleteUser, persistCsrf, readCsrf } from '@app/services/localStorage.service';
import { getUserClaims } from '@app/api/http.api';
import { UserDetails } from '@app/domain/UserModel';

export interface AuthSlice {
  csrf: string | null;
}

const initialState: AuthSlice = {
  csrf: readCsrf(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async () =>
  login('http://localhost:3000').then((res) => {
    return res;
  }),
);

export const handleAuth = createAsyncThunk('auth/handleAuth', async (query: URLSearchParams) =>
  doPageLoad(query).then((res) => {
    persistCsrf(res.csrf);
    return res;
  }),
);

export const getClaims = createAsyncThunk('auth/getClaims', async (payload, { dispatch }) =>
  getUserClaims(readCsrf()).then(async (userDetails: UserDetails) => {
    // TODO: handle csrf expiry in auth-client
    // (userDetails.exp < new Date().getTime())
    dispatch(setUser(userDetails));
    return userDetails;
  }),
);

export const doSignUp = createAsyncThunk('auth/doSignUp', async (signUpPayload: SignUpRequest) =>
  signUp(signUpPayload),
);

export const doResetPassword = createAsyncThunk(
  'auth/doResetPassword',
  async (resetPassPayload: ResetPasswordRequest) => resetPassword(resetPassPayload),
);

export const doVerifySecurityCode = createAsyncThunk(
  'auth/doVerifySecurityCode',
  async (securityCodePayload: SecurityCodePayload) => verifySecurityCode(securityCodePayload),
);

export const doSetNewPassword = createAsyncThunk('auth/doSetNewPassword', async (newPasswordData: NewPasswordData) =>
  setNewPassword(newPasswordData),
);

export const doLogout = createAsyncThunk('auth/doLogout', async (payload, { dispatch }) =>
  signOut(readCsrf()).then((res) => {
    deleteCsrf();
    deleteUser();
    dispatch(setUser(null));
    return res;
  }),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleAuth.fulfilled, (state, action) => {
      state.csrf = action.payload.csrf;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.csrf = '';
    });
  },
});

export default authSlice.reducer;
