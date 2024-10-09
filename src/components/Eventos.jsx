import React, { useState } from "react";
import "./../css/Eventos.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Card from "./Card";

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
        <div class="Pesquisa-Eventos">
        <section className="arrumar-tudo">
            <h1 className="Eventos-h1">Pesquise aqui</h1>
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
                <div className="Eventos-titulo">
                <h1>Resultado da pesquisa:</h1>
                <h3>Foram achados X{}X resultados referentes a sua busca</h3>
                </div>
                        <div className="Eventos-resultado-pesquisa">
                            <Card/>
                            <Card/>
                            <Card/>

                            <Card/>
                            <Card/>
                            <Card/>
                            
                            <Card/>
                            <Card/>
                            <Card/>
                        </div>   
                    
                </div>        
            </div>
        <Footer />

    </>
  );
}

export default Eventos;