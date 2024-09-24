import React from "react"
import Logo from "./../assets/images/logo.svg";
import "./../css/Cadastrar.css";

const Cadastrar = () => {

    return (
        <>
            <main className="cadastrar-container">
                <div className="cadastrar-formulario">
                    <img className="cadastrar-logo" src={Logo} alt="Logo"/>
                    <div className="cadastrar-input-container">
                        <label htmlFor="cadastrar-email">E-mail: </label>
                        <input id="cadastrar-email" type="email"/>
                    </div>
                    <div className="cadastrar-input-container">
                        <label htmlFor="cadastrar-senha">Senha: </label>
                        <input id="cadastrar-senha" type="password"/>
                    </div>
                    <div className="cadastrar-input-container">
                        <label htmlFor="confirmar-senha">Confirmar a Senha: </label>
                        <input id="confirmar-senha" type="password"/>
                    </div>
                    <div className="cadastrar-botao-container">
                        <button>CADASTRAR</button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Cadastrar;