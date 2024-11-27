import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Card from "./Card";
import Loader from "./Loader";
import "./../css/Historico.css";

const Historico = () => {
  const [userId, setUserId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Obtém o UID do usuário logado
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
          // Requisição inicial para buscar participações
          const response = await fetch(
            `https://volun-api-eight.vercel.app/participacao/usuario/${userId}`
          );
          const participacoes = await response.json();

          // Extrair IDs dos eventos e fazer requisições para detalhes
          const eventosDetalhes = await Promise.all(
            participacoes.map(async (participacao) => {
              const eventoId = participacao.evento_id?._id; // Obtém o ID do evento
              if (!eventoId) return null;

              // Requisição para detalhes do evento
              const eventoResponse = await fetch(
                `https://volun-api-eight.vercel.app/eventos/${eventoId}`
              );
              const evento = await eventoResponse.json();

              // Formatar endereço no padrão "bairro - cidade - estado"
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
                imgUrl: evento.imagem,
                vagaLimite: evento.vaga_limite,
                endereco,
              };
            })
          );

          // Filtrar eventos nulos e atualizar estado
          setEventos(eventosDetalhes.filter((evento) => evento !== null));
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        } finally {
          setLoading(false); // Oculta o Loader
        }
      };

      fetchEventos();
    }
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  return (
    eventos.length > 0 ? (
      <div className="historico-container">
          <h3>Histórico</h3>
          <h5>confira aqui os ultimos eventos que você se inscreveu ou participou!</h5>
          <div className="historico-eventos">
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
      </div>
  ) : (
      <div className="historico-vazio">
          <p>Você ainda não participou de nenhum evento.</p>
      </div>
  )
  );
};

export default Historico;
