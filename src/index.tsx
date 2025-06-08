import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import store from './app/store'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import SignInScreen from './features/auth/SignIn';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LoginPage from "./features/auth/LoginPage";

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SignInScreen />
          {/*<LoginPage />*/}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
