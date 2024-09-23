import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { BackgroundAdultSurveyBasicData, BackgroundAdultSurveyFormMetadata } from "../../model/backgroundAdultData.model";
import { AdultEstimatesDto } from "../../model/adultEstimates.model";

interface BackgroundAdultSurveySlice {
  loadingBackgroundAdultSurveyBasicData: boolean;
  backgroundAdultSurveyBasicData: BackgroundAdultSurveyBasicData;
  backgroundAdultSurveyFormMetadata: BackgroundAdultSurveyFormMetadata;
  currentEstimatesAdult: AdultEstimatesDto;
}

const initialState = {
  loadingBackgroundAdultSurveyBasicData: false,
} as BackgroundAdultSurveySlice;

export const loadBackgroundAdultSuveyBasicData = createAsyncThunk(
  "backgroundAdultSurvey/loadBackgroundAdultSuveyBasicData",
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/background-adult-data/basicData",
        method: "GET"
      });
      if (response?.status === 200) {
        return data as BackgroundAdultSurveyBasicData;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const backgroundAdultSurveySlice = createSlice({
  name: "backgroundAdultSurvey",
  initialState,
  reducers: {
    setCurrentEstimatesAction(state, action: PayloadAction<AdultEstimatesDto>) {
      state.currentEstimatesAdult = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBackgroundAdultSuveyBasicData.pending, (state) => {
        state.loadingBackgroundAdultSurveyBasicData = true;
      })
      .addCase(loadBackgroundAdultSuveyBasicData.fulfilled, (state, { payload }) => {
        state.backgroundAdultSurveyBasicData = payload;
        state.backgroundAdultSurveyFormMetadata = [
          {
            label: "Label.GenderAdult",
            entityName: "genderAdult",
            entitiesData: payload.genderAdultEntities
          },
          {
            label: "Label.ActionAssignment",
            entityName: "actionAssignment",
            entitiesData: payload.actionAssignmentEntities
          },
          {
            label: "Label.DuringOperation",
            entityName: "duringOperation",
            entitiesData: payload.duringOperationEntities
          },
          {
            label: "Label.EducationLevel",
            entityName: "educationLevel",
            entitiesData: payload.educationLevelEntities
          },
          {
            label: "Label.Employment",
            entityName: "employment",
            entitiesData: payload.employmentEntities
          },
          {
            label: "Label.EstablishDiagnos",
            entityName: "establishDiagnose",
            entitiesData: payload.establishDiagnoseEntities
          },
          {
            label: "Label.FamilyConstellationAdult",
            entityName: "familyConstellationAdult",
            entitiesData: payload.familyConstellationAdultEntities
          },
          {
            label: "Label.OtherOngoingEffort",
            entityName: "otherOngoingEffort",
            entitiesData: payload.otherOngoingEffortEntities
          },
          {
            label: "Label.PreviousEffort",
            entityName: "previousEffort",
            entitiesData: payload.previousEffortEntities
          },
          {
            label: "Label.ProblemAreaAdult",
            entityName: "problemAreaAdult",
            entitiesData: payload.problemAreaAdultEntities
          },
        ];
        state.loadingBackgroundAdultSurveyBasicData = false;
      })
      .addCase(loadBackgroundAdultSuveyBasicData.rejected, (state) => {
        state.loadingBackgroundAdultSurveyBasicData = false;
      });
  }
});

export const { setCurrentEstimatesAction } = backgroundAdultSurveySlice.actions;

export default backgroundAdultSurveySlice.reducer;
