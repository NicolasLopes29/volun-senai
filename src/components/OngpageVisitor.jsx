import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Loader from './Loader';
import ErrorPage from './ErrorPage';
import Card from './Card';
import ReportModal from './ReportModal';
import cateIcon from './../assets/images/category-icon.svg';
import './../css/Ongpage.css';

const OngpageVisitor = () => {
  const { orgId } = useParams();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [categorizedEvents, setCategorizedEvents] = useState({
    upcoming: [],
    ongoing: [],
    past: [],
  });
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(
          `https://volun-api-eight.vercel.app/organizacao/${orgId}`
        );
        setSelectedOrg(response.data);
      } catch (error) {
        console.error("Erro ao buscar organização:", error);
        setErrorCode(error.response?.status || 500);
      }
    };

    const fetchEventos = async () => {
      try {
        const response = await axios.get(
          `https://volun-api-eight.vercel.app/eventos/ong/${orgId}`
        );
        const eventosDetalhes = response.data.map((evento) => ({
          id: evento._id,
          titulo: evento.titulo,
          descricao: evento.descricao,
          ongNome: selectedOrg?.nome || "Nome da ONG não disponível",
          dataInicio: evento.data_inicio,
          dataFim: evento.data_fim,
          imgUrl: evento.imagem,
          vagaLimite: evento.vaga_limite,
          endereco: evento.endereco_id
            ? `${evento.endereco_id.bairro}, ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
            : "Endereço Indefinido",
        }));
        setEventos(eventosDetalhes);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orgId) {
      fetchOrganization();
      fetchEventos();
    }
  }, [orgId]);

  useEffect(() => {
    const categorizeEvents = () => {
      const now = new Date();
      const upcoming = eventos.filter((evento) => new Date(evento.dataInicio) > now);
      const ongoing = eventos.filter((evento) => {
        const start = new Date(evento.dataInicio);
        const end = new Date(evento.dataFim);
        return start <= now && end >= now;
      });
      const past = eventos.filter((evento) => new Date(evento.dataFim) < now);

      setCategorizedEvents({
        upcoming: upcoming,
        ongoing: ongoing,
        past: past,
      });
    };
    
    if (eventos.length > 0) {
      categorizeEvents();
    }
  }, [eventos]);

  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  const dataFundacao = selectedOrg?.createdAt
    ? formatarData(selectedOrg.createdAt)
    : "Data indefinida";

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (errorCode) {
    return <ErrorPage errorCode={errorCode} />;
  }

  return (
    <>
      <div className="ong-content">
        <div className="ong-profile">
          <div className="ong-avatar">
            <img
              id="ong-pfp"
              src={selectedOrg.img_logo}
              alt={`Logo da ONG ${selectedOrg.nome}`}
            />
          </div>
          <div className="ong-info">
            <div className="ong-name-report">
              <h1 id="ong-name" className="blue">
                {selectedOrg.nome}
              </h1>
              <button onClick={handleOpenReportModal} className="report-btn">
                Denunciar
              </button>
            </div>
            <h2 id="ong-date" className="blue">
              Fundado em: {dataFundacao}
            </h2>
            <strong id="ong-genre">
              <img
                src={cateIcon}
                id="cate-icon"
                alt="Ícone de categoria"
              />
              <span id="ong-genre-text" className="blue">
                {selectedOrg.razao_social}
              </span>
            </strong>
          </div>
        </div>
        <hr id="ong-line" />
      </div>

      <div className="about-ong">
        <h2 id="about-title" className="blue">
          Sobre a ONG:
        </h2>
        <p id="about-text" className="blue">
          {selectedOrg.descricao}
        </p>
      </div>

      <div className="ong-events">
        <h2 className="ong-events-title blue">Eventos criados:</h2>
        {eventos.length > 0 ? (
          <>
            <div className="events-nav">
              <button
                className={`events-nav-btn ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
              >
                Eventos não iniciados
              </button>
              <button
                className={`events-nav-btn ${activeTab === "ongoing" ? "active" : ""}`}
                onClick={() => setActiveTab("ongoing")}
              >
                Eventos em andamento
              </button>
              <button
                className={`events-nav-btn ${activeTab === "past" ? "active" : ""}`}
                onClick={() => setActiveTab("past")}
              >
                Eventos finalizados
              </button>
            </div>
            <div className="ong-cards">
              {categorizedEvents[activeTab].length > 0 ? (
                categorizedEvents[activeTab].map((evento) => (
                  <Card
                    key={evento.id}
                    id={evento.id}
                    titulo={evento.titulo}
                    descricao={evento.descricao}
                    ongNome={evento.ongNome}
                    dataInicio={evento.dataInicio}
                    imgUrl={evento.imgUrl}
                    vagaLimite={evento.vagaLimite}
                    endereco={evento.endereco}
                  />
                ))
              ) : (
                <div className="no-events">
                  <p>Nenhum evento encontrado nesta categoria.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-events">
            <p>Nenhum evento encontrado para esta organização.</p>
          </div>
        )}
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        orgId={orgId}
      />
    </>
  );
};

export default OngpageVisitor;

