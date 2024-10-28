import React, { useState, useEffect } from 'react';

const Denuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchDenuncias = async () => {
          try {
              const response = await fetch('https://volun-api-eight.vercel.app/denuncias/');
              if (!response.ok) {
                  throw new Error('Erro ao buscar os denúncias');
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
      <div>
          <h1>Denúncias</h1>
          <ul>
              {denuncias.map((denuncia) => (
                  <li key={denuncia.id}>{denuncia.titulo}</li> // Ajuste a propriedade conforme a estrutura da sua resposta
              ))}
          </ul>
      </div>
  );
}

export default Denuncias;
