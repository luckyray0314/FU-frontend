import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { ImportantEventsBasicData, ImportantEventsFormMetadata } from "../../model/importantEvents.model";

interface ImportantEventsSlice {
  loadingImportantEventsBasicData: boolean;
  importantEventsBasicData: ImportantEventsBasicData;

  importantEventsFormMetadata: ImportantEventsFormMetadata;
}

const initialState = {
  loadingImportantEventsBasicData: false,
} as ImportantEventsSlice;

export const loadImportantEventsBasicData = createAsyncThunk(
  "importantEvents/loadImportantEventsBasicData",
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/important-events/basicData",
        method: "GET"
      });
      if (response?.status === 200) {
        return data as ImportantEventsBasicData;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const importantEventsSlice = createSlice({
  name: "importantEvents",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadImportantEventsBasicData.pending, (state) => {
        state.loadingImportantEventsBasicData = true;
      })
      .addCase(loadImportantEventsBasicData.fulfilled, (state, { payload }) => {
        state.importantEventsBasicData = payload;
        state.importantEventsFormMetadata = [
          {
            label: "Label.OtherInterventionsStarted",
            entityName: "otherInterventionsStarted",
            entitiesData: payload.otherInterventionsStartedEntities
          },
          {
            label: "Label.DuringIntervention",
            entityName: "duringIntervention",
            entitiesData: payload.duringInterventionEntities
          },
          {
            label: "Label.DuringPast",
            entityName: "duringPast",
            entitiesData: payload.duringPastEntities
          },
          {
            label: "Label.ChildSchool",
            entityName: "childSchool",
            entitiesData: payload.childSchoolEntities
          },
          {
            label: "Label.ChangeAccomodation",
            entityName: "changeAccomodation",
            entitiesData: payload.changeAccomodationEntities
          },
          {
            label: "Label.ChangeEmploymentVh1",
            entityName: "changeEmploymentVh1",
            entitiesData: payload.changeEmploymentVh1Entities
          },
          {
            label: "Label.ChangeEmploymentVh2",
            entityName: "changeEmploymentVh2",
            entitiesData: payload.changeEmploymentVh2Entities
          },
        ]
        state.loadingImportantEventsBasicData = false;
      })
      .addCase(loadImportantEventsBasicData.rejected, (state) => {
        state.loadingImportantEventsBasicData = false;
      });
  }
});

export const { } = importantEventsSlice.actions;

export default importantEventsSlice.reducer;
