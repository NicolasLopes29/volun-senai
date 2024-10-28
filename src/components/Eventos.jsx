// src/components/Eventos.js
import React, { useEffect, useState } from "react";
import "./../css/Eventos.css";
import Card from "./Card";
import seta from "./../assets/images/seta-page.svg";
import Loader from "./Loader"; 
import Search from "./Search";

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Função para buscar eventos com filtros, chamada quando o usuário clica em "Buscar"
    const buscarEventos = async (filtros) => {
        try {
            setLoading(true);
            const response = await fetch(`https://volun-api-eight.vercel.app/eventos/`);
            const data = await response.json();
            setEventos(data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
            setCurrentPage(1);  // Redefine para a primeira página após nova busca
        }
    };

    // Chama a busca inicial sem filtros ao montar o componente
    useEffect(() => {
        buscarEventos({});
    }, []);

    // Determina os eventos a serem exibidos com base na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEventos = eventos.slice(indexOfFirstItem, indexOfLastItem);

    // Lógica de navegação entre páginas
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
                                titulo={evento.titulo}
                                descricao={evento.descricao}
                                ongNome={evento.ong_id?.nome}
                                dataInicio={evento.data_inicio}
                                imgUrl={evento.imagem}
                                vagaLimite={evento.vaga_limite}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Controles de paginação */}
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
