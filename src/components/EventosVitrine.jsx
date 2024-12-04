import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Card from "./Card";
import Loader from "./Loader";
import axios from "axios";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../css/EventosVitrine.css";

const EventosVitrine = () => {
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://volun-api-eight.vercel.app/eventos");
            setEventos(response.data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
        }
    };

    const SliderArrow = ({ className, style, onClick, direction }) => (
        <div
            className={`custom-arrow ${className} ${direction}`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        >
            {direction === "prev" ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </div>
    );

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <SliderArrow direction="prev" />,
        nextArrow: <SliderArrow direction="next" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const renderEventSlider = (events, title) => (
        <div className="eventos-slider">
            <h2 className="eventos-slider-title">{title}</h2>
            <Slider {...sliderSettings}>
                {events.map((evento, index) => (
                    <div key={index} className="eventos-slider-item">
                        <Card 
                            id={evento._id}
                            titulo={evento.titulo}
                            descricao={evento.descricao}
                            ongNome={evento.ong_id?.nome || "Organização indefinida"}
                            dataInicio={evento.data_inicio}
                            imgUrl={evento.imagem}
                            vagaLimite={evento.vaga_limite}
                            endereco={evento.endereco_id ? `${evento.endereco_id?.bairro}, ${evento.endereco_id?.cidade} - ${evento.endereco_id?.estado}` : "Endereço indefinido"}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );

    const eventosRecentes = [...eventos].sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio)).slice(0, 9);
    const eventosSP = eventos.filter(evento => evento.endereco_id?.estado === "SP").slice(0, 9);
    const eventosRJ = eventos.filter(evento => evento.endereco_id?.estado === "RJ").slice(0, 9);
    const eventosEducacao = eventos.filter(evento => evento.tags?.includes("Educação")).slice(0, 9);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="eventos-vitrine">
            <h1 className="eventos-vitrine-title">Descubra Eventos Incríveis</h1>
            {renderEventSlider(eventosRecentes, "Eventos Mais Recentes")}
            {renderEventSlider(eventosSP, "Eventos em São Paulo")}
            {renderEventSlider(eventosRJ, "Eventos no Rio de Janeiro")}
            {renderEventSlider(eventosEducacao, "Eventos de Educação")}
        </div>
    );
};

export default EventosVitrine;

