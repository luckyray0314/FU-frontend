import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { fetchAPI } from '../../api/fetch-api';
import {
  FollowUpSurveyBasicData,
  FollowUpSurveyFormMetadata,
} from '../../model/followUpData.model';

interface FollowUpSurveySlice {
  loadingFollowUpSurveyBasicData: boolean;
  followUpSurveyBasicData: FollowUpSurveyBasicData;
  followUpSurveyFormMetadata: FollowUpSurveyFormMetadata;
}

const initialState = {
  loadingFollowUpSurveyBasicData: false,
} as FollowUpSurveySlice;

export const loadFollowUpSuveyBasicData = createAsyncThunk(
  'followUpSurvey/loadFollowUpSuveyBasicData',
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: '/follow-up-data/basicData',
        method: 'GET',
      });
      if (response?.status === 200) {
        return data as FollowUpSurveyBasicData;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const followUpSurveySlice = createSlice({
  name: 'followUpSurvey',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFollowUpSuveyBasicData.pending, (state) => {
        state.loadingFollowUpSurveyBasicData = true;
      })
      .addCase(loadFollowUpSuveyBasicData.fulfilled, (state, { payload }) => {
        state.followUpSurveyBasicData = payload;
        state.followUpSurveyFormMetadata = [
          {
            label: t('Label.InterventionPeriod'),
            entityName: 'interventionPeriod',
            entitiesData: payload.interventionPeriodEntities,
          },
          {
            label: t('Label.TimeConsumption'),
            entityName: 'timeConsumption',
            entitiesData: payload.timeConsumptionEntities,
          },
          {
            label: t('Label.ReasonForTermination'),
            entityName: 'reasonForTermination',
            entitiesData: payload.reasonForTerminationEntities,
          },
          {
            label: t('Label.InterventionProgress'),
            entityName: 'interventionProgress',
            entitiesData: payload.interventionProgressEntities,
          },
        ];
        state.loadingFollowUpSurveyBasicData = false;
      })
      .addCase(loadFollowUpSuveyBasicData.rejected, (state) => {
        state.loadingFollowUpSurveyBasicData = false;
      });
  },
});

// export const {  } = followUpSurveySlice.actions;

export default followUpSurveySlice.reducer;
