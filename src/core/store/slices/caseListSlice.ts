import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAPI } from '../../api/fetch-api';
import { EstimatesDto } from '../../model/estimates.model';

interface CaseListSlice {
  caseList: Array<{ id: number } & EstimatesDto>;
}

const initialState = {
  caseList: [],
} as CaseListSlice;

const getThreeNumber = (number: string) => {
  if (number.length == 1) {
    return '00' + number;
  } else if (number.length == 2) {
    return '0' + number;
  }
  return number;
};

export const loadCaseListData = createAsyncThunk(
  'caseList/loadCaseListData',
  async (_, thunkAPI) => {
    try {
      const { data } = await fetchAPI({
        url: `/background-data/getCaseList`,
        method: 'GET',
      });
      const rows = (data as Array<EstimatesDto>)?.map((d, idx) => {
        const codeNumberForSort =
          d.codeNumber.slice(3, 7) + getThreeNumber(d.codeNumber.split('-')[1]);
        return {
          ...d,
          codeNumberForSort: Number(codeNumberForSort),
          id: idx + 1,
        };
      });
      const sorted = rows.sort(
        (a, b) => a.codeNumberForSort - b.codeNumberForSort
      );
      console.log('sorted', sorted);
      return sorted;
    } catch (e) {
      console.log(e);
      thunkAPI.rejectWithValue(e);
    }
  }
);

const caseListSlice = createSlice({
  name: 'caseList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCaseListData.fulfilled, (state, { payload }) => {
      if (payload) state.caseList = payload;
    });
  },
});

export default caseListSlice.reducer;
