import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import defaultProfileImage from "../assets/images/photo-perfil.png";
import EditPinIcon from "../assets/images/edit-pin.png";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader"; // Importa o Loader

import "./../css/Usuario.css";

const Usuario = () => {
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage);
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        ddd: "",
        telefone: "",
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para controlar erros

    const navigate = useNavigate();
    const storage = getStorage();

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && user) {
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                await updateProfile(user, {
                    photoURL: downloadURL,
                });
                setProfileImagePreview(downloadURL);
                window.location.reload();
            } catch (error) {
                console.error("Erro ao atualizar foto de perfil:", error);
            }
        }
    };

    const handleGetUserData = async (uid) => {
        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData(response.data);
            setLoading(false); // Finaliza o carregamento quando os dados forem recebidos
        } catch (error) {
            setError("Erro ao buscar dados do usuário.");
            setLoading(false); // Finaliza o carregamento em caso de erro
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserData((prevData) => ({
                    ...prevData,
                    email: currentUser.email,
                }));
                handleGetUserData(currentUser.uid);
                setProfileImagePreview(currentUser.photoURL || defaultProfileImage);
            } else {
                alert("Nenhum usuário autenticado.");
                navigate("/");
            }
        });

        // Define o timeout de 15 segundos para resposta da API
        const timeout = setTimeout(() => {
            if (loading) {
                setError("A requisição demorou muito para responder. Tente novamente mais tarde.");
                setLoading(false);
            }
        }, 15000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [navigate, loading]);

    // Renderiza o loader enquanto está carregando
    if (loading) {
        return <Loader />;
    }

    // Renderiza a mensagem de erro caso ocorra
    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-container">
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
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
                        <div>
                            <h3>Nome: {userData.nome} {userData.sobrenome}</h3>
                            <h3>Email: {user?.email}</h3>
                            <p>Telefone: ({userData.ddd})-{userData.telefone}</p>
                        </div>
                    </div>
                </section>
                <article className="usuario-article">
                    <div>
                        Palmeiras nao tem 
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
};

export default Usuario;

