import React from "react";
import "./../css/DetalhesEventos.css";
/*import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";*/

const DetalhesEventos = () => {
    return(
        <>
       
        <div className="pega-tudo">
            <div className="parte-1">
                <div className="titulo-evento">
                    <h1>{}Limpeza da praia</h1>
                </div>
                <div>
                    <p>Classificação de evento</p>
                </div>
                <div>
                    <button className="participar">Participar</button>
                    <button className="compartilhar">Compartilhar</button>
                </div>
                <div className="background-descricao">
                    <p className="descricao-evento">Lorem Ipsum is simply dummy text of the printing
                        and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                        since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                        type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                        comes from a line in section 1.10.32.</p>
                </div>
            </div>    

            <div className="parte-2">
                <div className="imagem-evento"></div>
                <div className="barra-participantes">
                    <img src={pessoas} alt="" className="pessoas"></img>
                </div>

                <img src={calendario} alt="" className="calendario"></img>
                <div>28 de agosto a 31 de agosto</div>

                <img src={relogio} alt="" className="relogio"></img>
                <div>Horário: 10:30h - 18h</div>

                <img src={local} alt="" className="local"></img>
                <div>Rua dos banzeiros, 32, São Paulo - SP</div>

                <div className="especificacoes">
                    <p>preferências: nenhuma</p>
                    <p>Função: Auxiliar na limpeza da praia coletando residuos</p>
                </div>

                <div className="perfil-ong"></div>

            </div>


        </div>
            <div className="endereco-mapa">
                <h2>Endereço: Rua dos Banzeiros Senai 32</h2>
            </div>
        </>
    );
};
export default DetalhesEventos;