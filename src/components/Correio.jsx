import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import Loader from './Loader';

const Correio = () => {
    const [advertencias, setAdvertencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdvertencias = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const response = await axios.get(`https://volun-api-eight.vercel.app/advertencias/usuario/${user.uid}`);
                    setAdvertencias(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar advertências:', error);
                    setError('Não foi possível carregar as advertências. Por favor, tente novamente mais tarde.');
                    setLoading(false);
                }
            }
        };

        fetchAdvertencias();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="correio-container">
            <h2>Suas Advertências</h2>
            {advertencias.length === 0 ? (
                <p className="no-advertencias">Você não tem advertências.</p>
            ) : (
                <ul className="advertencias-list">
                    {advertencias.map((advertencia, index) => (
                        <li key={index} className="advertencia-item">
                            <div className="advertencia-header">
                                <span className="advertencia-number">#{index + 1}</span>
                                <span className="advertencia-date">
                                    {new Date(advertencia.data).toLocaleDateString('pt-BR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </div>
                            <p className="advertencia-motivo">{advertencia.motivo}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Correio;

