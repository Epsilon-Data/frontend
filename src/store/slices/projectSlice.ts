import { getProjectDetails } from '@app/api/databaseSources.api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectDetails {
  projectId: string;
  customId: string;
  cover: string;
  visualisations: {
    title: string;
    url: string;
  }[];
}

interface ProjectState {
  details: ProjectDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  details: null,
  loading: false,
  error: null,
};

export const fetchProjectDetails = createAsyncThunk('project/fetchProjectDetails', async (projectId: string) => {
  const response = await getProjectDetails(projectId);

  const data: ProjectDetails = response;
  return data;
});

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectDetails(state) {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action: PayloadAction<ProjectDetails>) => {
        state.details = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { clearProjectDetails } = projectSlice.actions;
export default projectSlice.reducer;
