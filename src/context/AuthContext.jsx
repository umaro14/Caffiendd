//THE AUTH CONTEXT WRAPS OUR ENTIRE APPLICATIONS AND WORKS AS A GLOBAL STATE
//IT PROVIDES A WAY TO SHARE DATA BETWEEN DIFFERENT PARTS OF THE APPLICATION
//ALL STATES DEFINED HERE CAN BE ACCESS SUPER EASY ENYWHERE ON THE OUR APPLICATION IT DOES NOT MATTER THE HIERARCHY

//In React, createContext is used to create a Context API, 
//which allows state and functions to be shared across multiple components
//without needing to pass props manually at every level (prop drilling).

import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

//creates a custom hook, from where we can destructure any of these values
export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props){
    const { children } = props;
    const [ globalUser, setGlobalUser ] = useState();
    const [ globalData, setGlobalData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);


    //SIGN UP FUNCTION
    function signUp(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email);
    }

    //LOG IN FUNCTION
    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    //logout function
    function logOut(){
        setGlobalUser(null);            //no user after log out
        setGlobalData(null);     //we should not keep the user data if they log out
        return signOut(auth);
    }


    //anything here becames a part of our global state
    const value = { globalUser, globalData, setGlobalData, isLoading, signUp, logIn, logOut };


    //this onAuthStateChanged() function is from firebase...
    //it is a callback function that is triggered whenever the user's authentication state changes
    //it listens when a user signs in, sign up or register
    //when the user logs in for the first time it will give all user's info not all the data necessarily
    // but all the info like user id then fetch all the data
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("CURRENT USER: ", user);
        setGlobalUser(user);
        //if there is no user, then empty all the state and return from this auth listner
        if(!globalUser){ 
            console.log('No active user')
            return }

        //if there is a user, then check if the user has data in the database, and if they do then fetch data 
        //and updta the global state
        try {
            setIsLoading(true);

            // first we create a reference for the document(labled jsonobject)
            //then we get the doc, then we snapshot it to see if there is anything there
            const docRef = doc(db, 'users', user.uid);  //this doc() function is from firebase/firestore
            const docSnap = await getDoc(docRef);

            // if we don't get any info back then we will use an empty object as our data instead
            let firebaseData = {};
            if(docSnap.exists()){
                firebaseData = docSnap.data()       //get all the data and asign it to our variable
                console.log('Found user data', firebaseData);
            }
            setGlobalData(firebaseData); 
        } 
        catch (err) {
            console.log(err.message);
        } 
        finally {
            setIsLoading(false);
        }
      }) 
      return unSubscribe;                                      //this is known as clean up, make sure we dont uve any data leacage
    },[]);


    return(
       <AuthContext.Provider value={value}>
         {children}
       </AuthContext.Provider>
    )
}
