import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import defaultProfileImage from "../assets/images/photo-perfil.png"; // Corrigindo o nome da imagem padrão
import EditPinIcon from "../assets/images/edit-pin.png"; 

import "./../css/Usuario.css";
import Footer from "./Footer";
import Navbar from "./Navbar";


const Usuario = () => {
    const [profileImage, setProfileImage] = useState(null); 
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage); 
    
    const [userData, setUserData] = useState({
        nome: '',
        sobrenome: '',
        ddd: '',
        telefone: '',
        email: '',
        photoURL: '',
    });
    const [authData, setAuthData] = useState({});

    useEffect (() => {
        handleGetUsers();
    }, [])

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleGetUsers = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
            setAuthData({
                email: user.email,
                photoURL: user.photoURL || defaultProfileImage,
            });

            try {
                const userID = user.uid;
                const db = getFirestore();
                const userDOC = await getDoc(doc(db, "usuarios", userID));

                if (userDOC.exists()){
                    const userDataFromFirestore = userDOC.data();
                    setUserData({
                        ...userDataFromFirestore,
                        email, // Adiciona o email ao objeto de dados do usuário
                        photoURL // Adiciona a foto de perfil ao objeto de dados do usuário
                    });
                }
                else {
                    alert("Usuário não encontrado");
                }
            }
            catch (error){
                alert("Erro ao buscar dados", error);
            }
        }
        else {
            alert("Nenhum usuário autenticado!");
        }
    }

    return (
        <>
            <Navbar />
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
                        <h3>Nome: {userData.nome} {userData.sobrenome}</h3>
                        <div>
                            <p>Cidade: {userData.cidade} </p>
                            <p>Email: {userData.email}</p>
                            <p>Telefone: {userData.telefone}</p>
                        </div>
                    </div>
                </section>
                <article className="usuario-article">
                    <div>

                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
}

export default Usuario