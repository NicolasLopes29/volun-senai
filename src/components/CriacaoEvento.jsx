import React from "react";
import "./../css/CriacaoEventos.css";
import calendario from "./../assets/images/calendario.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";


const CriacaoEventos = () =>{

    return(
        <>
        <div className="titulo-criacao">
            <h1>Novo Evento+</h1>
        </div> 

        <div className="toda-pagina">
            {/* Primeira parte vai aqui */}
            <div className="primera-parte">
                    <input placeholder="Nome do evento" className="nome-evento"></input>
                    <select className="tags-evento">Classificação de eventos
                        <option>termas</option>
                        <option>do vale</option>
                    </select>
                    <div className="descricao-fundo">
                        <input placeholder="descrição do evento aqui..." className="descricao-novo"></input>
                    </div>
            </div>    

            {/* Segunda parte vai aqui */}
            <div className="segunda-parte">
                <div className="background-colar-img"></div>
                <div className="definir-vagas">
                    <input className="numero-vagas"></input>
                </div>
                <div className="definir-dia">
                    <input className="data-dia-evento"></input>
                </div>
            </div>
        </div>
        <div className="Endereço-mapa"></div>

        <div className="botões-evento">
            <button className="cancelar-evento">Cancelar Evento</button>
            <button className="adicionar-evento">Adicionar Evento</button>
        </div>

        </>
    );
};
export default CriacaoEventos;