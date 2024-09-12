import React, { useState } from "react";
import Logo from "./../assets/logos/logo-name.svg";
import "./../css/Recuperacao.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./../services/firebase-config"; // Certifique-se de importar corretamente o auth do Firebase

const Recuperacao = ({ fecharRecup }) => {
    const [recuperacaoEmail, setRecuperacaoEmail] = useState("");
    const [emailEnviado, setEmailEnviado] = useState(false);

    const handleEnviarEmail = async () => {
        if (recuperacaoEmail.trim() === "") {
            alert("Por favor, insira um email válido.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, recuperacaoEmail);
            setEmailEnviado(true); // Mostrar a mensagem de sucesso
        } catch (error) {
            alert("Erro ao enviar o email de recuperação. Tente novamente.");
        }
    };

    const handleContinuar = () => {
        window.location.reload(); 
    };

    return (
        <>
            <div className="recuperacao-container">
                <div className="recuperacao-header">
                    <button onClick={fecharRecup}>X</button>
                </div>
                <img src={Logo} alt="Logo" />
                <div className="recuperacao-main">
                    <h3>RECUPERAÇÃO DE SENHA</h3>
                    <p>Insira o email para a recuperação de senha: </p>
                    <div className="recuperacao-form">
                        <input
                            id="recup-label"
                            type="email"
                            name="recup-label"
                            value={recuperacaoEmail}
                            onChange={(e) => setRecuperacaoEmail(e.target.value)}
                        />
                        <button onClick={handleEnviarEmail}>Enviar</button>
                    </div>
                    {emailEnviado && (
                        <div className="notificacao-sucesso">
                            <p>Um email de recuperação foi enviado para o seu correio eletrônico.</p>
                            <button onClick={handleContinuar}>Continuar</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Recuperacao;
