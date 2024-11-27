import React, { useRef, useState, useEffect } from "react";
import "./css/App.css";
import SimpleSlider from "./components/SimpleSlider";

import { Link } from "react-router-dom";

const AutoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("left");

  const slides = [
    {
      text: "Bem-vindo ao VOLUN! Sua plataforma para conectar-se a eventos e causas sociais.",
      background: "linear-gradient(315deg, #A53FFF, #0B01AB)",
    },
    {
      text: "Transforme o mundo ao seu redor! Descubra campanhas sociais próximas a você.",
      background: "linear-gradient(315deg, #693979, #CC8961)",
    },
    {
      text: "Encontre eventos incríveis e faça a diferença hoje mesmo.",
      background: "radial-gradient(at left top, #8C53BF, #014192)",
    },
    {
      text: "Está esperando o quê? Junte-se ao VOLUN agora!",
      background: "linear-gradient(315deg, #A53FFF, #0B01AB)",
      button: false, // Indica que este slide terá o botão
    },
    {
      text: "Explore causas que realmente importam e ajude a construir um futuro melhor.",
      background: "linear-gradient(315deg, #0117A9, #D87D01)",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("left");
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? "left" : "right");
    setCurrentSlide(index);
  };

  return (
    <div className="auto-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slider-content ${index === currentSlide ? "active" : ""} ${direction}`}
          style={{ background: slide.background }}
        >
          <p>{slide.text}</p>
          {slide.button && (
            <Link to="/" className="cta-link">
              Crie uma conta agora
            </Link>
          )}
        </div>
      ))}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


// Nova seção de Benefícios do Voluntariado
const BenefitsSection = () => (
  <section className="benefits-section">
    <h2>Benefícios do Voluntariado</h2>
    <ul>
      <li>Desenvolva novas habilidades e aprimore suas capacidades de liderança.</li>
      <li>Fortaleça sua rede de contatos e crie laços com pessoas de diversas áreas.</li>
      <li>Faça a diferença e contribua para um mundo mais justo e sustentável.</li>
    </ul>
  </section>
);

// Nova seção de Como Funciona
const HowItWorksSection = () => (
  <section className="how-it-works-section">
    <h2>Como Funciona</h2>
    <ol>
      <li>Crie sua conta e personalize seu perfil.</li>
      <li>Explore eventos disponíveis e escolha a causa que mais se alinha com seus valores.</li>
      <li>Participe de eventos e acompanhe seu impacto por meio da plataforma VOLUN.</li>
    </ol>
  </section>
);

function App() {
  return (
    <>
      <div className="app-container">
        <section className="app-section-container">
          <AutoSlider />
        </section>
        <div className="app-destaque-container">
          <h1>Em destaque</h1>
          <h2>Eventos e causas esperando por você</h2>
          <SimpleSlider />
        </div>

        
        <div className="app-articles-container">
          <div className="article-number-one">
            <img src="https://img.freepik.com/free-photo/top-view-young-people-putting-their-hands-together_1139-1008.jpg?ga=GA1.1.1726533856.1700858386&semt=ais_hybrid" alt="Article 1" />
            <b><h1>
            Seja a Mudança que o Mundo Precisa com o VOLUN</h1></b>
            <p>Quer contribuir para um mundo mais justo? O VOLUN é a plataforma ideal para você! Explore uma ampla gama de eventos sociais, como campanhas de doação de sangue e mutirões de limpeza em praças e parques.</p>
          </div>
          <BenefitsSection /> {/* Nova seção adicionada */}
          <div className="article-number-two">
            <img src="https://img.freepik.com/free-photo/full-shot-woman-jumping-outdoors_23-2149913414.jpg?ga=GA1.1.1726533856.1700858386&semt=ais_hybrid" alt="Article 2" />
            <h1>Transforme Ideias em Ação com o VOLUN</h1>
            <p><b>Crie sua própria campanha:</b> Tem uma ideia para um evento social? Use o VOLUN para divulgá-la e encontrar parceiros dispostos a ajudar na realização <br/> <b>Acompanhe o impacto:</b> Monitore os resultados dos eventos em que participa e descubra como suas ações estão contribuindo para um futuro melhor</p>
          </div>
        </div>
        <HowItWorksSection /> {/* Nova seção adicionada */}
      </div>
    </>
  );
}

export default App;
