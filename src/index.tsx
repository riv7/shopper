import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from './app/store'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import firebase from 'firebase/app'
import SignInScreen from './features/auth/SignIn';
// import * as firebaseui from 'firebaseui' 
//import "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBzwoKs5sVWtAV_Br8XIZU3U4tbIHhUAuc",
//   authDomain: "shopper-backend-c590c.firebaseapp.com",
//   databaseURL: "https://shopper-backend-c590c-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "shopper-backend-c590c",
//   storageBucket: "shopper-backend-c590c.appspot.com",
//   messagingSenderId: "172446679872",
//   appId: "1:172446679872:web:8bec7969c429f01e94f0a5"
// };

// firebase.initializeApp(firebaseConfig);

// Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', {
//   signInOptions: [
//     // List of OAuth providers supported.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID
//   ],
//   // Other config options...
// });




// var uiConfig = {
//   signInSuccessUrl: 'locahost:4400',
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
//   ],
//   // tosUrl and privacyPolicyUrl accept either url string or a callback
//   // function.
//   // Terms of service url/callback.
//   tosUrl: 'locahost:5500',
//   // Privacy policy url/callback.
//   privacyPolicyUrl: function() {
//     window.location.assign('<your-privacy-policy-url>');
//   }
// };

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.

// ui.start('#firebaseui-auth-container', uiConfig);


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SignInScreen />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
