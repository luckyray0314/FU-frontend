import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchAPI } from '../../api/fetch-api';
import { getStorageValue, setStorageValue } from '../../util/localStorage.util';
import { AsyncThunkConfig } from '../store';
import { UpdateTranslationProps } from '../../model/translation.model';
import i18next from 'i18next';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

interface TranslationSlice {
  language: string;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState = {
  language: cookies?.get('language') || 'sv',
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
} as TranslationSlice;

export const updateTranslation = createAsyncThunk<
  any,
  UpdateTranslationProps,
  AsyncThunkConfig
>('translation/update', async ({ language }, thunkAPI) => {
  try {
    i18next.changeLanguage(language, (err, t) => {
      if (err) {
        return thunkAPI.rejectWithValue(err);
      }
    });
    cookies.set('language', language || 'sv');
    return { language };
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response.data);
  }
});

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTranslation.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.language = payload?.language;
      })
      .addCase(updateTranslation.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updateTranslation.rejected, (state, { error }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = error.message || '';
      });
  },
});

export const { clearState } = translationSlice.actions;

export default translationSlice.reducer;
