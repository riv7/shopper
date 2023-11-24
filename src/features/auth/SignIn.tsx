// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { useAppDispatch } from '../../app/store';
import App from '../../App';
import { activeTeam, activeTeamLoaded, fetchActiveTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

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

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };
  
  function SignInScreen() {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const dispatch = useAppDispatch();
    const actTeam: Team | undefined = useSelector(activeTeam);
    const teamLoaded: boolean = useSelector(activeTeamLoaded)
    const history = useHistory();
  
    useEffect(() => {
      
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
        setIsSignedIn(!!user);
      });

      const fetchAndInit = async() => {
        if (!teamLoaded && isSignedIn) {
          await dispatch(fetchActiveTeam());
        }
      };
      fetchAndInit();
      
      return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, [dispatch, teamLoaded, isSignedIn]);
  

    // Show login screen
    if (!isSignedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    }

    // Show create or select team screen
    if (teamLoaded && actTeam === undefined) {
      // history.push('team')
      
      return (
        <App/>
      );
    }

    // Show home screen
    return (
        <App/>
    );
  }
  
  export default SignInScreen;