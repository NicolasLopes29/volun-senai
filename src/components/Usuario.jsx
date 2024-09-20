import React, { useState } from "react";

import defaultProfileImage from "../assets/images/photo-perfil.png"; // Corrigindo o nome da imagem padrão
import EditPinIcon from "../assets/images/edit-pin.png"; 

import "./../css/Usuario.css";

const Usuario = () => {
    const [profileImage, setProfileImage] = useState(null); 
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage); 
    
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file)); 
    };
    
    return (
        <>
            <div className="usuario-container">
                <section className="usuario-section">
                    <div className="usuario-picture">
                        <img src={profileImagePreview} alt="Foto de Perfil" className="usuario-picture-img" />
                        <label className="usuario-edit">
                            <img src={EditPinIcon} alt="Editar" className="usuario-icon" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="profile-picture-input"
                            />
                        </label>
                    </div>
                    <div className="usuario-dados">
                        <h3>Nome: </h3>
                        <div>
                            <p>Cidade: </p>
                            <p>Email: </p>
                            <p>Telefone: </p>
                        </div>
                    </div>
                </section>
                <article className="usuario-article">
                    <div>

                    </div>
                </article>
            </div>
        </>
    );
}

export default Usuario