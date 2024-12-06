import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import "./../css/DetalhesEventos.css";
import user_non_Photo from "../assets/images/userphoto.jpg";
import ReportModal from "./ReportModal";

const Coment = ({ eventoId }) => {
    const [novoComentario, setNovoComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [showComentarios, setShowComentarios] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    const auth = getAuth();
    const userPhoto = auth.currentUser?.photoURL;

    const handleBuscarComentarios = async () => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/comentarios/evento/${eventoId}`);
            if (!response.ok) throw new Error("Erro ao buscar comentários");

            const comentariosData = await response.json();

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

            if (!response.ok) throw new Error("Erro ao publicar comentário");

            setNovoComentario(""); 
            handleBuscarComentarios();
        } catch (error) {
            console.error("Erro ao publicar comentário:", error);
        }
    };

    const toggleshowComentarios = () => {
        if (!showComentarios) {
            handleBuscarComentarios();
        }
        setShowComentarios(!showComentarios);
    };

    useEffect(() => {
        if (eventoId) {
            handleBuscarComentarios();
        }
    }, [eventoId]);

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy HH:mm");
    };

    const handleOpenReportModal = (comentario) => {
        setReportTarget(comentario);
        setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
        setReportTarget(null);
    };

    return (
        <div className="comment-section">
            <div className="comment-input">
                <img 
                    src={userPhoto || user_non_Photo} 
                    className="user-avatar" 
                    alt="foto do usuário" 
                />
                <textarea 
                    className="comment-textarea" 
                    placeholder="Comente aqui..." 
                    value={novoComentario} 
                    onChange={(e) => setNovoComentario(e.target.value)} 
                />
            </div>
            <div className="comment-actions">
                <button className="button button-publicar" onClick={handlePublicarComentario}>Publicar</button>
                <button className="button button-visualizar" onClick={toggleshowComentarios}>
                    {showComentarios ? "Ocultar comentários" : `Exibir comentários (${comentarios.length})`}
                </button>
            </div>

            {showComentarios && (
                <div className="comment-list">
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div key={comentario._id} className="comment-item">
                                <div className="comment-header">
                                    <img src={comentario.usuario?.photoUrl || user_non_Photo} alt="Foto do usuário" className="user-avatar"/>           
                                    <div className="comment-info">
                                        <h3>{comentario.usuario?.nome} {comentario.usuario?.sobrenome}</h3>
                                        <span className="comment-date">
                                            {comentario.data_criacao ? formatarData(comentario.data_criacao) : "Data indefinida"}
                                        </span>
                                    </div>
                                    <button 
                                        className="report-btn"
                                        onClick={() => handleOpenReportModal(comentario)}
                                    >
                                        Denunciar
                                    </button>
                                </div>
                                <div className="comment-content">
                                    <p>{comentario.conteudo}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-comments">Nenhum comentário encontrado para este evento.</p>
                    )}
                </div>
            )}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={handleCloseReportModal}
                targetId={reportTarget?.usuario_id}
                targetType="comentario"
                comentarioId={reportTarget?._id}
            />
        </div>
    );
};

export default Coment;



