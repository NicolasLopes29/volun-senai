import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./App.css";
import Modal from "react-modal";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const [ModalAberta, setModalAberta] = useState(false);

  const navigate = useNavigate();

  const registraLink = () => {
    navigate ("/registrar")
  };

  return (
    <>
      <Navbar/>
      <div className="app-container">  
        <section className="app-section-container">
          <div className="app-section-left">
            <h3>VOLUN</h3>
            <p>A sua plataforma de Voluntariado</p>
          </div>
          <div className="app-section-right">
            <button type="button" onClick={registraLink}>Registrar</button>
            <button type="button" onClick={() => setModalAberta(true)}>Entrar</button>
          </div>
        </section>  
        <article>
            
        </article>
      </div>
      <Footer />
      <Modal
        isOpen = {ModalAberta}
        onRequestClose={() => setModalAberta(false)}
        style={{
          overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Fundo escuro com opacidade
          },
          content: {
            inset: 'auto',
            position: 'relative',
            top: 50,
            borderRadius: 32,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }
        }}
      >
        <Login onClose = {() => setModalAberta(false)}></Login>
      </Modal>
    </>
  );
}

export default App;