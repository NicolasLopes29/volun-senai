import React from "react";
import Logo from "./../assets/logos/logo-name.svg"
import "./../css/Recuperacao.css"


const Recuperacao = ({ fecharRecup }) => {
    return (
        <>
            <div className="recuperacao-container">
                <div className="recuperacao-header">
                    <button onClick={fecharRecup}>X</button>
                </div>
                <img src={Logo} alt="Logo"/>
                <div className="recuperacao-main">                    
                    <h3>RECUPERAÇÃO DE SENHA</h3>
                    <p>Insira o email para a recuperação de senha: </p>
                    <div className="recuperacao-form">
                        <input id="recup-label" type="email" name="recup-label" />
                        <button onClick={"recupEmail"}>Enviar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Recuperacao