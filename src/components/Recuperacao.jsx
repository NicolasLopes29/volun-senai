import React from "react";

import "./../css/Recuperacao.css"

import Navbar from "./Navbar";
import Footer from "./Footer";

const Recuperacao = () => {
    return (
        <>
            <Navbar />
                <main className="recuperacao-container">
                    <h3>RECUPERAÇÃO DE SENHA</h3>
                    <p>Insira o email para a recuperação de senha: </p>
                    <div className="recuperacao-form">
                        <input id="recup-label" type="email" name="recup-label" />
                        <button onClick={"recupEmail"}>Enviar</button>
                    </div>
                </main>
            <Footer />
        </>
    );
}

export default Recuperacao