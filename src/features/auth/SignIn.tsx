// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithRedirect, signInWithPopup, signOut } from "firebase/auth";
import { useAppDispatch } from '../../app/store';
import App from '../../App';
import { activeTeam, activeTeamLoaded, fetchActiveTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDsqYogZ16MJVxqCU_9j_ZEPaH5VUWIPG0",
    authDomain: "shopper-936b3.firebaseapp.com",
    databaseURL: "https://shopper-936b3-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "shopper-936b3",
    storageBucket: "shopper-936b3.firebasestorage.app",
    messagingSenderId: "434908859123",
    appId: "1:434908859123:web:033d7f9b87a88f52fc8586"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

  function SignInScreen() {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const dispatch = useAppDispatch();
    const actTeam: Team | undefined = useSelector(activeTeam);
    const teamLoaded: boolean = useSelector(activeTeamLoaded)
    const history = useHistory();
  
    useEffect(() => {

      const unsubscribe = onAuthStateChanged(auth, user => {
        setIsSignedIn(!!user);
      });

      const fetchAndInit = async() => {
        if (!teamLoaded && isSignedIn) {
          await dispatch(fetchActiveTeam());
        }
      };
      fetchAndInit();
      
      return () => unsubscribe(); // Make sure we un-register Firebase observers when the component unmounts.
    }, [dispatch, teamLoaded, isSignedIn]);

      const handleGoogleSignIn = async () => {
          const response = await signInWithPopup(auth, provider);
          console.log(response);
      };

      const handleSignOut = () => {
          signOut(auth)
              .then(() => {
                  setIsSignedIn(false);
              })
              .catch((error) => {
                  console.error('Error signing out:', error);
              });
      };
  

    // Show login screen
    if (!isSignedIn) {
      return (
          <div>
              <h1>My App</h1>
              <p>Please sign-in:</p>
              <button onClick={handleGoogleSignIn}>Sign in with Google</button>
              {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>*/}
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