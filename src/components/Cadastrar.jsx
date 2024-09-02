import React from "react"
import "./../css/Cadastrar.css";

const Cadastrar = ({ fecharCadastrar }) => {
    return (
        <>
            <div className="cadastrar-container">
                <div className="cadastrar-header">
                    <button onClick={fecharCadastrar}>X</button>
                </div>
                <div className="cadastrar-formulario">
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
            </div>
        </>
    );
}

export default Cadastrar;