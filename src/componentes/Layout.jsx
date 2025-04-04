import { useAuth } from "../context/AuthContext";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useState } from "react";

export default function Layout(props){
    const {children} = props;

    const { globalUser, logOut } = useAuth();

    const [showModal, setShowModal] = useState(false);

    const header = (
        <header>
            <div>
              <h1 className="text-gradient">CAFFIEND</h1>
              <p>For coffee Insatiates</p>
            </div>
            {globalUser ? (
              <button onClick={logOut}>
                <p>Logout</p>
              </button>
          ) : (
            <button onClick={() => {setShowModal(true)}}>
              <p>Sign up Free</p>
              <i className="fa-solid fa-mug-hot"></i>
            </button>
          )}
        </header>
    )

    const footer = (
        <footer>
           <p><span className="text-gradient">Caffiend</span> was made by <a href="https://github.com/Umaro14" target="_blanck">BAldeAj</a><br/>check out the project <a href="https://github.com/umaro14/REAC-WITH-JAMES" target="blanck">GitHub</a> using the
           <a href="https://www.fantacss.smoljames.com" target="_blanck"> FantaCSS</a> design library.</p>
        </footer>
    )

    function handleCloseModal(){
      setShowModal(false)
    };

    return (
        <>
           {showModal &&(
            <Modal handleCloseModal={handleCloseModal}>
              <Authentication handleCloseModal={handleCloseModal} />
            </Modal>
           )}
           {header}
           <main>
            {children}
           </main>
           {footer}
        </>
    )
}