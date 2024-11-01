import React, { useEffect, useState } from "react";
import "./../css/Eventos.css";
import Card from "./Card";
import seta from "./../assets/images/seta-page.svg";
import Loader from "./Loader";
import Search from "./Search";
import algoliaClient from "./../services/algoliaConfig"; // Importa a configuração do Algolia

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

            // Realiza a busca no Algolia com os filtros aplicados
            const algoliaResponse = await index.search(searchQuery, {
                filters: [
                    estadoSelecionado ? `estado:${estadoSelecionado}` : "",
                    cidade ? `cidade:${cidade}` : "",
                    categoria ? `tags:${categoria}` : "",
                ].filter(Boolean).join(" AND "),
            });

            // Processa os resultados do Algolia
            const eventosAlgolia = algoliaResponse.hits.map(hit => ({
                ...hit,
                endereco: "Carregando..."  // Endereço será buscado posteriormente
            }));

            // Para cada evento retornado, busca o endereço no MongoDB
            const eventosComEnderecos = await Promise.all(
                eventosAlgolia.map(async (evento) => {
                    try {
                        const enderecoResponse = await fetch("https://volun-api-eight.vercel.app/endereco/evento/" + evento.objectID);
                        const enderecoData = await enderecoResponse.json();

                        const endereco = Array.isArray(enderecoData) && enderecoData.length > 0
                            ? `${enderecoData[0].cidade}, ${enderecoData[0].estado}`
                            : "Endereço indefinido";

                        return { ...evento, endereco };
                    } catch {
                        return { ...evento, endereco: "Endereço indefinido" };
                    }
                })
            );

            setEventos(eventosComEnderecos);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        buscarEventos({});
    }, []);

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
                <div className="Eventos-resultado-pesquisa-texto">
                    <div className="Eventos-titulo">
                        <h1>Resultado da pesquisa:</h1>
                        <h3>Foram achados {eventos.length} resultados referentes a sua busca</h3>
                    </div>
                    <div className="Eventos-resultado-pesquisa">
                        {currentEventos.map((evento, index) => (
                            <Card 
                                key={index}
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
                    </div>
                </div>
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
