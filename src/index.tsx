import { CssBaseline } from '@mui/material';
import { svSE as coreSvSE } from '@mui/material/locale';
import { svSE as xPickerSvSE } from '@mui/x-date-pickers/locales';
import { svSE as dataGridSvSE } from '@mui/x-data-grid';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import * as React from 'react';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './core/store/store';
import { getStorageValue } from './core/util/localStorage.util';
import './i18n';
import './index.css';
import 'dayjs/locale/ru';
import reportWebVitals from './reportWebVitals';

const token = getStorageValue('token');
axios.defaults.headers.common['Authorization'] = token;
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

// All `Portal`-related components need to have the the main app wrapper element as a container
// so that the are in the subtree under the element used in the `important` option of the Tailwind's config.
const theme = createTheme(
  {
    palette: {
      text: {
        primary: '#334957',
        secondary: '#888888',
      },
      success: {
        main: '#016A54',
      },
      info: {
        main: '#00658F',
      },
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
    typography: {
      h3: {
        color: '#006D56',
        fontWeight: 'bold',
      },
    },
  },
  coreSvSE,
  xPickerSvSE,
  dataGridSvSE
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <LocalizationProvider
              adapterLocale={'sv'}
              dateAdapter={AdapterDayjs}
              localeText={
                xPickerSvSE.components.MuiLocalizationProvider.defaultProps
                  .localeText
              }
            >
              <CssBaseline />
              <Suspense fallback='Loading...'>
                <App />
              </Suspense>
              <Toaster position='top-right' />
            </LocalizationProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
