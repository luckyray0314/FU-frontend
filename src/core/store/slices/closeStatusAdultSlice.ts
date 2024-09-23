import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { EstimatesDto } from "../../model/estimates.model";
import { getCloseStatusAdult } from "../../model/closeStatusAdult.model";

interface CloseStatusAdultSlice {
  closeStatusAdultList: Array<getCloseStatusAdult>;
}

const initialState = {
  closeStatusAdultList: []
} as CloseStatusAdultSlice;

export const closeStatusAdultListData = createAsyncThunk(
  "closeStatusAdult/closeStatusAdultListData",
  async (_, thunkAPI) => {
    try {
      const { data } = await fetchAPI({
        url: `/close-status-adult/getAll`,
        method: "GET"
      });
      const rows = (data as Array<getCloseStatusAdult>)

      return rows;
    }
    catch (e) {
      console.log(e);
      thunkAPI.rejectWithValue(e);
    }
  }
);

const closeStatusAdultListSlice = createSlice({
  name: "closeStatusAdultList",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(closeStatusAdultListData.fulfilled, (state, { payload }) => {
        if (payload) state.closeStatusAdultList = payload;
      });
  }
});

export default closeStatusAdultListSlice.reducer;

