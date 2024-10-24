import React from "react";
import "./../css/Ongpage.css";

import Avatar from "./../assets/images/ongpfp.png";
import GPSicon from "./../assets/images/gps-icon.svg";
import CATEicon from "./../assets/images/category-icon.svg";
import FLWSicon from "./../assets/images/followers-icon.svg";
import FACEicon from "./../assets/images/face-icon.svg";
import INSTAicon from "./../assets/images/insta-icon.svg";
import TWTicon from "./../assets/images/x-icon.svg";

const Ongpage = () => {
    return(
        <>
            <div className="ong-content">
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
                            <a><img src={TWTicon} alt="Ícone do Twitter" id="twt-icon" /></a>
                            <a><img src={INSTAicon} alt="Íconde do Instagram" id="insta-icon" /></a>
                            <a><img src={FACEicon} alt="" id="face-icon" /></a>
                        </div>
                        <button id="flw-btn">Seguir</button>
                    </div>
                </div>
                <hr id="ong-line" />
            </div>

            <div className="about-ong">
                <h2 id="about-title" className="blue">Sobre a ONG:</h2>
                <p id="about-text" className="blue">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus quasi sint, pariatur eveniet ratione doloremque quos est vel assumenda, cumque cum exercitationem dolorem adipisci neque consectetur culpa consequatur modi sit?Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, possimus! Sit facilis delectus dolores voluptatum corporis reprehenderit cum nihil obcaecati quibusdam ducimus quae ab, laborum molestias maxime omnis officia dolorem? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti, corrupti eius eum amet in ratione rerum voluptatem iusto recusandae. Necessitatibus at exercitationem corporis odio molestiae officia sit tempora consequatur facere! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium itaque accusantium quod, optio tempora voluptatum dolorem minima aut amet natus, deleniti fugit non laboriosam unde error voluptates sint necessitatibus harum. 
                </p>
            </div>
        </>
    )
}

export default Ongpage;