import React from "react";
import "./../css/CriacaoEventos.css";
import calendario from "./../assets/images/calendario.svg";
// import pessoas from "./../assets/images/icon-pessoas.svg";
// import correto from "./../assets/images/icon-correto.svg";
// import cancela from "./../assets/images/icon-cancela.svg";


const CriacaoEventos = () =>{

    return(
        <>
        <div classname="pega-tudo2">

        <div className="titulo-criacao">
            <h1>Novo Evento+</h1>
        </div> 

        <div className="toda-pagina2">
            {/* Primeira parte vai aqui */}
            <div className="primera-parte">
                <p className="nome-bonito">Digite o nome do evento</p>
                    <input placeholder="Nome do evento" className="nome-evento"></input>
                    <p className="titulo-tags">Selecione as tags do evento</p>
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
                    <img src= {pessoas} alt="quantidade de pessoas" className="icon-pessoas2"></img>
                    <input className="numero-vagas"></input>
                </div>
                <div className="definir-dia">
                    <p>Defina os dias do evento</p>
                    <img src={calendario} alt="dia do evento" className="icon-calendario2"></img>
                    <input className="data-dia-evento"></input>
                </div>
                <div>
                    <textarea className="preferencias2" placeholder="Preferências"></textarea>
                </div>
            </div>
        </div>

        <div className="endereco-mapa2">Mapa foda vem aqui</div>

        <div className="botões-evento">
            <button className="cancelar-evento">
                <img src= {cancela} alt="cancelar evento" className="cancelar-evento-img"></img>
                <p>Cancelar Evento</p>
            </button>

            <button className="adicionar-evento">
                <img src= {correto} alt="confirmar evento" className="confirmar-evento-img"></img>
                <p>Adicionar Evento</p>
            </button>
        </div>
        </div>

        </>
    );
};
export default CriacaoEventos;