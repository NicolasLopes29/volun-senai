import React, { useState } from "react";
import './../css/Card.css';
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Members from './../assets/images/members-icon.svg';
import Calendar from './../assets/images/calendar-icon.svg';
import ArrowDown from './../assets/images/arrow-down.svg';

const Card = ({ id, titulo, descricao, ongNome, dataInicio, imgUrl, vagaLimite, endereco, isOngPage, onDelete  }) => {

    const [showModal, setShowModal] = useState(false); // Estado para controlar o modal

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                // Exibe mensagem de sucesso somente quando a exclusão ocorre
                alert("Evento excluído com sucesso!");
                onDelete(id); // Remove o evento da lista na OngPage
            } else {
                // Exibe mensagem de erro para respostas não bem-sucedidas
                alert("Erro ao excluir o evento. Tente novamente.");
            }
        } catch (error) {
            // Trata erros de conexão ou outros problemas não relacionados à API
            alert("Erro ao excluir o evento. Verifique sua conexão.");
        } finally {
            setShowModal(false); // Fecha o modal após a ação
        }
    };
    
    

    const truncateText = (text, limit) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.substring(0, limit) + "...";
    };

    const formattedDate = dataInicio ? format(new Date(dataInicio), 'dd/MM/yyyy HH:mm') : "data indefinida";

    return (
        <div className="card-x">
            <div className="card-capa-img" style={{ backgroundImage: `url(${imgUrl})` }}>
                <p><span className="card-title">{titulo}</span></p>
            </div>
            <div className="card-text">
                <p className="card-description-x">{truncateText(descricao, 100)}</p>
                <div className="card-text-first">
                    <strong className="card-text-ongname">{ongNome}</strong>
                    <strong className="date-container">
                        <img src={Calendar} alt="Ícone de calendário" />
                        <span>{formattedDate}</span>
                    </strong>
                </div>
                <div className="card-text-second">
                    <span>{endereco}</span>
                    <span className="members-container">
                        <img src={Members} alt="Ícone de membros" />
                        <strong className="bold">{vagaLimite}</strong>
                    </span>
                </div>
            </div>
            {isOngPage && (
                <button className="card-ong-button" title="excluir evento" onClick={() => setShowModal(true)}>X</button>
            )}
            <button className="card-details-x">
                <Link to={`/detalhes_eventos/${id}`} id="card-link">Ver detalhes</Link>
                <img src={ArrowDown} alt="Ícone de seta para baixo" />
            </button>

            {showModal && (
                <div className="modal-card-overlay">
                    <div className="modal-card-content">
                        <h2>Confirmação de Exclusão</h2>
                        <p>Tem certeza que deseja excluir o evento <strong>{titulo}</strong>?</p>
                        <div className="modal-card-buttons">
                            <button onClick={handleDelete} className="modal-card-confirm">Confirmar</button>
                            <button onClick={() => setShowModal(false)} className="modal-card-cancel">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Card;

