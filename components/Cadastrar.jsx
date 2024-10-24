import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DadosIniciais from "./DadosIniciais";
import { auth } from "../services/firebase-config"; // Firebase Authentication
import "./../css/Cadastrar.css";
import DadosPessoal from "./DadosPessoal";

const Cadastrar = () => {
    const [passo, setPasso] = useState(1);
    const [emailVerificado, setEmailVerificado] = useState(false);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (passo === 2) {
            const verificarEmail = async () => {
                try {
                    const user = auth.currentUser;
                    await user.reload(); // Atualiza os dados do usuário

                    if (user.emailVerified) {
                        setEmailVerificado(true);
                        navigate("/dados_pessoal"); // Redireciona para a próxima etapa
                    }
                } catch (error) {
                    setErro("Erro ao verificar e-mail: " + error.message);
                }
            };

            const intervalo = setInterval(verificarEmail, 5000); // Checa a verificação do e-mail a cada 5 segundos

            return () => clearInterval(intervalo); // Limpa o intervalo quando o componente for desmontado
        }
    }, [passo, navigate]);

    const irParaVerificacaoEmail = () => {
        setPasso(2); // Avança para a etapa de verificação de e-mail
    };

    const irParaDadosPessoal = () => {
        setPasso(3);
    }

    const PaginaRender = () => {
        if (passo === 1) {
            return (
                <div className="cadastrar-section">
                    <h3>Etapa 1: Dados Iniciais</h3>
                    <DadosIniciais onEmailVerificacao={irParaVerificacaoEmail} />
                </div>
            );
        } 
        else if (passo === 2) {
            return (
                <div className="verificacao-container">
                    <h3>Verificação de E-mail</h3>
                    <p>
                        Por favor, verifique seu e-mail e clique no link de ativação enviado para continuar.
                    </p>
                    {erro && <p>{erro}</p>}
                    {emailVerificado ? (
                        <p>E-mail verificado com sucesso! Redirecionando para a próxima etapa...</p>
                    ) : (
                        <p>Aguardando verificação de e-mail...</p>
                    )}
                    
                </div>
            );
        }
        else if (passo === 3){
            if (setEmailVerificado === true){
                return (
                    <div className="cadastrar-pessoal">
                        <h3>Dados Pessoais</h3>
                        <DadosPessoal />
                    </div>
                );
            }
        }
        
    };

    return (
        <div>
            <main className="cadastrar-container">
                <div>{PaginaRender()}</div>
            </main>
        </div>
    );
};

export default Cadastrar;
