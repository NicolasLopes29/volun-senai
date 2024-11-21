import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import "./../css/DetalhesEventos.css";
import user_non_Photo from "../assets/images/userphoto.jpg";

const Coment = ({ eventoId }) => {
    const [novoComentario, setNovoComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [showComentarios, setShowComentarios] = useState(false);
    const auth = getAuth();
    const userPhoto = auth.currentUser?.photoURL;

    // Buscar Comentários
    const handleBuscarComentarios = async () => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/comentarios/evento/${eventoId}`);
            if (!response.ok) throw new Error("Erro ao buscar comentários");

            const comentariosData = await response.json();

            // Adiciona dados do usuário a cada comentário
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

    // Publicar Comentário
    const handlePublicarComentario = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return console.error("Usuário não está logado");

        const comentarioData = {
            evento_id: eventoId,
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
            handleBuscarComentarios(); // Atualiza os comentários
        } catch (error) {
            console.error("Erro ao publicar comentário:", error);
        }
    };

    // Alternar visibilidade dos comentários
    const toggleshowComentarios = () => {
        if (!showComentarios) {
            handleBuscarComentarios();
        }
        setShowComentarios(!showComentarios);
    };

    useEffect(() => {
        if (eventoId) {
            handleBuscarComentarios(); // Carrega os comentários ao inicializar
        }
    }, [eventoId]);

    return (
        <>
            <div className="comentarios">
                <div className="usuario-info-coment">
                    <img 
                        src={userPhoto || "https://miro.medium.com/v2/resize:fit:1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg"} 
                        className="usuario-foto-coment" 
                        alt="foto do usuário" 
                    />
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
                                    <img src={comentario.usuario?.photoUrl || user_non_Photo} alt="Foto do usuário" className="usuario-foto-coment"/>           
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
};

export default Coment;
