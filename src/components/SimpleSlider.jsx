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
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1130,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://volun-api-eight.vercel.app/eventos"
        );
        const data = await response.json();

        // Mapeia os dados e inverte a ordem dos eventos
        const eventosDetalhes = data.reverse().map((evento) => ({
          id: evento._id,
          titulo: evento.titulo,
          descricao: evento.descricao,
          ongNome: evento.ong_id?.nome || "ONG não especificada",
          dataInicio: evento.data_inicio,
          imgUrl: evento.imagem,
          vagaLimite: evento.vaga_limite,
          endereco: evento.endereco_id
            ? `${evento.endereco_id.bairro}, ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
            : "Endereço não disponível",
        }));

        setEventos(eventosDetalhes);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
              key={evento.id}
              id={evento.id}
              titulo={evento.titulo}
              descricao={evento.descricao}
              ongNome={evento.ongNome}
              dataInicio={evento.dataInicio}
              imgUrl={evento.imgUrl}
              vagaLimite={evento.vagaLimite}
              endereco={evento.endereco}
            />
          ))}
        </Slider>
      )}
    </div>
  );
}
