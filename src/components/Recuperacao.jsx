import React from "react";

import "./../css/Recuperacao.css"

import Navbar from "./Navbar";
import Footer from "./Footer";

const Recuperacao = () => {
    return (
        <>
            <Navbar />
                <main className="recuperacao-container">
                    <div className="recuperacao-form">
                        <label htmlFor="recup-label">Insira o email: </label>
                        <input id="recup-label" type="email" name="recup-label" />
                        <button onClick={"recupEmail"}>Enviar</button>
                    </div>
                </main>
            <Footer />
        </>
    );
}

export default Recuperacao