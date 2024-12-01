import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"; // Adicionado updateProfile
import { auth } from "../services/firebase-config";
import defaultProfileImage from "../assets/avatars/avatar1.png"; // Imagem de perfil padrão
import logo from "../assets/logos/logo-small.svg"; // Logo do site
import "./../css/DadosIniciais.css";

const DadosIniciais = ({ onEmailVerificacao }) => {
    const [cadastrarEmail, setCadastrarEmail] = useState("");
    const [cadastrarSenha, setCadastrarSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState("");

    // Validação de email
    const validarEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
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

            // Enviar email de verificação
            await sendEmailVerification(user);

            // Atualizar o perfil com a imagem de perfil padrão
            await updateProfile(user, {
                photoURL: defaultProfileImage, // Enviando a imagem padrão para o Firebase Auth
            });

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
                <div className="dados-iniciais-formulario">
                    <div className="dados-iniciais-logo-container">
                        {/* Exibir logo no lugar da imagem de perfil */}
                        <img src={logo} alt="Logo do site" className="site-logo" />
                    </div>
                    <div className="input-field">
                        <input
                            required
                            type="email"
                            name="cadastrarEmail"
                            value={cadastrarEmail}
                            onChange={(e) => setCadastrarEmail(e.target.value)}
                        />
                        <label>E-mail</label>
                    </div>
                    <div className="input-field">
                        <input
                            required
                            type="password"
                            name="cadastrarSenha"
                            value={cadastrarSenha}
                            onChange={(e) => setCadastrarSenha(e.target.value)}
                        />
                        <label>Senha</label>
                    </div>
                    <div className="input-field">
                        <input
                            required
                            type="password"
                            name="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                        <label>Confirmar a Senha</label>
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
