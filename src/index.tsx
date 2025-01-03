import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './app/store'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import SignInScreen from './features/auth/SignIn';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import LoginPage from "./features/auth/LoginPage";

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

ReactDOM.render(
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
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
