import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { BackgroundSurveyBasicData, BackgroundSurveyFormMetadata } from "../../model/backgroundData.model";
import { EstimatesDto } from "../../model/estimates.model";

interface BackgroundSurveySlice {
  loadingBackgroundSurveyBasicData: boolean;
  backgroundSurveyBasicData: BackgroundSurveyBasicData;

  backgroundSurveyFormMetadata: BackgroundSurveyFormMetadata;

  currentEstimates: EstimatesDto;
}

const initialState = {
  loadingBackgroundSurveyBasicData: false,
} as BackgroundSurveySlice;

export const loadBackgroundSuveyBasicData = createAsyncThunk(
  "backgroundSurvey/loadBackgroundSuveyBasicData",
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/background-data/basicData",
        method: "GET"
      });
      if (response?.status === 200) {
        return data as BackgroundSurveyBasicData;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const backgroundSurveySlice = createSlice({
  name: "backgroundSurvey",
  initialState,
  reducers: {
    setCurrentEstimatesAction(state, action: PayloadAction<EstimatesDto>) {
      state.currentEstimates = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBackgroundSuveyBasicData.pending, (state) => {
        state.loadingBackgroundSurveyBasicData = true;
      })
      .addCase(loadBackgroundSuveyBasicData.fulfilled, (state, { payload }) => {
        state.backgroundSurveyBasicData = payload;
        state.backgroundSurveyFormMetadata = [
          {
            label: 'Label.LegalGender',
            entityName: 'gender',
            entitiesData: payload.genderEntities,
          },
          {
            label: 'Label.ReasonForUpdate',
            entityName: 'reasonForUpdate',
            entitiesData: payload.reasonForUpdateEntities,
          },
          {
            label: 'Label.ProblemArea',
            entityName: 'problemArea',
            entitiesData: payload.problemAreaEntities,
          },
          {
            label: 'Label.PreviousIntervention',
            entityName: 'previousIntervention',
            entitiesData: payload.previousInterventionEntities,
          },
          {
            label: 'Label.OtherInterventions',
            entityName: 'otherInterventions',
            entitiesData: payload.otherInterventionsEntities,
          },
          {
            label: 'Label.FamilyConstellation',
            entityName: 'familyConstellation',
            entitiesData: payload.familyConstellationEntities,
          },
          {
            label: 'Label.WhoParticipates',
            entityName: 'whoParticipates',
            entitiesData: payload.whoParticipatesEntities,
          },
          {
            label: 'Label.EducationVh1',
            entityName: 'educationVh1',
            entitiesData: payload.educationVh1Entities,
          },
          {
            label: 'Label.EducationVh2',
            entityName: 'educationVh2',
            entitiesData: payload.educationVh2Entities,
          },
          {
            label: 'Label.EmploymentVh1',
            entityName: 'employmentVh1',
            entitiesData: payload.employmentVh1Entities,
          },
          {
            label: 'Label.EmploymentVh2',
            entityName: 'employmentVh2',
            entitiesData: payload.employmentVh2Entities,
          },
          {
            label: 'Label.InterpreterRequired',
            entityName: 'interpreterRequired',
            entitiesData: payload.interpreterRequiredEntities,
          },
          {
            label: 'Label.TypeOfEffort',
            entityName: 'typeOfEffort',
            entitiesData: payload.typeOfEffortEntities,
          },
          {
            label: 'Label.EstablishedDiagnoses',
            entityName: 'establishedDiagnoses',
            entitiesData: payload.establishedDiagnosesEntities,
          },
          {
            label: 'Label.SchoolForm',
            entityName: 'schoolUniform',
            entitiesData: payload.schoolUniformEntities,
          },
          {
            label: 'Label.Participants',
            entityName: 'participants',
            entitiesData: payload.participantsEntities,
          },
        ];
        state.loadingBackgroundSurveyBasicData = false;
      })
      .addCase(loadBackgroundSuveyBasicData.rejected, (state) => {
        state.loadingBackgroundSurveyBasicData = false;
      });
  }
});

export const { setCurrentEstimatesAction } = backgroundSurveySlice.actions;

export default backgroundSurveySlice.reducer;
