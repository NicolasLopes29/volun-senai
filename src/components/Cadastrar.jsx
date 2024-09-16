import React from "react";
import { useState } from "react";

import DadosIniciais from "./DadosIniciais";
import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";
import "./../css/Cadastrar.css"

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
                        <div>
                            <h2>Etapa 1: Dados Iniciais</h2>
                            <DadosIniciais />
                        </div>
                        <div>
                            <button disabled></button>
                            <button onClick={ProxPasso}>Proximo Passo</button>
                        </div>
                    </div>
                    
                );
            case 2:
                return (
                    <div>
                        <div>
                            <h2>Etapa 2: Dados Pessoais</h2>
                            <DadosPessoal />
                        </div>
                        <div>
                            <button onClick={AntPasso}>Voltar</button>
                            <button onClick={ProxPasso}>Proximo</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <div>
                            <h2>Etapa 3: Endereço</h2>
                            <DadosEndereco />
                        </div>
                        <div>
                            <button onClick={AntPasso}>Voltar</button>
                            <button onClick={ProxPasso}>Proximo</button>
                        </div>
                        
                    </div>
                );
            default:
                return <h2>Formulário Completo!</h2>;
        }
    };

    return (
        <div className="cadastrar-background">
          <main className="cadastrar-container">
            <div>
              <PaginaRender />
            </div>        
          </main>
        </div>
      );
      
}

export default Cadastrar;