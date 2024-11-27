import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Biblioteca do carrossel
import "./../css/Eventos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card";
import seta from "./../assets/images/seta-page.svg";
import Loader from "./Loader";
import Search from "./Search";
import algoliaClient from "../services/algoliaConfig";

// Configuração do cliente Algolia
const index = algoliaClient.initIndex("eventos");

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const buscarEventos = async (filtros) => {
        try {
            setLoading(true);
            const { estadoSelecionado, categoria, cidade, searchQuery } = filtros;

            // Realiza a busca no Algolia aplicando apenas os filtros preenchidos
            const algoliaResponse = await index.search(searchQuery || "", {
                filters: [
                    estadoSelecionado ? `endereco.estado:${estadoSelecionado}` : "",
                    cidade ? `endereco.cidade:${cidade}` : "",
                    categoria.length > 0 ? categoria.map(cat => `tags:${cat}`).join(" OR ") : "",
                ].filter(Boolean).join(" AND "),
            });

            // Processa os resultados do Algolia e configura o endereço e o nome da organização
            const eventosAlgolia = algoliaResponse.hits.map(hit => ({
                ...hit,
                endereco: hit.endereco ? `${hit.endereco.bairro}, ${hit.endereco.cidade} - ${hit.endereco.estado}` : "Endereço indefinido",
                organizacaoNome: hit.organizacao?.nome || "Organização indefinida", // Adicionando nome da organização
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

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(4, uniqueOrganizations.length),
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(2, uniqueOrganizations.length),
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: Math.min(1, uniqueOrganizations.length),
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
        <div className="Pesquisa-Eventos">
            <Search onBuscar={buscarEventos} />

            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="Eventos-carrossel">
                        <h2>Organizações Participantes</h2>
                        {uniqueOrganizations.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {uniqueOrganizations.map((org, index) => (
                                    <div key={index} className="Carrossel-item">
                                        <img 
                                            src={org.organizacaoLogo || "/default-logo.png"} 
                                            alt={org.organizacaoNome} 
                                            className="Carrossel-logo" 
                                        />
                                        <p>{org.organizacaoNome}</p>
                                    </div>
                                ))}
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
                                    ongNome={evento.organizacaoNome} // Passando o nome da organização
                                    dataInicio={evento.dataInicio}
                                    imgUrl={evento.imagem}
                                    vagaLimite={evento.vagaLimite}
                                    endereco={evento.endereco}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
            
            {!loading && eventos.length > 0 && (
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
