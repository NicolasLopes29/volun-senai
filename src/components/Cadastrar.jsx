import React, { useState } from "react";
import Logo from "./../assets/logos/logo-name.svg"
import "./../css/Cadastrar.css";
import axios from "axios";
import { useNavigate } from "react-router";

const Cadastrar = ({ fecharCadastrar }) => {
    const [cadastrarEmail, setCadastrarEmail] = useState("");
    const [cadastrarSenha, setCadastrarSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState(false);
    
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (confirmarSenha === cadastrarSenha) {
            try {
                const response = await axios.post("https:\\volun-api-eight.vercel.app/login/create", {
                    email: cadastrarEmail,
                    password: cadastrarSenha,
                });

                if (response.status === 201) {
                    setSucesso(true);
                    setErro(false);
                    navigate("./DadosPessoal.jsx");
                    // Optionally, reset the form or close the modal
                }
            }
            catch (error) {
                setSucesso(true);
                setErro(false);
            }
        }
        else {
            setErro(true);
            setSucesso(false);
        }
    }

    return (
        <>
            <div className="cadastrar-container">
                <div className="cadastrar-header">
                    <button onClick={fecharCadastrar}>X</button>
                </div>
                <img src={Logo} alt="Logo"/>
                <div className="cadastrar-formulario" onSubmit={handleSubmit}>
                    <div className="cadastrar-input-container">
                        <label htmlFor="cadastrarEmail">E-mail: </label>
                        <input type="email" name="cadastrarEmail" value={cadastrarEmail} onChange={(e) => setCadastrarEmail(e.target.value)}/>
                    </div>
                    <div className="cadastrar-input-container">
                        <label htmlFor="cadastrarSenha">Senha: </label>
                        <input  type="password" name="cadastrarSenha" value={cadastrarSenha} onChange={(e) => setCadastrarSenha(e.target.value)}/>
                    </div>
                    <div className="cadastrar-input-container">
                        <label htmlFor="confirmarSenha">Confirmar a Senha: </label>
                        <input type="password" name="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}/>
                    </div>
                    <div className="cadastrar-botao-container">
                        <button type="submit" onClick={handleSubmit}>CADASTRAR</button>
                    </div>
                    {sucesso && <p>Cadastro realizado com sucesso!</p>}
                    {erro && <p>Ocorreu um erro no cadastro.</p>}
                </div>
            </div>
        </>
    );
}

export default Cadastrar;