import React from "react";

const Recuperacao = (fecharRecup) => {
    return (
        <>
            <div>
                <div>
                    <a href="recup-fechar" onClick={fecharRecup}>X</a>
                </div>
                <div>
                    <label htmlFor="recup-label">Insira o email</label>
                    <input id="recup-label" type="email" name="recup-label"/>
                    <button onClick={recupEmail}>Enviar</button>
                </div>
            </div>
            
        </>
    );
}

export default Recuperacao;