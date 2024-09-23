import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { EstimatesDto } from "../../model/estimates.model";
import { getCloseStatus } from "../../model/closeStatus.model";

interface CloseStatusSlice {
  closeStatusList: Array<getCloseStatus>;
}

const initialState = {
  closeStatusList: []
} as CloseStatusSlice;

export const closeStatusListData = createAsyncThunk(
  "closeStatus/closeStatusListData",
  async (_, thunkAPI) => {
    try {
      const { data } = await fetchAPI({
        url: `/close-status/getAll`,
        method: "GET"
      });
      const rows = (data as Array<getCloseStatus>)

      return rows;
    }
    catch (e) {
      console.log(e);
      thunkAPI.rejectWithValue(e);
    }
  }
);

const closeStatusListSlice = createSlice({
  name: "closeStatusList",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(closeStatusListData.fulfilled, (state, { payload }) => {
        if (payload) state.closeStatusList = payload;
      });
  }
});

export default closeStatusListSlice.reducer;

