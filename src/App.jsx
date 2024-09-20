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
            <p>
              Olá! Somos a VOLUN Uma empresa que visa lhe oferecer 
              eventos de voluntários para que você, possa participar!
              Tanto como voluntário, como organizador de evento!  
            </p>
          </div>
        </section>  
        <article className="app-articles-container">
          <div className="article-number-one">
            <img src="https://i.pinimg.com/474x/b6/11/18/b611184e6e47ecfeff928ac382b5dd37.jpg"/>
            <p>
            Alguma coisa alguma coisaaaaaaaaaaaaaa alguma coisa
            </p>
          </div>
          <div className="article-number-two">
            <img src="https://i.pinimg.com/474x/b6/11/18/b611184e6e47ecfeff928ac382b5dd37.jpg"/>
            <p>
            TecdEa consequatur repellendus nam voluptatem earum id sapiente voluptate eos impedit sunt vel dolores sunt.
            Sit veritatis laboriosam ex natus laboriosam..
            </p>       
          </div>
           
        </article>
        <div className="app-destaque-container">
          <h1>Em destaque</h1>
          <h2>Eventos e causas esperando por você</h2>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default App;
