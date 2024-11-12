import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import algoliaClient from "./../services/algoliaConfig"; // Importando o cliente configurado do Algolia
import "./../css/DetalhesEventos.css";
import Loader from "./Loader";
import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import praia from "./../assets/images/img-praia.svg";

// Inicializando o índice de eventos
const indexEventos = algoliaClient.initIndex("eventos");

const formatarCEP = (cep) => {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2'); // Adiciona o "-" após os 5 primeiros dígitos
};

const DetalhesEventos = () => {
    const { id } = useParams();
    const [evento, setEvento] = useState({});
    const [novoComentario, setNovoComentario] = useState("");
    const [showComentarios, setShowComentarios] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const auth = getAuth();
    const [isLoading, setIsLoading] = useState(true);

    const userPhoto = auth.currentUser?.photoURL;

    const handleBuscarComentarios = async () => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/comentarios/evento/${id}`);
            if (!response.ok) throw new Error("Erro ao buscar comentários");
    
            const comentariosData = await response.json();
    
            // Realiza a segunda requisição para buscar os dados do usuário
            const comentariosComUsuarios = await Promise.all(
                comentariosData.map(async (comentario) => {
                    const usuarioResponse = await fetch(`https://volun-api-eight.vercel.app/usuarios/${comentario.usuario_id}`);
                    const usuarioData = await usuarioResponse.json();
                    return { ...comentario, usuario: usuarioData };
                })
            );
            setComentarios(comentariosComUsuarios);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        }
    };
    
    const toggleshowComentarios = () => {
        if (!showComentarios) {
            handleBuscarComentarios();
        }
        setShowComentarios(!showComentarios);
    };

    const handlePublicarComentario = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return console.error("Usuário não está logado");
    
        const comentarioData = {
            evento_id: id,
            usuario_id: userId,
            conteudo: novoComentario,
        };
    
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/comentarios/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(comentarioData),
            });
            const textResponse = await response.text();
            console.log("Resposta do servidor:", textResponse);
    
            if (!response.ok) throw new Error("Erro ao publicar comentário");
    
            setNovoComentario(""); 
            handleBuscarComentarios(); // Atualiza os comentários automaticamente após publicar
        } catch (error) {
            console.error("Erro ao publicar comentário:", error);
        }
    };

    // Efeito para buscar comentários assim que a página é carregada
    useEffect(() => {
        handleBuscarComentarios(); // Carrega os comentários na primeira renderização
    }, [id]); // Recarrega os comentários quando o ID do evento muda

    useEffect(() => {
        const getEventoEEndereco = async () => {
            setIsLoading(true); // Ativa o carregamento
            try {
                const dadosEvento = await fetchEvento(id);
                if (dadosEvento) {
                    setEvento(dadosEvento);
                }
            } catch (error) {
                console.error("Erro ao carregar evento:", error);
            } finally {
                setIsLoading(false); // Desativa o carregamento quando as requisições terminarem
            }
        };

        getEventoEEndereco();
    }, [id]);

    const fetchEvento = async (id) => {
        try {
            const response = await indexEventos.getObject(id); // Busca o evento pelo ID no Algolia
            console.log("Dados do evento:", response);
            return response;
        } catch (error) {
            console.error("Erro ao buscar dados do evento:", error);
        }
    };

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy");
    };

    const formatarHora = (data) => {
        return format(new Date(data), "HH:mm");
    };

    const dataInicio = evento.dataInicio ? formatarData(evento.dataInicio) : "Data indefinida";
    const dataFim = evento.dataFim ? formatarData(evento.dataFim) : "Data indefinida";
    const horaInicio = evento.dataInicio ? formatarHora(evento.dataInicio) : "Data indefinida";
    const horaFim = evento.dataFim ? formatarHora(evento.dataFim) : "Data indefinida";

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="pega-tudo">
                    <div className="parte-1">
                        <div className="titulo-evento">
                            <h1>{evento.titulo || "Carregando..."}</h1>
                            <div className="tags-container">
                                {evento.tags && evento.tags.map((tag, index) => (
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
                            <img src={evento.imagem || praia} alt={evento.titulo} className="praia-img" />
                        </div>
                        <div className="barra-participantes">
                            <img src={pessoas} alt="ícone pessoas" className="pessoas" />
                            <p>{evento.vagaLimite} vagas</p>
                        </div>
                        <div className="data-evento">
                            <img src={calendario} alt="ícone calendário" className="calendario-icon" />
                            <p>{dataInicio} à {dataFim}</p>
                        </div>
                        <div className="horario-evento">
                            <img src={relogio} alt="ícone relógio" className="relogio-icon" />
                            <p>Horário: {horaInicio} à {horaFim}</p>
                        </div>
                        <div className="local-eventos">
                            <img src={local} alt="ícone local" className="local-icon" />
                            <p>
                                {evento.endereco ? `${evento.endereco.logradouro}, ${evento.endereco.numero}, ${evento.endereco.cidade} - ${evento.endereco.estado}, CEP: ${formatarCEP(evento.endereco.cep)}` : "Endereço indisponível"}
                            </p>
                        </div>
                        <div className="informacoes-ong">
                            <div className="perfil-ong-container">
                                <p className="link-ong">Visite o perfil da ONG:</p>
                                <div className="logo-and-name-ong">
                                    <div className="logo-img-container">
                                        <img className="logo-img-ong" alt="logo ONG" src={evento.organizacao?.imgLogo} />
                                    </div>
                                    <h2 className="link-ong-name">{evento.organizacao?.nome}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            <div className="comentarios">
                <div className="usuario-info-coment">
                    <img 
                        src={userPhoto || "https://miro.medium.com/v2/resize:fit:1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg"} 
                        className="usuario-foto-coment" 
                        alt="foto do usuário" 
                    />
                    <p>eu</p>
                </div>
                <div className="publicar-comentario">
                    <input 
                        className="comentar" 
                        placeholder="Comente aqui..." 
                        value={novoComentario} 
                        onChange={(e) => setNovoComentario(e.target.value)} 
                    />
                </div>
            </div>
            <div className="buttons-comentarios">
                <button className="button-publicar" onClick={handlePublicarComentario}>Publicar</button>
                <button className="button-visualizar" onClick={toggleshowComentarios}>
                    {showComentarios ? "Ocultar comentários" : "Exibir comentários"}
                </button>
            </div>
    
            {showComentarios && (
                <div className="comentarios-lista">
                    {comentarios.map((comentario) => (
                        <div className="comentario" key={comentario._id}>
                            <img 
                                src={comentario.usuario.foto || "https://miro.medium.com/v2/resize:fit:1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg"} 
                                alt="foto do usuário" 
                                className="usuario-foto-coment" 
                            />
                            <div className="comentario-content">
                                <p className="usuario-nome-coment">{comentario.usuario.nome}</p>
                                <p>{comentario.conteudo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default DetalhesEventos;
