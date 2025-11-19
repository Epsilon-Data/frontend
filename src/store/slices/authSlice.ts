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
import { UserDetails } from '@app/domain/UserDetails';

export interface AuthSlice {
  csrf: string | null;
  initialized: boolean;
}

const initialState: AuthSlice = {
  csrf: readCsrf(),
  initialized: false,
};

export const doLogin = createAsyncThunk('auth/doLogin', async () =>
  login(window.location.origin).then((res) => {
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
    // check expiry of token
    if (Math.floor(Date.now() / 1000) >= userDetails.exp) {
      deleteCsrf();
      deleteUser();
      dispatch(setUser(null));
      return null;
    } else {
      dispatch(setUser(userDetails));
      return userDetails;
    }
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
      state.initialized = true;
    });
    builder.addCase(getClaims.fulfilled, (state, action) => {
      if (!action.payload) {
        state.csrf = '';
      }
      state.initialized = true;
    });
    builder.addCase(getClaims.rejected, (state) => {
      state.csrf = '';
      state.initialized = true;
    });
  },
});

export default authSlice.reducer;
