import React from "react";
import './../css/Card.css';
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Members from './../assets/images/members-icon.svg';
import Calendar from './../assets/images/calendar-icon.svg';
import ArrowDown from './../assets/images/arrow-down.svg';

const Card = ({ id, titulo, descricao, ongNome, dataInicio, imgUrl, vagaLimite, endereco}) => {

    const truncateText = (text, limit) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.substring(0, limit) + "...";
      };

    //   isso aqui vai formatar a data e hora para o nosso formato padrão
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
            <button className="card-details-x">
                <Link to={`/detalhes_eventos/${id}`} id="card-link">Ver detalhes</Link>
                <img src={ArrowDown} alt="Ícone de seta para baixo" />
            </button>
        </div>
    );
    
}

export default Card;
