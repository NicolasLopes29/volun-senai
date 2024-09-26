import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import defaultProfileImage from "../assets/images/photo-perfil.png"; // Corrigindo o nome da imagem padrão
import EditPinIcon from "../assets/images/edit-pin.png";
import { Link } from "react-router-dom";

import "../css/Usuario.css";
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
    const [user, setUser] = useState(null);
    const [ativarComp, setAtivarComp] = useState("Histórico");

    const navigate = useNavigate();

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImagePreview(URL.createObjectURL(file)); 
        }
    };
    
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

    const handleComponentChange = (InformacaoPessoal) => {
        setAtivarComp(InformacaoPessoal);
    };

    return (
        <>
            <Navbar />
            <div className="usuario-container">
                <section className="usuario-section">
                    <div className="usuario-info">
                        <div className="usuario-picture">
                            <img src={profileImagePreview} alt="Foto de Perfil" className="usuario-picture-img" />
                            <label className="usuario-edit">
                                <input type="file" onChange={handleProfileImageChange} style={{ display: "none" }} />
                                <img src={EditPinIcon} alt="Editar" className="usuario-icon" />
                            </label>
                        </div>
                        <div className="usuario-dados">
                            <h3>Nome: {userData.nome} {userData.sobrenome}</h3>
                            <p>Cidade: </p>
                            <p>Email: {user?.email}</p>
                            <p>Telefone: ({userData.ddd})-{userData.telefone} </p>
                        </div>
                    </div>
                    <div className="usuario-nav">
                        <Link to={"Historico"} onClick={() => handleComponentChange(Historico)}>Histórico</Link>
                        <Link to={"Informacao"} onClick={() => handleComponentChange(InformacaoPessoal)}>Informações Pessoais</Link>
                    </div>
                </section>
                <article className="usuario-article">
                    <div>
                        {activeComponent === Historico && <Historico />}
                        {activeComponent === InformacaoPessoal && <InformacaoPessoal />}
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
}


export default Usuario;