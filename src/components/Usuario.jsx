import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultProfileImage from "../assets/images/photo-perfil.png";
import avatar1 from "../assets/avatars/avatar1.png"; // Avatares padrão
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.png";
import avatar7 from "../assets/avatars/avatar7.png";
import avatar8 from "../assets/avatars/avatar8.png";
import avatar9 from "../assets/avatars/avatar9.png";
import editIcon from "../assets/images/edit-icon.svg";
import Loader from "./Loader"; 
import Historico from "./Historico";
import InformacaoPessoal from "./InformacaoPessoal";

import "../css/Usuario.css";

const Usuario = () => {
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage);
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        ddd: "",
        telefone: "",
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [activeComponent, setActiveComponent] = useState("Historico");
    const [showAvatarMenu, setShowAvatarMenu] = useState(false); // Estado para o modal de avatares

    const navigate = useNavigate();
    const storage = getStorage();

    const getGooglePhotoURL = () => {
        if (user && user.providerData && user.providerData[0]?.photoURL) {
            return user.providerData[0].photoURL;
        }
        return null; // Retorna null se o usuário não tiver foto do Google
    };

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

    const handleAvatarSelect = async (avatarUrl) => {
        if (user) {
            try {
                await updateProfile(user, {
                    photoURL: avatarUrl,
                });
                setProfileImagePreview(avatarUrl);
                setShowAvatarMenu(false); // Fecha o modal
                window.location.reload();
            } catch (error) {
                console.error("Erro ao atualizar avatar:", error);
            }
        }
    };

    const handleGetUserData = async (uid) => {
        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData(response.data);
            setLoading(false); 
        } catch (error) {
            setError("Erro ao buscar dados do usuário.");
            setLoading(false); 
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
            }
        });

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

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    const googlePhotoURL = getGooglePhotoURL();

    return (
        <div className="usuario-container">
            <section className="usuario-section">
                <div className="usuario-info">
                    <div className="usuario-picture">
                        <img src={profileImagePreview} alt="Foto de Perfil" className="usuario-picture-img" />
                        <label className="usuario-edit">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="profile-picture-input"
                                style={{ display: "none" }}
                            />
                        </label>
                        <button className="avatar-menu-button" onClick={() => setShowAvatarMenu(!showAvatarMenu)}>
                             <img src={editIcon} alt="Editar foto de perfil" className="edit-icon" />
                        </button>
                    </div>
                    <div className="usuario-dados">
                        <h3>Nome: {userData.nome} {userData.sobrenome}</h3>
                        <p>Email: {user?.email}</p>
                        <p>Telefone: ({userData.ddd})-{userData.telefone}</p>
                    </div>
                </div>
                <div className="usuario-nav">
                    <Link to={"#"} id="historico-link" onClick={() => setActiveComponent("Historico")}>Histórico</Link>
                    <Link to={"#"} id="informacao-link" onClick={() => setActiveComponent("Informação")}>Informações Pessoais</Link>
                </div>
            </section>
            <article className="usuario-article">
                {activeComponent === "Historico" ? <Historico /> : <InformacaoPessoal />}
            </article>

            {showAvatarMenu && (
                <div className="avatar-modal">
                    <h1>Selecione o seu icone de Avatar:</h1>
                    <div className="avatar-options">
                        {googlePhotoURL && ( // Só exibe se existir foto do Google
                            <img src={googlePhotoURL} alt="Avatar do Google" onClick={() => handleAvatarSelect(googlePhotoURL)} />
                        )}
                        <img src={avatar1} alt="Avatar 1" onClick={() => handleAvatarSelect(avatar1)} />
                        <img src={avatar2} alt="Avatar 2" onClick={() => handleAvatarSelect(avatar2)} />
                        <img src={avatar3} alt="Avatar 3" onClick={() => handleAvatarSelect(avatar3)} />
                        <img src={avatar4} alt="Avatar 4" onClick={() => handleAvatarSelect(avatar4)} />
                        <img src={avatar5} alt="Avatar 5" onClick={() => handleAvatarSelect(avatar5)} />
                        <img src={avatar6} alt="Avatar 6" onClick={() => handleAvatarSelect(avatar6)} />
                        <img src={avatar7} alt="Avatar 7" onClick={() => handleAvatarSelect(avatar7)} />
                        <img src={avatar8} alt="Avatar 8" onClick={() => handleAvatarSelect(avatar8)} />
                        <img src={avatar9} alt="Avatar 9" onClick={() => handleAvatarSelect(avatar9)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuario;

