import React, { useState } from "react";
import "./css/App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
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
            <p>Olá! Somos a VOLUN Uma empresa que visa lhe oferecer 
              eventos de voluntários para que você, possa participar!
              Tanto como voluntário, como organizador de evento!  
            </p>
          </div>
        </section>  
        <article>
            
        </article>
      </div>
      <Footer />
    </>
  );
}

export default App;
