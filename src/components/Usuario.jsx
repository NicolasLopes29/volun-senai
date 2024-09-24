import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Importando onAuthStateChanged para detectar mudanças de autenticação

import defaultProfileImage from "../assets/images/photo-perfil.png";
import EditPinIcon from "../assets/images/edit-pin.png";

import "./../css/Usuario.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Usuario = () => {
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage);
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        ddd: "",
        telefone: "",
    });
    const [user, setUser] = useState(null);  // Estado para armazenar o usuário logado

    const navigate = useNavigate();
    // Função para manipular a troca de imagem de perfil
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    // Função para buscar os dados do usuário na API
    const handleGetUserData = async (uid) => {
        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData(response.data);  // Define os dados do usuário obtidos da API
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        // Detectar mudanças de autenticação
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);  // Define o usuário logado
                setUserData((prevData) => ({
                    ...prevData,
                    email: currentUser.email, // Define o email diretamente do Firebase
                }));
                handleGetUserData(currentUser.uid);  // Busca os dados da API usando o UID do usuário logado
            } 
            else {
                alert("Nenhum usuário autenticado.");
                navigate("./")
            }
        });

        return () => unsubscribe();  // Limpar o listener ao desmontar o componente
    }, [navigate]);

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
                        <div>
                            <h3>Nome: {userData.nome} {userData.sobrenome}</h3>
                            <p>Telefone: ({userData.ddd})-{userData.telefone}</p>
                        </div>
                    </div>
                </section>
                <article className="usuario-article">
                    <div>
                        {/* Conteúdo adicional pode ser adicionado aqui */}
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
};

export default Usuario;
