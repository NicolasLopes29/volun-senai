import React, { useEffect, useState } from "react";
import algoliasearch from "algoliasearch";
import "./../css/Eventos.css";
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
                    categoria ? `tags:${categoria}` : "",
                ].filter(Boolean).join(" AND "),
            });

            // Processa os resultados do Algolia e configura o endereço e o nome da organização
            const eventosAlgolia = algoliaResponse.hits.map(hit => ({
                ...hit,
                endereco: hit.endereco ? `${hit.endereco.cidade}, ${hit.endereco.estado}` : "Endereço indefinido",
                organizacaoNome: hit.organizacao?.nome || "Organização indefinida", // Adicionando nome da organização
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
