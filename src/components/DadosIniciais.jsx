import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../services/firebase-config";
import defaultProfileImage from "../assets/images/photo-perfil.png"; // Corrigindo o nome da imagem padrão
import EditPinIcon from "../assets/images/edit-pin.png"; 
import "./../css/DadosIniciais.css";

const DadosIniciais = ({ onEmailVerificacao }) => {
    const [cadastrarEmail, setCadastrarEmail] = useState("");
    const [cadastrarSenha, setCadastrarSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState("");
    const [profileImage, setProfileImage] = useState(null); 
    const [profileImagePreview, setProfileImagePreview] = useState(defaultProfileImage); // Definindo a imagem padrão

    const navigate = useNavigate();

    const validarEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file)); // Gerar URL de pré-visualização
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cadastrarEmail.trim() || !cadastrarSenha.trim() || !confirmarSenha.trim()) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (!validarEmail(cadastrarEmail)) {
            setErro("Formato de email inválido.");
            return;
        }

        if (cadastrarSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, cadastrarEmail, cadastrarSenha);
            const user = userCredential.user;

            await sendEmailVerification(user);

            onEmailVerificacao();

            setSucesso("Cadastro realizado com sucesso! Verifique seu email para ativar a conta.");
            setErro(null);

        } catch (error) {
            setErro("Erro ao cadastrar: " + error.message);
            setSucesso(false);
        }
    };

    return (
        <>
            <div className="dados-iniciais-container">
                <div className="dados-iniciais-formulario">
                    <div className="dados-iniciais-picture-container">
                        <div className="dados-iniciais-picture">
                            <img src={profileImagePreview} alt="Foto de Perfil" className="profile-picture-img" />
                            <label className="edit-button">
                                <img src={EditPinIcon} alt="Editar" className="edit-icon" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                    className="profile-picture-input"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="dados-iniciais-input-container">
                        <label htmlFor="cadastrarEmail">E-mail: </label>
                        <input
                            type="email"
                            name="cadastrarEmail"
                            value={cadastrarEmail}
                            onChange={(e) => setCadastrarEmail(e.target.value)}
                        />
                    </div>
                    <div className="dados-iniciais-input-container">
                        <label htmlFor="cadastrarSenha">Senha: </label>
                        <input
                            type="password"
                            name="cadastrarSenha"
                            value={cadastrarSenha}
                            onChange={(e) => setCadastrarSenha(e.target.value)}
                        />
                    </div>
                    <div className="dados-iniciais-input-container">
                        <label htmlFor="confirmarSenha">Confirmar a Senha: </label>
                        <input
                            type="password"
                            name="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    </div>
                    {sucesso && <p>{sucesso}</p>}
                    {erro && <p>{erro}</p>}
                </div>
                <div className="dados-iniciais-botao-container">
                    <button type="submit" onClick={handleSubmit}>Próximo</button>
                </div>
            </div>
        </>
    );
};

export default DadosIniciais;
