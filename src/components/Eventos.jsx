import React, { useEffect, useState } from "react";
import "./../css/Eventos.css";
import Card from "./Card";
import seta from "./../assets/images/seta-page.svg";
import Loader from "./Loader"; 

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE",
    "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR",
    "SC", "SP", "SE", "TO"
];

const Eventos = () => {
    const [estadoSelecionado, setEstadoSelecionado] = useState('');
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

    const handleChange = (event) => {
        setEstadoSelecionado(event.target.value);
    };

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch('https://volun-api-eight.vercel.app/eventos/'); // Substitua pela URL correta da sua API
                const data = await response.json();
                setEventos(data);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
            } finally {
                setLoading(false); // Altera o estado para false após o carregamento
            }
        };
        
        fetchEventos();
    }, []);

    if (loading) {
        return <Loader />; // Exibe o Loader enquanto está carregando
    }


    return (
        <div className="Pesquisa-Eventos">
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
                        ))}
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
                    <h3>Foram achados {eventos.length} resultados referentes a sua busca</h3>
                </div>
                <div className="Eventos-resultado-pesquisa">
                    {eventos.map((evento, index) => (
                        <Card 
                            key={index}
                            titulo={evento.titulo}
                            descricao={evento.descricao}
                            ongNome={evento.ong_id?.nome}
                            dataInicio={evento.data_inicio}
                            imgUrl={evento.imagem}
                            vagaLimite={evento.vaga_limite}
                        />
                    ))}
                </div>   

                <div className="page-count">
                    <img src={seta} alt="" className="seta"/>
                    <div className="Botao-page">
                        <button> Anterior</button>
                    </div>
                    
                    <div className="numero-page">
                        <button>1</button>
                    </div>
                    <div className="numero-page">
                        <button>2</button>
                    </div>
                    <div className="numero-page">
                        <button>3</button>
                    </div>
                    <div className="Botao-page">
                        <button>Seguinte</button>
                    </div>
                    <img src={seta} alt="" className="seta-right"/>
                </div>
            </div>        
        </div>
    );
}

export default Eventos;
