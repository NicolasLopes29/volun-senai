import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Card from "./Card";
import gpsIcon from "./../assets/images/gps-icon.svg";
import cateIcon from "./../assets/images/category-icon.svg";
import "./../css/Ongpage.css";
import { format } from "date-fns";

const Ongpage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla a visibilidade da modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async (userId) => {
      try {
        const response = await axios.get(
          `https://volun-api-eight.vercel.app/organizacao/criador/${userId}`
        );
        setOrganizations(response.data);
        if (response.data.length > 0) {
          setSelectedOrg(response.data[0]); // Seleciona a primeira ONG por padrão
        }
      } catch (error) {
        console.error("Erro ao buscar organizações:", error);
      } finally {
        setLoading(false);
      }
    };

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrganizations(user.uid);
      } else {
        console.error("Usuário não autenticado.");
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      if (selectedOrg) {
        try {
          setEventos([]);
          const response = await axios.get(
            `https://volun-api-eight.vercel.app/eventos/ong/${selectedOrg._id}`
          );
          const eventosDetalhes = response.data.map((evento) => ({
            id: evento._id,
            titulo: evento.titulo,
            descricao: evento.descricao,
            ongNome: selectedOrg.nome,
            dataInicio: evento.data_inicio,
            imgUrl: evento.imagem,
            vagaLimite: evento.vaga_limite,
            endereco: evento.endereco_id
              ? `${evento.endereco_id.bairro}, ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
              : "Endereço Indefinido",
          }));
          setEventos(eventosDetalhes);
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        }
      } else {
        setEventos([]);
      }
    };

    fetchEventos();
  }, [selectedOrg]);

  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy");
  };

  const dataFundacao = selectedOrg?.createdAt
    ? formatarData(selectedOrg.createdAt)
    : "Data indefinida";

  const handleDeleteOrg = async () => {
    try {
      const response = await axios.delete(
        `https://volun-api-eight.vercel.app/organizacao/${selectedOrg._id}`
      );
      window.location.reload() 
    } catch (error) {
      console.error("Erro ao excluir a organização:", error);
    }
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalOpen = () => setIsModalOpen(true);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="org-nav">
        <div>
          {organizations.map((org) => (
            <button
              key={org._id}
              className={`org-nav-btn ${
                selectedOrg?._id === org._id ? "active" : ""
              }`}
              onClick={() => setSelectedOrg(org)}
            >
              {org.nome}
            </button>
          ))}
        </div>
        <div className="org-nav-action">
          <button
            className="org-nav-add-btn"
            onClick={() => navigate("/cardong")}
          >
            Adicionar ONG
          </button>
        </div>
      </div>

      {selectedOrg && (
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
                <h1 id="ong-name" className="blue">
                  {selectedOrg.nome}
                </h1>
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

              {/* Substituindo os ícones de mídia social pelo botão de exclusão */}
              <div className="delete-org-btn">
                <button onClick={handleModalOpen} className="delete-btn">
                  Excluir Organização
                </button>
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
              <div className="ong-cards">
                {eventos.map((evento) => (
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
                ))}
              </div>
            ) : (
              <div className="no-events">
                <p>Nenhum evento encontrado para esta organização.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {isModalOpen && (
        <div className="modal-delete-org">
          <div className="modal-content-org">
            <h3>Tem certeza que deseja excluir esta organização?</h3>
            <div className="modal-buttons-org">
              <button onClick={handleDeleteOrg} className="modal-delete-btn-org">
                Confirmar
              </button>
              <button onClick={handleModalClose} className="modal-cancel-btn-org">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ongpage;
