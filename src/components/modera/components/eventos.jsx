import React, { useState, useEffect } from 'react';
import '../components/css/Eventos.css';

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch('https://volun-api-eight.vercel.app/eventos/');
                if (!response.ok) {
                    throw new Error('Erro ao buscar os eventos');
                }
                const data = await response.json();
                setEventos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
  
        fetchEventos();
    }, []);
  
    if (loading) {
        return <div>Carregando...</div>;
    }
  
    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div className="eventos-container">
            {eventos.map(evento => (
                <div className="card" key={evento.id}>
                    <div className="card-capa"></div>
                    <h2 className="card-title">{evento.titulo}</h2>
                    <div className="card-description">{evento.descricao}</div>
                    <div className="card-text-first">
                        <strong>{evento.data_inicio}</strong>
                    </div>
                    <div className="card-text-second">
                        <span>{evento.data_fim}</span>
                    </div>
                    <button className="card-details">
                        <p>Mais detalhes</p>
                        {}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Eventos;

 