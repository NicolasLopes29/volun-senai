import React from "react";
import "./../css/DetalhesEventos.css";
import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import praia from "./../assets/images/img-praia.svg";




// useEffect(() => {
//     const fetchEventos = async () => {
    
    
// }, []);

const DetalhesEventos = () => {
    const mostrarEsconderDiv = () => {
        const div = document.getElementsByClassName('comentarios-2');
    
        // Verifica o estado atual da div e alterna o display
        if (div.style.display === 'none' || div.style.display === '') {
          div.style.display = 'block'; // Mostra a div
        } else {
          div.style.display = 'none'; // Esconde a div
        }
    }

    return(
        <>
       
        <div className="pega-tudo">
            <div className="parte-1">
                <div className="titulo-evento">
                    <h1>{}Limpeza da praia</h1>
                    <p>Classificação de evento</p>
                    <p className="tags-evento">{}Meio ambiente</p>
                </div>
            
                <div>
                    <button className="participar">Participar</button>
                    <button className="compartilhar">Compartilhar</button>
                </div>
                <div className="background-descricao">
                    <p className="descricao-evento">{}Lorem Ipsum is simply dummy text of the printing
                        and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                        since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
                        type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                        comes from a line f
                        eqwrggnerhzrwsgsfhdrghngdf
                        yrtherfgwefdngtherznxfmxrhtnjfymrtehrtmfgfte
                        hrtndgfhnggwwgnthenfmrthe
                        fhgtdrbhrgndgergsbgdnthrghtdgnfthrghgnfhin section 1.10.32.</p>
                </div>
                <div className="backgound-especificacoes">
                        <p className="preferencia-descricao">preferências: nenhuma</p>
                        <p className="funcao-descricao">Função: Auxiliar na limpeza da praia coletando residuos</p>
                    
                </div>

            </div>    

            {/* Aqui vai a a parte 2 */}
            <div className="parte-2">
                <div className="imagem-evento">
                    <img src={praia} alt="" className="praia-img"></img>
                    <div ></div>
                </div>
                <div className="barra-participantes">
                    <img src={pessoas} alt="" className="pessoas"></img>
                </div>

                <div className="data-evento">
                <img src={calendario} alt="" className="calendario-icon"></img>
                    <p>28 de agosto a 31 de agosto</p>
                </div>

                <div className="horario-evento">
                <img src={relogio} alt="" className="relogio-icon"></img>
                    <p>Horário: 10:30h - 18h</p>
                </div>

                <div className="local-eventos">
                <img src={local} alt="" className="local-icon"></img>
                    <p>Rua dos banzeiros, 32, São Paulo - SP</p>
                </div>

                <div className="informacoes-ong">
                    <div className="perfil-ong">
                        <p className="link-ong">visite o perfil da ONG:{}</p>
                        <img></img>
                        <p className="link-ong">ong focada no meio ambiente</p>

                    </div>
                </div>

            </div>


        </div>
            <div className="endereco-mapa">
                <h2>Endereço: Rua dos Banzeiros Senai 32</h2>
                <div className="mapa-lugar">mapa irado</div>
            </div>

        <div className="comentarios">
            <div className="usuario">
                <div className="usuario-foto">
                            <p>eu</p>
                        </div>

                    </div>
                <div className="publicar-comentario">
                        <input className="comentar" placeholder="Comente aqui..."></input>
                </div>
        </div>
        {/*Barra de visualização de comentário */}
        <button className="button-publicar">Publicar</button>
        <button className="button-visualizar" onClick={mostrarEsconderDiv}>Ver comentários</button>

        <div className="comentarios-2">
            <div className="usuario">
                <div className="usuario-foto"></div>
            </div>

            <div className="publicar-comentario-2">
                <p>Coisas muitas coisas nossa quantas coisas remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                        comes from a line f
                        eqwrggnerhzrwsgsfhdrghngdf
                        yrtherfgwefdngtherznxfmxrhtnjfymrtehrtmfgfte
                        hrtndgfhnggwwgnthenfmrthe</p>
            </div>
        </div>
        </>
    );
};
export default DetalhesEventos;