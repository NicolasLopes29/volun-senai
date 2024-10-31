import React, { useState } from "react";
import './../css/Card.css';
import Members from './../assets/images/members-icon.svg';
import Calendar from './../assets/images/calendar-icon.svg';
import ArrowDown from './../assets/images/arrow-down.svg';
import { Link } from 'react-router-dom';

const Card = ({ titulo, descricao, ongNome, dataInicio, imgUrl, vagaLimite }) => {

    const truncateText = (text, limit) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.substring(0, limit) + "...";
      };

    return (
        <div className="card">
            <div className="card-capa" style={{backgroundImage: `url(${imgUrl})`}}>
                <p><span className="card-title">{titulo}</span><span id="card-edit"></span></p>
            </div>
            <div className="card-text">
           <p className="card-description">{truncateText(descricao, 100)}</p>
                <div className="card-text-first">
                    <strong>Por {ongNome}</strong>
                    <strong className="date-container">
                        <img src={Calendar} alt="Íconde de calendário" />
                        <span>
                            {dataInicio}
                        </span>
                    </strong>
                </div>
                <div className="card-text-second">
                    <span>São Paulo, Rua dos Banzeiros</span>
                    <span className="members-container">
                        <img src={Members} alt="Ícone de membros" />

                        <strong className="bold">
                            {vagaLimite}
                        </strong>
                    </span>
                </div>
            </div>
            <button className="card-details">
                <Link to="/detalhes_eventos" id="card-link">Ver detalhes</Link>
                <img src={ArrowDown} alt="Ícone de seta para baixo" />
            </button>
        </div>

    )
}

export default Card;