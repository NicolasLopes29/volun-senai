import React, { useState } from "react";
import './../css/Card.css';

const Card = () => {
    return (
        <div className="card">
            <div className="card-capa">
                <p><span>Pegar lixo na praia</span><span></span></p>
            </div>
            <div className="card-text">
                <p><strong>Por limpa+</strong><strong>29/09/2028</strong></p>
                <p><span>São Paulo, Rua dos Banzeiros</span><strong>30</strong></p>
            </div>
        </div>
    )
}

export default Card;