import React from "react";
import Navbar from "./Navbar";  // Certifique-se de que os caminhos estejam corretos
import Footer from "./Footer";
import "./../css/Loader.css";

const Loader = () => {
    return (
        <>
            <Navbar />  {/* Renderiza o Navbar */}
            <div className="loader-container">
                <p>Carregando</p>
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <Footer />  {/* Renderiza o Footer */}
        </>
    );
};

export default Loader;
