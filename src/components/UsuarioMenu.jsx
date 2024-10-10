import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultProfileImage from "../assets/images/photo-perfil.png";
import "../css/UsuarioMenu.css";

const UsuarioMenu = () => {
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
    });
    const [usuarioLogado, setUsuarioLogado] = useState(false); 
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState(defaultProfileImage);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleUserLogOut = () => {
        const auth = getAuth(); 
        signOut(auth)
            .then(() => {
                console.log("Usuário deslogado com sucesso!");
                navigate("/"); 
                window.location.reload();
            })
            .catch((error) => {
                console.error("Erro ao deslogar: ", error);
            });
    }

    const handleGetUser = async (uid) => {
        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData(response.data);
            setLoading(false);
        } 
        catch (error) {
            setError("Erro ao buscar dados do usuário.");
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            handleGetUser(user.uid);
            setFotoPerfilUrl(user.photoURL || defaultProfileImage);
        } else {
            setLoading(false); 
        }
    }, []); 

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="usuario-menu-container">
            <div className="usuario-menu-info">
                <div>
                    <img src={fotoPerfilUrl} alt="Foto de Perfil"/>
                </div>
                <div>
                    <p>{userData.nome} {userData.sobrenome}</p>
                </div>
            </div>
            <div className="usuario-menu-link">
                <a href="./usuario">Minha Página</a>
                <button onClick={handleUserLogOut}>Deslogar</button>
            </div>
        </div>
    );
};

export default UsuarioMenu;