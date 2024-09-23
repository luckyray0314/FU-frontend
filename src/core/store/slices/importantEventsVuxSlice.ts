import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAPI } from "../../api/fetch-api";
import { ImportantEventsVuxBasicData, ImportantEventsVuxFormMetadata } from "../../model/importantEventsVux.model";

interface ImportantEventsVuxSlice {
  loadingImportantEventsVuxBasicData: boolean;
  importantEventsVuxBasicData: ImportantEventsVuxBasicData;

  importantEventsVuxFormMetadata: ImportantEventsVuxFormMetadata;
}

const initialState = {
  loadingImportantEventsVuxBasicData: false,
} as ImportantEventsVuxSlice;

export const loadImportantEventsVuxBasicData = createAsyncThunk(
  "importantEventsVux/loadImportantEventsVuxBasicData",
  async (_, thunkAPI) => {
    try {
      const { response, data } = await fetchAPI({
        url: "/important-events-vux/basicData",
        method: "GET"
      });
      if (response?.status === 200) {
        return data as ImportantEventsVuxBasicData;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const importantEventsVuxSlice = createSlice({
  name: "importantEventsVux",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadImportantEventsVuxBasicData.pending, (state) => {
        state.loadingImportantEventsVuxBasicData = true;
      })
      .addCase(loadImportantEventsVuxBasicData.fulfilled, (state, { payload }) => {
        state.importantEventsVuxBasicData = payload;
        state.importantEventsVuxFormMetadata = [
          {
            label: "Label.ChangeLive",
            entityName: "changeLive",
            entitiesData: payload.changeLiveEntities
          },
          {
            label: "Label.ChangeOver",
            entityName: "changeOver",
            entitiesData: payload.changeOverEntities
          },
          {
            label: "Label.InvestigationOut",
            entityName: "investigationOut",
            entitiesData: payload.investigationOutEntities
          },
          {
            label: "Label.OtherInitiative",
            entityName: "otherInitiative",
            entitiesData: payload.otherInitiativeEntities
          },
        ]
        state.loadingImportantEventsVuxBasicData = false;
      })
      .addCase(loadImportantEventsVuxBasicData.rejected, (state) => {
        state.loadingImportantEventsVuxBasicData = false;
      });
  }
});

export const { } = importantEventsVuxSlice.actions;

export default importantEventsVuxSlice.reducer;
