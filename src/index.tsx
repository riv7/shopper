import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './app/store'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBzwoKs5sVWtAV_Br8XIZU3U4tbIHhUAuc",
  authDomain: "shopper-backend-c590c.firebaseapp.com",
  databaseURL: "https://shopper-backend-c590c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopper-backend-c590c",
  storageBucket: "shopper-backend-c590c.appspot.com",
  messagingSenderId: "172446679872",
  appId: "1:172446679872:web:8bec7969c429f01e94f0a5"
};

firebase.initializeApp(firebaseConfig);

firebase.database();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
