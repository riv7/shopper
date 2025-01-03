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
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui'

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
const emailProvider = new EmailAuthProvider();

function LoginPage() {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const dispatch = useAppDispatch();
    const actTeam: Team | undefined = useSelector(activeTeam);
    const teamLoaded: boolean = useSelector(activeTeamLoaded)
    const history = useHistory();

    useEffect(() => {

        if (!isSignedIn) {

            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

            const uiConfig = {
                // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
                signInFlow: 'popup',
                // signInSuccessUrl: '<url-to-redirect-to-on-success>',
                signInOptions: [
                    // Leave the lines as is for the providers you want to offer your users.
                    GoogleAuthProvider.PROVIDER_ID,
                    EmailAuthProvider.PROVIDER_ID
                ],
                // Terms of service url.
                // tosUrl: '<your-tos-url>',
                // // Privacy policy url.
                // privacyPolicyUrl: '<your-privacy-policy-url>'
            };

            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
        }


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
            <>
                <h1 className="text-center my-3 title">Login Page</h1>
                <div id="firebaseui-auth-container"></div>
                <div id="loader" className="text-center">Loading form</div>
            </>

            //
            // <div>
            //     <h1>My App</h1>
            //     <p>Please sign-in:</p>
            //     <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            //     {/*<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>*/}
            // </div>
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
};

export default LoginPage;