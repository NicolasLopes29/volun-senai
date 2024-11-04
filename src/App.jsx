import React, { useRef, useState, useEffect } from "react";
import "./css/App.css"; 
import SimpleSlider from "./components/SimpleSlider"; 

const AutoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('left');
  const slides = [
    {
      text: "Capivaras são os maiores roedores do mundo!",
      background: "linear-gradient(315deg, #A53FFF, #0B01AB)"
    },
    {
      text: "Capivaras são excelentes nadadoras e podem ficar submersas por até 5 minutos.",
      background: "linear-gradient(315deg, #693979, #CC8961)"
    },
    {
      text: "Capivaras são animais sociais e vivem em grupos de até 100 indivíduos.",
      background: "radial-gradient(at left top, #8C53BF, #014192)"
    },
    {
      text: "O nome 'capivara' vem do tupi e significa 'comedor de capim'.",
      background: "linear-gradient(315deg, #A53FFF, #0B01AB)"
    },
    {
      text: "Capivaras têm uma expectativa de vida de 8 a 10 anos na natureza.",
      background: "linear-gradient(315deg, #0117A9, #D87D01)"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('left');
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? 'left' : 'right');
    setCurrentSlide(index);
  };

  return (
    <div className="auto-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slider-content ${index === currentSlide ? 'active' : ''} ${direction}`}
          style={{ background: slide.background }}
        >
          {slide.text}
        </div>
      ))}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="app-container">
        <section className="app-section-container">
        <AutoSlider />
        </section>
        <div className="app-articles-container">
          <div className="article-number-one">
            <img src="https://www.infomoney.com.br/wp-content/uploads/2024/09/TVCultura1.png?fit=1280%2C624&quality=50&strip=all" alt="Article 1" />
            <p>Você busca uma forma de fazer a diferença e deixar o mundo um pouco mais justo? O VOLUN é a plataforma perfeita para você!
                Com o VOLUN, você tem acesso a uma variedade de eventos com causas sociais,
                 desde campanhas de doação de sangue até mutirões de limpeza em praças e parques. Além disso, você pode</p>
          </div>
 
          <div className="article-number-two">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePztwuq9PA9DT9Ibg8thR61licdZ5H8wifw&s" alt="Article 2" />
            <p>Criar sua própria campanha: Se você tem uma ideia para um evento social, utilize o VOLUN para divulgá-la
            e encontrar parceiros para realizá-la. Acompanhar o impacto: Veja de perto os resultados dos eventos que você
            participa e saiba como suas ações estão contribuindo para um futuro melhor. Inspirar outras pessoas:
            Compartilhe suas experiências e histórias no VOLUN e inspire mais pessoas a se engajarem em causas sociais.</p>
          </div>
        </div>
        <div className="app-destaque-container">
          <h1>Em destaque</h1>
          <h2>Eventos e causas esperando por você</h2>
          <SimpleSlider />
        </div>
      </div>
    </>
  );
}

export default App;
