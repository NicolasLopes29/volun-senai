
import React, { useState } from "react";

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../services/firebase-config"; // Importa a configuração do Firebase

const DadosIniciais = () => {
    const [cadastrarEmail, setCadastrarEmail] = useState("");
    const [cadastrarSenha, setCadastrarSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    // Validação de email
    const validarEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
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

            setSucesso("Cadastro realizado com sucesso! Verifique seu email para ativar a conta.");
            setErro(null);

            // Redireciona para a página de dados pessoais após o envio do email de verificação
            navigate("/dados_pessoal");

        } catch (error) {
            setErro("Erro ao cadastrar: " + error.message);
            setSucesso(false);
        }
    };

    return (
        <>
            <div className="dados-iniciais-container">
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
                    <button type="submit" onClick={handleSubmit}>Enviar</button>
                </div>
            </div>
        </>
    );
    
};

export default DadosIniciais;
