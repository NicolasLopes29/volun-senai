import React from "react";
import "./../css/CriacaoEventos.css";
import calendario from "./../assets/images/calendario.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";


const CriacaoEventos = () =>{

    return(
        <>
        <div classname="pega-tudo2">

        <div className="titulo-criacao">
            <h1>Novo Evento+</h1>
        </div> 

        <div className="toda-pagina">
            {/* Primeira parte vai aqui */}
            <div className="primera-parte">
                <p>Digite o nome do evento</p>
                    <input placeholder="Nome do evento" className="nome-evento"></input>
                    <p>selecione as tags do evento</p>
                    <select className="tags-evento">Classificação de eventos
                        <option>termas</option>
                        <option>do vale</option>
                    </select>
                    <div className="descricao-fundo">
                        <p>Descrição</p>
                        <textarea placeholder="descrição do evento aqui..." className="descricao-novo"></textarea>
                    </div>
            </div>    

            {/* Segunda parte vai aqui */}
            <div className="segunda-parte">
                <div className="background-colar-img">{}cole a imagem aqui +</div>
                <div className="definir-vagas">
                    <p>Defina a quantidade de pessoas</p>
                    <input className="numero-vagas"></input>
                </div>
                <div className="definir-dia">
                    <p>Defina os dias do evento</p>
                    <input className="data-dia-evento"></input>
                </div>
                <div>
                    <textarea className="preferencias2" placeholder="Preferências"></textarea>
                </div>
            </div>
        </div>
        <div className="Endereço-mapa"></div>

        <div className="botões-evento">
            <button className="cancelar-evento">Cancelar Evento</button>
            <button className="adicionar-evento">Adicionar Evento</button>
        </div>
        </div>

        </>
    );
};
export default CriacaoEventos;