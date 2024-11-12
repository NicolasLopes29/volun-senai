import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import "./../css/DetalhesEventos.css";
import Loader from "./Loader";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import praia from "./../assets/images/img-praia.svg";

const DetalhesEventos = () => {
    const { id } = useParams(); 
    const [evento, setEvento] = useState({});
    const [endereco, setEndereco] = useState(null);
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
            // Aguarda a resposta das duas requisições
            const dadosEvento = await fetchEvento(id);
            if (dadosEvento) {
                setEvento(dadosEvento);
                const dadosEndereco = await fetchEndereco(dadosEvento._id);
                if (dadosEndereco) setEndereco(dadosEndereco);
            }

            // Após buscar os dados do evento, busca os comentários
            await handleBuscarComentarios();

        } catch (error) {
            console.error("Erro ao carregar evento e/ou comentários:", error);
        } finally {
            setIsLoading(false); // Desativa o carregamento quando as duas requisições terminarem
        }
    };

    getEventoEEndereco();
}, [id]);


    const fetchEvento = async (id) => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${id}`);
            if (!response.ok) throw new Error("Erro ao buscar evento");

            const data = await response.json();
            console.log("Dados do evento:", data);
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
            return Array.isArray(data) && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Erro ao buscar dados do endereço:", error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy");
    };

    const formatarHora = (data) => {
        return format(new Date(data), "HH:mm");
    };

    // const latitude = endereco?.latitude || -23.55052; // Coordenadas fictícias ou padrão
    // const longitude = endereco?.longitude || -46.633308;

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
                        <p>{evento.vaga_limite} vagas</p>
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
                        <p>{endereco ? `${endereco.logradouro}, ${endereco.numero}, ${endereco.cidade} - ${endereco.estado}` : "Endereço indisponível"}</p>
                    </div>
                    <div className="informacoes-ong">
                        <div className="perfil-ong-container">
                            <p className="link-ong">Visite o perfil da ONG:</p>
                            <div className="logo-and-name-ong">
                                <div className="logo-img-container">
                                    <img className="logo-img-ong" alt="logo ONG" src={evento.ong_id?.img_logo} />
                                </div>
                                <h2 className="link-ong-name">{evento.ong_id?.nome}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="endereco-mapa">
                <h2>Endereço: Rua dos Banzeiros Senai 32</h2>
                <div className="mapa-lugar">Mapa irado</div>
            </div>
    
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
                <button className="button-visualizar" onClick={toggleshowComentarios} >
                    {showComentarios ? "Ocultar comentários" : `Exibir comentários (${comentarios.length})`}
                </button>
            </div>
            
    
            {/* Seção de exibição dos comentários */}
            {showComentarios && (
                <div className="lista-comentarios">
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div key={comentario._id} className="comentarios">
                                <div className="comentario-usuario-info">
                                    <img src={comentario.usuario?.photoUrl} alt="Foto do usuário" className="usuario-foto-coment" />                
                                    <h2>{comentario.usuario?.nome} {comentario.usuario?.sobrenome}</h2>
                                </div>
                                <div className="comentario-conteudo">
                                    <p>{comentario.conteudo}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum comentário encontrado para este evento.</p>
                    )}
                </div>
            )}
        </>
    );
}
export default DetalhesEventos;