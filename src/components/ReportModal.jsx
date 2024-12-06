import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import '../css/ReportModal.css';

const ReportModal = ({ isOpen, onClose, eventoId }) => {
  const [motivo, setMotivo] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleMotivoChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setMotivo([...motivo, value]);
    } else {
      setMotivo(motivo.filter(item => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (motivo.length === 0) {
      setError('Por favor, selecione pelo menos um motivo para a denúncia.');
      return;
    }

    if (descricao.trim() === '') {
      setError('Por favor, forneça uma descrição para a denúncia.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError('Você precisa estar logado para fazer uma denúncia.');
      return;
    }

    try {
      const response = await axios.post('https://volun-api-eight.vercel.app/denuncias', {
        denunciante_id: currentUser.uid,
        evento_id: eventoId,
        motivo: motivo,
        descricao: descricao
      });

      if (response.status === 201) {
        alert('Denúncia enviada com sucesso!');
        onClose();
      } else {
        throw new Error('Falha ao enviar denúncia');
      }
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      setError('Ocorreu um erro ao enviar a denúncia. Por favor, tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Denunciar Evento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Motivo da denúncia:</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Conteúdo inapropriado"
                  onChange={handleMotivoChange}
                />
                Conteúdo inapropriado
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Informações falsas"
                  onChange={handleMotivoChange}
                />
                Informações falsas
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Comportamento suspeito"
                  onChange={handleMotivoChange}
                />
                Comportamento suspeito
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Outro"
                  onChange={handleMotivoChange}
                />
                Outro
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="submit">Enviar Denúncia</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

