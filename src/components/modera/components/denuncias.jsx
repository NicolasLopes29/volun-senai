import React, { useState, useEffect } from 'react';
import '../components/css/Denuncias.css';

const Denuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const response = await fetch('https://volun-api-eight.vercel.app/denuncias/');
        if (!response.ok) {
          throw new Error('Erro ao buscar as denúncias');
        }
        const data = await response.json();
        setDenuncias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDenuncias();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="denuncias-container">
      <h1>Denúncias</h1>
      <div className="cards-container">
        {denuncias.map((denuncia) => (
          <div key={denuncia.denunciante_id} className="card">
            <div className="card-header">
              <h3>Denúncia de {denuncia.denunciante_nome}</h3>
              <p><strong>Data:</strong> {new Date(denuncia.data).toLocaleString()}</p>
            </div>
            <div className="card-body">
              <p><strong>Denunciado:</strong> {denuncia.denunciado_nome}</p>
              <p><strong>Motivo:</strong> {denuncia.motivo}</p>
              <p><strong>Descrição:</strong> {denuncia.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Denuncias;
