import React from "react";
import { useState } from "react";

import DadosIniciais from "./DadosIniciais";
import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";
import "./../css/Cadastrar.css"

import Navbar from "./Navbar";
import Footer from "./Footer";

const Cadastrar = () => {
    const [Passo, setPasso] = useState(1);

    const ProxPasso = () => {
        if (Passo < 3 ) setPasso(Passo + 1);
    }
    const AntPasso = () => {
        if (Passo > 1) setPasso(Passo - 1);
    }

    const PaginaRender = () => {
        switch (Passo) {
            case 1:
                return (
                    <div>
                        <div className="cadastrar-section">
                            <h3>Etapa 1: Dados Iniciais</h3>
                            <DadosIniciais />
                        </div>
                        <div className="cadastrar-buttons">
                            <button onClick={ProxPasso}>Próximo</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="cadastrar-section">
                            <h3>Etapa 2: Dados Pessoais</h3>
                            <DadosPessoal />
                        </div>
                        <div className="cadastrar-buttons">
                            <button onClick={AntPasso}>Voltar</button>
                            <button onClick={ProxPasso}>Próximo</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <div className="cadastrar-section">
                            <h3>Etapa 3: Endereço</h3>
                            <DadosEndereco />
                        </div>
                        <div className="cadastrar-buttons">
                            <button onClick={AntPasso}>Voltar</button>
                            <button onClick={ProxPasso}>Próximo</button>
                        </div>    
                    </div>
                );
            default:
                return <h2>Formulário Completo!</h2>;
        }
    };

    return (
        <div>
        <Navbar />
            <main className="cadastrar-container">
                <div>
                    <PaginaRender />
                </div>        
            </main>
        <Footer />
        </div>
    );  
}

export default Cadastrar;