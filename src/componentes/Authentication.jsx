
import { useState } from "react"
import { useAuth } from "../context/AuthContext";
export default function Authentication(props){
    const { handleCloseModal } =props;
    const [isRegistration, setIsRegistration] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);
    

    //this gives us access to whatever was contain within the value which is a global state(logIn and signUp actions);
    const { logIn, signUp } = useAuth();

    async function handleAuthenticate() {
        if(!email || !email.includes("@") || !password || password.length < 6 || isAuthenticating){ return } //if we authenticating we dont wanna duplicate it and make it messy

        try {
          setIsAuthenticating(true);
          setError(null);

          if(isRegistration){
            // Register here
            await signUp(email, password);
          } 
          else{
            // Log in a user
            await logIn(email, password);
          }
          handleCloseModal(); //closes the modal after successful authentication
        } 
        catch (err) {
          console.log(err.message);
          setError(err.message);
        }
        finally{
          setIsAuthenticating(false);
        }
    }

    return(
        <>
         <h2 className="sign-up-text">{isRegistration ? 'Sign Up' : 'Login'}</h2>
         <p>{isRegistration ? 'Create an account' : 'Sign in to your account!'}</p>
         {error &&(
            <p>❌ {error}</p>
         )}
         <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
         <input placeholder="*******" type="password"  value={password} onChange={(e) => {setPassword(e.target.value)}} />
         <button onClick={handleAuthenticate}><p>{isAuthenticating ? "Authenticating..." : "Submit"}</p></button>
         <hr />
         <div className="register-content">
           <p>{isRegistration? 'Already have an account?' : 'Don\'t have an account?'}</p>
           <button onClick={() => {setIsRegistration(!isRegistration)}}><p>{isRegistration ? 'Sign in' : 'Sign up'}</p></button>
         </div>
        </>
    )
}