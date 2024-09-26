import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const [user, setUser] = useState(null);
    
    const navigate = useNavigate();
    const storage = getStorage();

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && user) {
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            try {
                // Faz upload da imagem no Firebase Storage
                await uploadBytes(storageRef, file);
                
                // Obtém a URL de download da imagem
                const downloadURL = await getDownloadURL(storageRef);
                
                // Atualiza a foto de perfil no Firebase Authentication
                await updateProfile(user, {
                    photoURL: downloadURL,
                });
                
                // Atualiza a pré-visualização da imagem
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
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
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

        return () => unsubscribe();
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
