import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import algoliaClient from "./../services/algoliaConfig"; // Importando o cliente configurado do Algolia
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./../css/DetalhesEventos.css";
import Loader from "./Loader";
import { getAuth } from "firebase/auth";
import calendario from "./../assets/images/calendario.svg";
import relogio from "./../assets/images/icon-relogio.svg";
import local from "./../assets/images/icon-local.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import praia from "./../assets/images/img-praia.svg";
import Coment from "./Coment"

// Inicializando o índice de eventos
const indexEventos = algoliaClient.initIndex("eventos");

const formatarCEP = (cep) => {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2'); // Adiciona o "-" após os 5 primeiros dígitos
};

const DetalhesEventos = () => {
    const { id } = useParams();
    const [evento, setEvento] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [coordinates, setCoordinates] = useState(null);
    const [isParticipating, setIsParticipating] = useState(false); // Novo estado para controlar o botão
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [participacaoId, setParticipacaoId] = useState(null);
    const auth = getAuth();

    const markerIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41]
    });


    const handleCompartilhar = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: evento.titulo || "Confira este evento!",
                    text: `Veja mais sobre o evento ${evento.titulo || "no nosso site"}!`,
                    url: window.location.href,
                })
                .then(() => console.log("Compartilhamento realizado com sucesso!"))
                .catch((error) => console.error("Erro ao compartilhar:", error));
        } else {
            // Fallback: copiar link
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("Link copiado para a área de transferência!");
            });
        }
    };
    
    // Verifica a participação do usuário no evento
    const verificarParticipacao = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            const response = await fetch(
                `https://volun-api-eight.vercel.app/participacao/usuario/${userId}/evento/${id}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data._id) {
                    setParticipacaoId(data._id); // Salva o ID próprio do documento
                }
            }
        } catch (error) {
            console.error("Erro ao verificar participação:", error);
        }
    };

    // Cancela a participação do usuário no evento
    const handleCancelarParticipacao = async () => {
        if (!participacaoId) return;

        try {
            const response = await fetch(
                `https://volun-api-eight.vercel.app/participacao/${participacaoId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                alert("Participação cancelada com sucesso!");
                window.location.reload(); // Recarrega a página
            } else {
                throw new Error("Erro ao cancelar participação");
            }
        } catch (error) {
            console.error("Erro ao cancelar participação:", error);
        }
    };


    const handleParticipar = async () => {
        if (isParticipating) {
            // Se já estiver participando, exibe o modal de confirmação
            setShowModal(true);
            return;
        }
    
        // Lógica para confirmar participação
        setIsProcessing(true);
        const userId = auth.currentUser?.uid;
        if (!userId) return console.error("Usuário não está logado");
    
        const participacaoData = {
            evento_id: id,
            usuario_id: userId,
        };
    
        try {
            const response = await fetch("https://volun-api-eight.vercel.app/participacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(participacaoData),
            });
    
            if (response.ok) {
                const data = await response.json();
                setIsParticipating(true); // Marca como participante
                setParticipacaoId(data._id); // Salva o ID do documento
                alert("Confirmado");
            } else {
                throw new Error("Erro ao confirmar participação");
            }
        } catch (error) {
            console.error("Erro ao participar:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        verificarParticipacao(); // Chama a verificação ao carregar a página
    }, [id]); // Reexecuta a verificação se o ID do evento mudar
    
    useEffect(() => {
        const getEventoEEndereco = async () => {
            setIsLoading(true);
            try {
                const dadosEvento = await fetchEvento(id);
                if (dadosEvento) {
                    setEvento(dadosEvento);
                    await fetchCoordinates(dadosEvento.endereco);
                }
            } catch (error) {
                console.error("Erro ao carregar evento:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getEventoEEndereco();
    }, [id]);

    const fetchEvento = async (id) => {
        try {
            const response = await indexEventos.getObject(id); // Busca o evento pelo ID no Algolia
            return response;
        } catch (error) {
            console.error("Erro ao buscar dados do evento:", error);
        }
    };

    const fetchCoordinates = async (endereco) => {
        if (!endereco) return;

        const { logradouro, numero, cidade, estado, cep } = endereco;
        const enderecoCompleto = `${logradouro}, ${numero}, ${cidade}, ${estado}, ${cep}`;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const location = data[0];
                setCoordinates({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
            } else {
                console.warn("Nenhuma coordenada encontrada para o endereço fornecido.");
            }
        } catch (error) {
            console.error("Erro ao buscar coordenadas:", error);
        }
    };

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy");
    };
    const formatarHora = (data) => {
        return format(new Date(data), "HH:mm");
    };

    const dataInicio = evento.dataInicio ? formatarData(evento.dataInicio) : "Data indefinida";
    const dataFim = evento.dataFim ? formatarData(evento.dataFim) : "Data indefinida";
    const horaInicio = evento.dataInicio ? formatarHora(evento.dataInicio) : "Data indefinida";
    const horaFim = evento.dataFim ? formatarHora(evento.dataFim) : "Data indefinida";

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="pega-tudo">
                    {/* Parte 1: Informações do evento */}
                    <div className="parte-1">
                        <div className="titulo-evento">
                            <h1>{evento.titulo || "Evento não encontrado"}</h1>
                            <div className="tags-container">
                                {evento.tags &&
                                    evento.tags.map((tag, index) => (
                                        <span key={index} className="tag-item">
                                            {tag}
                                        </span>
                                    ))}
                            </div>
                        </div>
    
                        <div className="buttons-detalhes-evento">
                            {participacaoId ? (
                                <button
                                    className="cancelar-participar"
                                    onClick={() => setShowModal(true)}
                                >
                                    Cancelar Participação
                                </button>
                            ) : (
                                <button className="participar" onClick={handleParticipar}>
                                    Participar
                                </button>
                            )}
                            <button className="compartilhar" onClick={handleCompartilhar}>
                                Compartilhar
                            </button>
                        </div>
    
                        <div className="background-descricao">
                            <p className="descricao-evento">
                                {evento.descricao || "Descrição indisponível..."}
                            </p>
                        </div>
    
                        <div className="backgound-especificacoes">
                            <p className="preferencia-descricao">Preferências: nenhuma</p>
                            <p className="funcao-descricao">
                                Função: Auxiliar na limpeza da praia coletando resíduos
                            </p>
                        </div>
                    </div>
    
                    {/* Parte 2: Dados visuais do evento */}
                    <div className="parte-2">
                        <div className="imagem-evento">
                            <img
                                src={evento.imagem || praia}
                                alt={evento.titulo}
                                className="praia-img"
                            />
                        </div>
                        <div className="barra-participantes">
                            <img src={pessoas} alt="ícone pessoas" className="pessoas" />
                            <p>{evento.vagaLimite} vagas</p>
                        </div>
                        <div className="data-evento">
                            <img
                                src={calendario}
                                alt="ícone calendário"
                                className="calendario-icon"
                            />
                            <p>
                                {dataInicio} à {dataFim}
                            </p>
                        </div>
                        <div className="horario-evento">
                            <img
                                src={relogio}
                                alt="ícone relógio"
                                className="relogio-icon"
                            />
                            <p>
                                Horário: {horaInicio} à {horaFim}
                            </p>
                        </div>
                        <div className="local-eventos">
                            <img src={local} alt="ícone local" className="local-icon" />
                            <p>
                                {evento.endereco
                                    ? `${evento.endereco.logradouro}, ${evento.endereco.numero}, ${evento.endereco.cidade} - ${evento.endereco.estado}, ${formatarCEP(
                                          evento.endereco.cep
                                      )}`
                                    : "Endereço indisponível"}
                            </p>
                        </div>
                        <div className="informacoes-ong">
                            <div className="perfil-ong-container">
                                <p className="link-ong">Visite o perfil da ONG:</p>
                                <div className="logo-and-name-ong">
                                    <div className="logo-img-container">
                                        <img
                                            className="logo-img-ong"
                                            alt="logo ONG"
                                            src={evento.organizacao?.imgLogo}
                                        />
                                    </div>
                                    <h2 className="link-ong-name">{evento.organizacao?.nome}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Coment eventoId={id}/>
            )}
    
            {/* Mapa e endereço */}
            <div className="endereco-mapa">
                <h2>
                    Endereço: {evento.endereco?.logradouro}, {evento.endereco?.numero}
                </h2>
                <div className="mapa-lugar">
                    {coordinates ? (
                        <MapContainer
                            center={coordinates}
                            zoom={15}
                            style={{ width: "100%", height: "300px" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={coordinates} icon={markerIcon}>
                                <Popup>{evento.titulo}</Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p>Mapa não encontrado</p>
                    )}
                </div>
            </div>
    
            {/* Modal de confirmação */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Tem certeza que deseja cancelar sua participação?</h3>
                        <div className="modal-buttons">
                            <button onClick={handleCancelarParticipacao}>Sim</button>
                            <button onClick={() => setShowModal(false)}>Não</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetalhesEventos;
