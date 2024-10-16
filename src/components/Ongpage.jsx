import React from "react";
import "./../css/Ongpage.css";
import Card from "./Card";
import axios from "axios";
import Avatar from "./../assets/images/ongpfp.png";
import GPSicon from "./../assets/images/gps-icon.svg";
import CATEicon from "./../assets/images/category-icon.svg";
import FLWSicon from "./../assets/images/followers-icon.svg";
import FACEicon from "./../assets/images/face-icon.svg";
import INSTAicon from "./../assets/images/insta-icon.svg";
import TWTicon from "./../assets/images/x-icon.svg";

const Ongpage = () => {
    return(
        <div className="ong-profile">
            <div className="ong-avatar">
                <img id="ong-pfp" src={ Avatar } alt="Foto de perfil da ONG" />
            </div>
            <div className="ong-info">
                <h1 id="ong-name" className="blue">Ambientados</h1>
                <h2 id="ong-date" className="blue">Fundado em: 2001/09/11</h2>
                <span id="ong-address">
                    <img src={GPSicon} id="gps-icon" alt="Ícone de GPS" />
                    <span id="ong-address-text" className="blue">Rua Bento de Andrade, 647</span>
                </span>
                <strong id="ong-genre">
                    <img src={CATEicon} id="cate-icon" alt="Ícone de categoria" />
                    <span id="ong-genre-text" className="blue">Educação</span>
                </strong>
                <span id="ong-followers">
                    <img src={FLWSicon} id="flws-icon" alt="Ícone de seguidores" />
                    <span id="ong-flws-text" className="blue">327 seguidores</span>
                </span>
            </div>
            <div className="ong-media">
                <div className="media-icons">
                    <p><img src={TWTicon} alt="Ícone do Twitter" id="twt-icon" /></p>
                    <img src={INSTAicon} alt="Íconde do Instagram" id="insta-icon" />
                    <img src={FACEicon} alt="" id="face-icon" />
                </div>
                <button id="flw-btn" className="blue">Seguir</button>
            </div>
        </div>
    )
}

export default Ongpage;