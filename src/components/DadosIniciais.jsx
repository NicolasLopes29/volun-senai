import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../services/firebase-config"; // Importa a configuração do Firebase
import "./../css/DadosIniciais.css";

const DadosIniciais = ({ onEmailVerificacao }) => {
    const [cadastrarEmail, setCadastrarEmail] = useState("");
    const [cadastrarSenha, setCadastrarSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState("");
    const [profileImage, setProfileImage] = useState(null); // Para armazenar a imagem de perfil
    const [profileImagePreview, setProfileImagePreview] = useState(null); // Para exibir a pré-visualização da imagem

    const navigate = useNavigate();

    // Validação de email
    const validarEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    // Lidar com a seleção da imagem de perfil
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file)); // Gerar URL de pré-visualização
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica se os campos não estão vazios
        if (!cadastrarEmail.trim() || !cadastrarSenha.trim() || !confirmarSenha.trim()) {
            setErro("Preencha todos os campos.");
            return;
        }

        // Verifica o formato do email
        if (!validarEmail(cadastrarEmail)) {
            setErro("Formato de email inválido.");
            return;
        }

        // Verifica se as senhas coincidem
        if (cadastrarSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            // Criação do usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, cadastrarEmail, cadastrarSenha);
            const user = userCredential.user;

            // Envio de email de verificação
            await sendEmailVerification(user);

            // Chama a função para ativar a página de espera
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
                <div className="profile-picture-container">
                    {/* Div Circular para Exibir a Foto de Perfil */}
                    <div className="profile-picture">
                        {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Foto de Perfil" className="profile-picture-img" />
                        ) : (
                            <span>Selecionar Imagem</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="profile-picture-input"
                    />
                </div>

                <div className="dados-iniciais-formulario">
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
