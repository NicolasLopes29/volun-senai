import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
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
import ErrorPage from "./ErrorPage";
import ReportModal from "./ReportModal"

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
    const [numeroParticipacao, setnumeroParticipacao] = useState(0);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [errorCode, setErrorCode] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [eventEnded, setEventEnded] = useState(false); // New state variable
    const [mapError, setMapError] = useState(null); // Added state for map errors
    const auth = getAuth();

    const markerIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41]
    });

    const handleOpenReportModal = () => {
        setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
    };

    useEffect(() => {
        const verificarUserId = () => {
            const userId = auth.currentUser?.uid;
            console.log("UserId:", userId);
    
            if (userId) {
                verificarParticipacao(userId);
            }
        };
    
        if (firebaseInitialized) {
            verificarUserId();
            setIsLoading(false); // Definir o loading como false depois que o Firebase for inicializado
        }
    }, [firebaseInitialized]);
    
    useEffect(() => {
        const checkFirebaseInitialization = () => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setFirebaseInitialized(true); // Firebase está inicializado
                }
            });
    
            return () => unsubscribe();
        };
    
        checkFirebaseInitialization();
    }, []);
    
    


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

    useEffect(() => {
        const fetchnumeroParticipacao = async () => {
            try {
                console.log("Buscando participações para o evento:", id);
                const response = await axios.get(`https://volun-api-eight.vercel.app/participacao/evento/${id}`);
                setnumeroParticipacao(response.data.length); // Atualiza a contagem de participações
            } catch (error) {
                console.error("Erro ao buscar participações:", error);
            }
        };
    
        fetchnumeroParticipacao(); // Chame a função diretamente
    }, [id]); // Baseie-se no `id` e não no `evento._id`
    
    const verificarParticipacao = async (userId) => {
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
    



    useEffect(() => {
        verificarParticipacao(); // Chama a verificação ao carregar a página
    }, [id]); 

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
        if (eventEnded) {
            alert("Este evento já foi finalizado.");
            return;
        }

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
                alert("Confirmado com sucesso!");
                window.location.reload(); // Recarrega a página
            } else {
                throw new Error("Erro ao confirmar participação");
            }
        } catch (error) {
            console.error("Erro ao participar:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const checkEventEnded = () => {
        if (evento.dataFim) {
            const currentDate = new Date();
            const eventEndDate = new Date(evento.dataFim);
            setEventEnded(currentDate > eventEndDate);
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
                    checkEventEnded();
                }
            } catch (error) {
                console.error("Erro ao carregar evento:", error);
                setErrorCode(error.response?.status || 500);
            } finally {
                setIsLoading(false);
            }
        };

        getEventoEEndereco();
    }, [id]);

    useEffect(() => {
        checkEventEnded();
    }, [evento.dataFim]);

    const fetchEvento = async (id) => {
        try {
            const response = await indexEventos.getObject(id);
            return response;
        } catch (error) {
            setErrorCode(error.status || 500);
            throw error;
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
                setMapError(null);
            } else {
                console.warn("Nenhuma coordenada encontrada para o endereço fornecido.");
                setMapError("Não foi possível encontrar as coordenadas para este endereço.");
            }
        } catch (error) {
            console.error("Erro ao buscar coordenadas:", error);
            setMapError("Ocorreu um erro ao carregar o mapa. Por favor, tente novamente mais tarde.");
        }
    };

    const formatarData = (data) => {
        return format(new Date(data), "dd/MM/yyyy");
    };
    const formatarHora = (data) => {
        return format(new Date(data), "HH:mm");
    };

    const progressPercentage = Math.min((numeroParticipacao / evento.vagaLimite) * 100, 100);
    const isOverLimit = numeroParticipacao > evento.vagaLimite;


    const dataInicio = evento.dataInicio ? formatarData(evento.dataInicio) : "Data indefinida";
    const dataFim = evento.dataFim ? formatarData(evento.dataFim) : "Data indefinida";
    const horaInicio = evento.dataInicio ? formatarHora(evento.dataInicio) : "Data indefinida";
    const horaFim = evento.dataFim ? formatarHora(evento.dataFim) : "Data indefinida";

    if (errorCode) {
        // Exibe o componente ErrorPage quando ocorre um erro
        return <ErrorPage errorCode={errorCode} />;
      }


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
                        </div>
    
                        <div className="buttons-detalhes-evento">
                            {participacaoId ? (
                                <button
                                    className="cancelar-participar"
                                    onClick={() => setShowModal(true)}
                                    disabled={eventEnded}
                                >
                                    {eventEnded ? "Evento finalizado" : "Cancelar Participação"}
                                </button>
                            ) : (
                                <button 
                                    className="participar" 
                                    onClick={handleParticipar}
                                    disabled={eventEnded}
                                >
                                    {eventEnded ? "Evento finalizado" : "Participar"}
                                </button>
                            )}
                            <button className="compartilhar" onClick={handleCompartilhar}>
                                Compartilhar
                            </button>
                            <button onClick={handleOpenReportModal} className="report-btn">
                                Denunciar
                            </button>
                        </div>
    
                        <div className="background-descricao">
                            <p className="descricao-evento">
                                {evento.descricao || "Descrição indisponível..."}
                            </p>
                        </div>
    
                        <div className="backgound-especificacoes">
                            <p className="preferencia-descricao">
                                {evento.descricao_2 || "Descrição indisponível..."}
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
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div 
                                        className={`progress-fill ${isOverLimit ? 'progress-fill-over' : 'progress-fill-normal'}`}
                                        style={{ width: `${progressPercentage}%` }}
                                        role="progressbar"
                                        aria-valuenow={numeroParticipacao}
                                        aria-valuemin={0}
                                        aria-valuemax={evento.vagaLimite}
                                    ></div>
                                </div>
                                <p className="progress-text">
                                    {isOverLimit 
                                        ? `Mais de ${evento.vagaLimite} vagas foram preenchidas`
                                        : `${numeroParticipacao} / ${evento.vagaLimite} vagas preenchidas`
                                    }
                                </p>
                            </div>
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
                            <Link className="perfil-ong-container" to={`/ongVisitor/${evento.organizacao?._id}`}>
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
                            </Link>
                        </div>
                    </div>
                </div>
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
                        <div className="mapa-indisponivel"> {/* Changed to a div for better styling */}
                            <p>{mapError || "Mapa indisponível no momento. Desculpe pelo inconveniente."}</p>
                        </div>
                    )}
                </div>
            </div>
            <Coment eventoId={id}/>
    
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

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={handleCloseReportModal}
                eventoId={id}
            />
        </>
    );
};

export default DetalhesEventos;



