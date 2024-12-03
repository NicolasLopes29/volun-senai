import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Card from "./Card";
import Loader from "./Loader";
import "./../css/Historico.css";

const Historico = () => {
  const [userId, setUserId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.error("Usuário não está logado.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchEventos = async () => {
        try {
          const response = await fetch(
            `https://volun-api-eight.vercel.app/participacao/usuario/${userId}`
          );
          const participacoes = await response.json();

          const eventosDetalhes = await Promise.all(
            participacoes.map(async (participacao) => {
              const eventoId = participacao.evento_id?._id;
              if (!eventoId) return null;

              const eventoResponse = await fetch(
                `https://volun-api-eight.vercel.app/eventos/${eventoId}`
              );
              const evento = await eventoResponse.json();

              const endereco =
                evento.endereco_id?.bairro &&
                evento.endereco_id?.cidade &&
                evento.endereco_id?.estado
                  ? `${evento.endereco_id.bairro} , ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
                  : "Endereço não disponível";

              return {
                id: evento._id,
                titulo: evento.titulo,
                descricao: evento.descricao,
                ongNome: evento.ong_id?.nome || "Nome da ONG não disponível",
                dataInicio: evento.data_inicio,
                dataFim: evento.data_fim,
                imgUrl: evento.imagem,
                vagaLimite: evento.vaga_limite,
                endereco,
              };
            })
          );

          setEventos(eventosDetalhes.filter((evento) => evento !== null));
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventos();
    }
  }, [userId]);

  const categorizeEvents = () => {
    const now = new Date();
    const upcoming = eventos.filter(evento => new Date(evento.dataInicio) > now);
    const ongoing = eventos.filter(evento => {
      const start = new Date(evento.dataInicio);
      const end = new Date(evento.dataFim);
      return start <= now && end >= now;
    });
    const past = eventos.filter(evento => new Date(evento.dataFim) < now);
    return { upcoming, ongoing, past };
  };

  const { upcoming, ongoing, past } = categorizeEvents();

  if (loading) {
    return <Loader />;
  }

  const renderEventos = (eventList) => {
    if (eventList.length === 0) {
      return (
        <div className="eventos-vazio">
          <p>Não há eventos nesta categoria.</p>
        </div>
      );
    }

    return eventList.map((evento) => (
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
    ));
  };

  return (
    <div className="historico-container">
      <h3>Histórico</h3>
      <h5>Confira aqui os últimos eventos que você se inscreveu ou participou!</h5>
      
      {eventos.length > 0 ? (
        <>
          <div className="historico-nav">
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              Eventos não iniciados
            </button>
            <button
              className={activeTab === "ongoing" ? "active" : ""}
              onClick={() => setActiveTab("ongoing")}
            >
              Eventos em andamento
            </button>
            <button
              className={activeTab === "past" ? "active" : ""}
              onClick={() => setActiveTab("past")}
            >
              Eventos finalizados
            </button>
          </div>
          <div className="historico-eventos">
            {activeTab === "upcoming" && renderEventos(upcoming)}
            {activeTab === "ongoing" && renderEventos(ongoing)}
            {activeTab === "past" && renderEventos(past)}
          </div>
        </>
      ) : (
        <div className="historico-vazio">
          <p>Você ainda não participou de nenhum evento.</p>
        </div>
      )}
    </div>
  );
};

export default Historico;




