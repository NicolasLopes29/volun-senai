import React, { useState } from "react";
import "./../css/Eventos.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE",
    "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
    "SC", "SP", "SE", "TO"
  ];

  const Eventos = () => {
    const [estadoSelecionado, setEstadoSelecionado] = useState('');

    const handleChange = (event) => {
        setEstadoSelecionado(event.target.value);
    }; 

   return(
    <>
        <Navbar />
        <div class="Filtro-Eventos">
            <h1 className="Eventos-h1">Pesquise aqui</h1>
            <section className="arrumar-tudo">
                <div className="Eventos-input-filtro">
                    <input required type="text" name="text" className="Eventos-input"/>
                    <label className="Eventos-user-label">Área de atuação</label>
                </div>
                <div className="Eventos-input-filtro">
                    <input required type="text" name="text" autoComplete="off" className="Eventos-input"/>
                    <label className="Eventos-user-label">Categoria</label>
                </div>
                <div className="Eventos-input-filtro">
                    <input required type="text" name="text" autoComplete="off" className="Eventos-input"/>
                    <label className="Eventos-user-label">Cidade</label>
                </div>
                <div className="Eventos-select">
                    <select className="Eventos-estado-busca" value={estadoSelecionado} onChange={handleChange}>
                        <option value="">Estado</option>
                            {estados.map((estado, index) => (
                                <option key={index} value={estado}>
                                    {estado}
                                </option>
                            ))};
                    </select>
                    <select className="Eventos-tipo">
                        <option>Tipo de evento</option>
                        <option>Tetra campeão</option>
                        <option>One Piece o Melhor anime</option>
                        <option>coordenadas -64</option>
                    </select>
                </div>    
                <div className="Eventos-arrumar-botão">
                <button className="Eventos-button-buscar">Buscar</button>
                </div>
            </section>

            <div className="Eventos-resultado-pesquisa-texto">
                <h1>Resultado da pesquisa</h1>
                <h3>Foram acahdos XX resultados referentes a sua busca</h3>
                    <div className="Eventos-resultado-pesquisa">
                        <div className="Eventos-resultado-pesquisa">
                            <div className="Eventos-card-falso"></div>
                            <div className="Eventos-card-falso"></div>
                            <div className="Eventos-card-falso"></div>

                          
                            
                        </div>   
                    </div>
                </div>        
            </div>
        <Footer />

    </>
  );
}

export default Eventos;