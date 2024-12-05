import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./../css/Eventos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card";
import seta from "./../assets/images/seta-page.svg";
import Loader from "./Loader";
import Search from "./Search";
import EventosVitrine from "./EventosVitrine";
import algoliaClient from "../services/algoliaConfig";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const index = algoliaClient.initIndex("eventos");

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasSearch, setHasSearch] = useState(false);
    const itemsPerPage = 9;

    const buscarEventos = async (filtros) => {
        try {
            setLoading(true);
            const { estadoSelecionado, categoria, cidade, searchQuery } = filtros;

            const hasFilters = estadoSelecionado || categoria.length > 0 || cidade || searchQuery;
            setHasSearch(!!hasFilters);

            const algoliaResponse = await index.search(searchQuery || "", {
                filters: [
                    estadoSelecionado ? `endereco.estado:${estadoSelecionado}` : "",
                    cidade ? `endereco.cidade:${cidade}` : "",
                    categoria.length > 0 ? categoria.map(cat => `tags:${cat}`).join(" OR ") : "",
                ].filter(Boolean).join(" AND "),
            });

            const eventosAlgolia = algoliaResponse.hits.map(hit => ({
                ...hit,
                endereco: hit.endereco ? `${hit.endereco.bairro}, ${hit.endereco.cidade} - ${hit.endereco.estado}` : "Endereço indefinido",
                organizacaoNome: hit.organizacao?.nome || "Organização indefinida",
                organizacaoLogo: hit.organizacao?.imgLogo || "",
            }));

            setEventos(eventosAlgolia);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        buscarEventos({
            estadoSelecionado: "",
            categoria: [],
            cidade: "",
            searchQuery: "",
        });
    }, []);

    const uniqueOrganizations = [...new Map(eventos.map(e => [e.organizacaoNome, e])).values()];

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
        slidesToShow: Math.min(4, uniqueOrganizations.length),
        slidesToScroll: 1,
        prevArrow: <SliderArrow direction="prev" />,
        nextArrow: <SliderArrow direction="next" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(3, uniqueOrganizations.length),
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(2, uniqueOrganizations.length),
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEventos = eventos.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(eventos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="Eventos-page-container">
            <Search onBuscar={buscarEventos} />

            {loading ? (
                <Loader />
            ) : hasSearch ? (
                <>
                    <div className="Eventos-carrossel">
                        <h2>Organizações Participantes</h2>
                        {uniqueOrganizations.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {uniqueOrganizations.map((org, index) => {
                                    const orgId = org.organizacao._id; 
                                    return (
                                        <div key={index} className="Carrossel-item">
                                            <Link to={`/ongVisitor/${orgId}`} className="Carrossel-link">
                                                <div className="Carrossel-image-container">
                                                    <img 
                                                        src={org.organizacaoLogo || "/default-logo.png"} 
                                                        alt={org.organizacaoNome} 
                                                        className="Carrossel-logo" 
                                                    />
                                                </div>
                                                <p>{org.organizacaoNome}</p>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </Slider>
                        ) : (
                            <p>Não há organizações disponíveis no momento.</p>
                        )}
                    </div>
                    <div className="Eventos-resultado-pesquisa-texto">
                        <div className="Eventos-titulo">
                            <h1>Resultado da pesquisa:</h1>
                            <h3>Foram achados {eventos.length} resultados referentes a sua busca</h3>
                        </div>
                        <div className="Eventos-resultado-pesquisa">
                            {currentEventos.map((evento, index) => (
                                <Card 
                                    key={index}
                                    id={evento.objectID}
                                    titulo={evento.titulo}
                                    descricao={evento.descricao}
                                    ongNome={evento.organizacaoNome}
                                    dataInicio={evento.dataInicio}
                                    imgUrl={evento.imagem}
                                    vagaLimite={evento.vagaLimite}
                                    endereco={evento.endereco}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <EventosVitrine />
            )}

            {!loading && hasSearch && eventos.length > 0 && (
                <div className="page-count">
                    <img src={seta} alt="" className="seta" onClick={() => handlePageChange(currentPage - 1)} />
                    <div className="Botao-page">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Anterior
                        </button>
                    </div>
                    {[...Array(totalPages).keys()].map((_, i) => (
                        <div className="numero-page" key={i}>
                            <button 
                                onClick={() => handlePageChange(i + 1)} 
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        </div>
                    ))}
                    <div className="Botao-page">
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Seguinte
                        </button>
                    </div>
                    <img src={seta} alt="" className="seta-right" onClick={() => handlePageChange(currentPage + 1)} />
                </div>
            )}
        </div>
    );
};

export default Eventos;


