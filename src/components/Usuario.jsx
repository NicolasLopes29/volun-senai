import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "./Loader"; 
import Historico from "./Historico";
import InformacaoPessoal from "./InformacaoPessoal";
import Correio from "./Correio";
import EditPin from "./../assets/images/edit-pin.png"

import "../css/Usuario.css";

const Usuario = () => {
    const [profileImagePreview, setProfileImagePreview] = useState("https://example.com/default-profile-image.png");
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
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);

    const navigate = useNavigate();
    const storage = getStorage();

    const avatarOptions = [
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar1.png?alt=media&token=9879ca22-1b8e-4582-ba6a-475407eb7354',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar2.png?alt=media&token=aa865b5e-5309-4cb7-a8fe-cf3a515e3f07',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar3.png?alt=media&token=ffbc3bc0-4a3f-448d-ac69-0846ae1a4276',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar4.png?alt=media&token=f9ceece1-4eb6-487e-8d39-80684536c9fb',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar5.jpg?alt=media&token=41269360-bd63-4b6f-aaf6-aa4566fef1fc',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar6.png?alt=media&token=26ccac40-4456-4bff-94d0-11a951515815',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar7.png?alt=media&token=7d794f6e-da29-4426-b1f7-2a9bc70350c6',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar8.png?alt=media&token=46a28c2a-b823-42db-92ac-b393c2738518',
        'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatars%2Favatar9.png?alt=media&token=57aaf0a1-0148-4993-89e8-3e068776f734'
        
    ];

    const getGooglePhotoURL = () => {
        if (user && user.providerData && user.providerData[0]?.photoURL) {
            return user.providerData[0].photoURL;
        }
        return null;
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
                await axios.put(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`, {
                    photoUrl: downloadURL
                });
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
                await axios.put(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`, {
                    photoUrl: avatarUrl
                });
                setShowAvatarMenu(false);
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
                setProfileImagePreview(currentUser.photoURL || "https://example.com/default-profile-image.png");
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
                             <img src={EditPin} alt="Editar foto de perfil" className="edit-icon" />
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
                    <Link to={"#"} id="correio-link" onClick={() => setActiveComponent("Correio")}>Correio</Link>
                </div>
            </section>
            <article className="usuario-article">
                {activeComponent === "Historico" ? <Historico /> : 
                 activeComponent === "Informação" ? <InformacaoPessoal /> : <Correio />}
            </article>

            {showAvatarMenu && (
                <div className="avatar-modal">
                    <button className="close-modal" onClick={() => setShowAvatarMenu(false)}>X</button>
                    <h1>Selecione o seu icone de Avatar:</h1>
                    <div className="avatar-options">
                        {googlePhotoURL && (
                            <img src={googlePhotoURL} alt="Avatar do Google" onClick={() => handleAvatarSelect(googlePhotoURL)} />
                        )}
                        {avatarOptions.map((avatarUrl, index) => (
                            <img 
                                key={index}
                                src={avatarUrl} 
                                alt={`Avatar ${index + 1}`} 
                                onClick={() => handleAvatarSelect(avatarUrl)} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuario;