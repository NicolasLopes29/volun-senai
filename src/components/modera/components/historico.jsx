import React, { useEffect, useState } from 'react';

const Historico = () => {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    // Recupera o histórico do localStorage 
    const historicoArmazenado = JSON.parse(localStorage.getItem('historico')) || [];
    setHistorico(historicoArmazenado);
  }, []);

  return (
    <div>
      <h2>Histórico de Ações</h2>
      <ul>
        {historico.map((acao, index) => (
          <li key={index}>{acao}</li>
        ))}
      </ul>
    </div>
  );
};

export default Historico;

