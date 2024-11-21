import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./../css/SimpleSlider.css";
import Card from "./Card";
import Loader from "./Loader";

export default function SimpleSlider() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const fetchEventos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://volun-api-eight.vercel.app/eventos");
      if (!response.ok) throw new Error("Erro ao buscar eventos");

      const data = await response.json();
      const eventosLimitados = data.slice(0, 9); // Limita a 9 eventos

      // Para cada evento, busca o endereço no MongoDB
      const eventosComEnderecos = await Promise.all(
        eventosLimitados.map(async (evento) => {
          try {
            const enderecoResponse = await fetch(`https://volun-api-eight.vercel.app/endereco/evento/${evento._id}`);
            const enderecoData = await enderecoResponse.json();

            const endereco = Array.isArray(enderecoData) && enderecoData.length > 0
              ? `${enderecoData[0].logradouro}, ${enderecoData[0].numero}, ${enderecoData[0].cidade}, ${enderecoData[0].estado}`
              : "Endereço indefinido";

            return { ...evento, endereco };
          } catch {
            return { ...evento, endereco: "Endereço indefinido" };
          }
        })
      );

      setEventos(eventosComEnderecos);
    } catch (error) {
      console.error("Erro ao buscar dados dos eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="slider-container">
      {isLoading ? (
        <Loader />
      ) : (
        <Slider {...settings}>
          {eventos.map((evento) => (
            <Card 
              key={evento._id}
              id={evento._id}
              titulo={evento.titulo}
              descricao={evento.descricao}
              ongNome={evento.ong_id?.nome}
              dataInicio={evento.data_inicio}
              imgUrl={evento.imagem}
              vagaLimite={evento.vaga_limite}
              endereco={evento.endereco}
            />
          ))}
        </Slider>
      )}
    </div>
  );
}

