import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAPI } from '../../api/fetch-api';
import { AdultEstimatesDto } from '../../model/adultEstimates.model';
import { t } from 'i18next';

interface CaseListAdultSlice {
  caseList: Array<{ id: number } & AdultEstimatesDto>;
}

const initialState = {
  caseList: [],
} as CaseListAdultSlice;

const getThreeNumber = (number: string) => {
  if (number.length == 1) {
    return '00' + number;
  } else if (number.length == 2) {
    return '0' + number;
  }
  return number;
};

export const loadCaseListAdultData = createAsyncThunk(
  'caseListAdult/loadCaseListAdultData',
  async (_, thunkAPI) => {
    try {
      const { data } = await fetchAPI({
        url: `/background-adult-data/getCaseList`,
        method: 'GET',
      });
      const rows = (data as Array<AdultEstimatesDto>)?.map((d, idx) => {
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

      return sorted;
    } catch (e) {
      console.log(e);
      thunkAPI.rejectWithValue(e);
    }
  }
);

const caseListAdultSlice = createSlice({
  name: 'caseListAdult',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCaseListAdultData.fulfilled, (state, { payload }) => {
      if (payload) state.caseList = payload;
    });
  },
});

export default caseListAdultSlice.reducer;
