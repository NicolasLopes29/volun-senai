import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import "./../css/DetalhesEventos.css";
import Loader from "./Loader";
import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import praia from "./../assets/images/img-praia.svg";

const DetalhesEventos = () => {
    const { id } = useParams(); // Obtém o id do evento da rota
    const [evento, setEvento] = useState({}); // Armazena todos os dados do evento
    const [endereco, setEndereco] = useState(null);
    const [showDiv, setShowDiv] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const mostrarEsconderDiv = () => {
        setShowDiv(prev => !prev);
    };

    const fetchEvento = async (id) => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${id}`);
            if (!response.ok) throw new Error("Erro ao buscar evento");

            const data = await response.json();
            console.log("Dados do evento:", data); // Para verificar se o dado está correto
            return data;
        } catch (error) {
            console.error("Erro ao buscar dados do evento:", error);
        }
    };

    const fetchEndereco = async (eventoId) => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/endereco/evento/${eventoId}`);
            if (!response.ok) throw new Error("Endereço não encontrado");

            const data = await response.json();
            console.log("Dados do endereço:", data);
            return Array.isArray(data) && data.length > 0 ? data[0] : null; // Verifica se é um array e pega o primeiro item
        } catch (error) {
            console.error("Erro ao buscar dados do endereço:", error);
        }
    };

    useEffect(() => {
        const getEventoEEndereco = async () => {
            const dadosEvento = await fetchEvento(id);
            if (dadosEvento) {
                setEvento(dadosEvento);
                const dadosEndereco = await fetchEndereco(dadosEvento._id);
                if (dadosEndereco) setEndereco(dadosEndereco);
            }
            setIsLoading(false);
        };

        getEventoEEndereco();
    }, [id]);

    // Exibe o Loader enquanto isLoading for verdadeiro
    if (isLoading) {
        return <Loader />;
    }

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy"); // Função para formatar as datas
    };

    const formatarHora = (data) => {
        return format(new Date(data), "HH:mm"); // Função para formatar as datas
    };

    const dataInicio = evento.data_inicio ? formatarData(evento.data_inicio) : "Data indefinida";
    const dataFim = evento.data_fim ? formatarData(evento.data_fim) : "Data indefinida";

    const horaInicio = evento.data_inicio ? formatarHora(evento.data_inicio) : "Data indefinida";
    const horaFim = evento.data_fim ? formatarHora(evento.data_fim) : "Data indefinida";


    return (
        <>
            <div className="pega-tudo">
                <div className="parte-1">
                    <div className="titulo-evento">
                        <h1>{evento.titulo || "Carregando..."}</h1>
                        <div className="tags-container">
                            {evento.tags.map((tag, index) => (
                                <span key={index} className="tag-item">{tag}</span>
                            ))}
                        </div>     
                    </div>
                
                    <div>
                        <button className="participar">Participar</button>
                        <button className="compartilhar">Compartilhar</button>
                    </div>
                    <div className="background-descricao">
                        <p className="descricao-evento">{evento.descricao || "Descrição indisponível..."}</p>
                    </div>
                    <div className="backgound-especificacoes">
                        <p className="preferencia-descricao">Preferências: nenhuma</p>
                        <p className="funcao-descricao">Função: Auxiliar na limpeza da praia coletando resíduos</p>
                    </div>
                </div>

                <div className="parte-2">
                    <div className="imagem-evento">
                        <img src={evento.imagem || praia} alt={evento.titulo} className="praia-img" /> {/* Exibe imagem do evento */}
                    </div>
                    <div className="barra-participantes">
                        <img src={pessoas} alt="" className="pessoas" />
                        <p>{evento.vaga_limite} vagas</p>
                    </div>

                    <div className="data-evento">
                        <img src={calendario} alt="" className="calendario-icon" />
                        <p>{dataInicio} á {dataFim}</p>
                    </div>

                    <div className="horario-evento">
                        <img src={relogio} alt="" className="relogio-icon" />
                        <p>Horário: {horaInicio} á {horaFim}</p>
                    </div>

                    <div className="local-eventos">
                        <img src={local} alt="" className="local-icon" />
                        <p>{endereco ? `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade} - ${endereco.estado}` : "Endereço indisponível"}</p>
                    </div>

                    <div className="informacoes-ong">
                        <div className="perfil-ong">
                            <p className="link-ong">Visite o perfil da ONG:</p>
                            <img alt="" />
                            <p className="link-ong">{evento.ong_id?.nome}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="endereco-mapa">
                <h2>Endereço: Rua dos Banzeiros Senai 32</h2>
                <div className="mapa-lugar">Mapa irado</div>
            </div>

            <div className="comentarios">
                <div className="usuario">
                    <div className="usuario-foto">
                        <p>eu</p>
                    </div>
                </div>
                <div className="publicar-comentario">
                    <input className="comentar" placeholder="Comente aqui..." />
                </div>
            </div>

            <button className="button-publicar">Publicar</button>
            <button className="button-visualizar" onClick={mostrarEsconderDiv}>Ver comentários</button>

            <div className="comentarios-2">
                <div className="usuario">
                    <div className="usuario-foto"></div>
                </div>
                <div className="publicar-comentario-2">
                    <p>Coisas muitas coisas nossa quantas coisas...</p>
                </div>
            </div>
        </>
    );
};

export default DetalhesEventos;
