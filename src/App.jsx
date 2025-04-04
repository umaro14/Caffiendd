import CoffeeForm from "./componentes/CoffeForm";
import Hero from "./componentes/Hero";
import Layout from "./componentes/Layout";
import Stats from "./componentes/Stats";
import History from "./componentes/History";
import { auth } from "../firebase";
import { useAuth } from "./context/AuthContext";


function App() {
  const { globalUser, globalData, isLoading } = useAuth();
  const isAuthenticated = globalUser;      //if there is a globalUser then we are authenticated, otherwise we rae not authenticated
 
  
  //there is only data to display if we have global data(has to exixt) and the length of the entries is greater than ZERO.
  const isData = globalData && !!Object.keys(globalData || {}).length;
 


  //info for signed up user only
  const authenticatedContent = (
    <>
     <Stats />
     <History />
    </>
  )

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {(isAuthenticated && isLoading) && (
          <p>Loading data...</p>
      )}
      {(isAuthenticated && isData) && (authenticatedContent)} {/*IF WE ARE AUTHENTICATED AND HAVE DATA THEN SHOW authenticatedContent */}
    </Layout>
  )
}

export default App
