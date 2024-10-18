import React, { useState, useRef } from "react";
import "./css/App.css"; // Ensure this path is correct

import SimpleSlider from "./components/SimpleSlider"; // Import the SimpleSlider component

const Card_Slider = () => {
  const containerRef = useRef();

  const handlescrollLeft = () => {
    containerRef.current.scrollLeft -= 500;
  };

  const handlescrollRight = () => {
    containerRef.current.scrollLeft += 500;
  };

  return (
    <section className="card-slider-container">
      <div className="main-slider-container">
        <button className="slider-icon left" onClick={handlescrollLeft}>
          left
        </button>
        <div className="slider" ref={containerRef}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
            return (
              <div key={item} className="slider-card">
                {/* You can use the item value here if needed */}
              </div>
            );
          })}
        </div>
        <button className="slider-icon right" onClick={handlescrollRight}>
          right
        </button>
      </div>
    </section>
  );
};

const App = () =>  {
  return (
    <>
      
      <div className="app-container">
        <section className="app-section-container">
          <div className="app-section-left">
            <h3>VOLUN</h3>
            <p>A sua plataforma de Voluntariado</p>
          </div>
          <div className="app-section-right">
            <p>
              Olá! Somos a VOLUN Uma empresa que visa lhe oferecer eventos de
              voluntários para que você, possa participar! Tanto como
              voluntário, como organizador de evento!
            </p>
          </div>
        </section>
        <div className="app-articles-container">
          <div className="article-number-one">
            <img src="https://www.infomoney.com.br/wp-content/uploads/2024/09/TVCultura1.png?fit=1280%2C624&quality=50&strip=all" alt="Article 1" />
            <p>Alguma</p>
          </div>
          <div className="article-number-two">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePztwuq9PA9DT9Ibg8thR61licdZ5H8wifw&s" alt="Article 2" />
            <p>Tec</p>
          </div>
        </div>
        <div className="app-destaque-container">
          <h1>Em destaque</h1>
          <h2>Eventos e causas esperando por você</h2>
          <SimpleSlider /> {/* Insert the SimpleSlider component here */}
        </div>
      </div>
    </>
  );
}

export default App;