import React, { useState } from 'react';
import './css/Eventos.css';

const eventosData = [
  { id: 1, title: 'Evento 1', date: '2024-09-25', description: 'Descrição do evento 1' },
  { id: 2, title: 'Evento 2', date: '2024-09-26', description: 'Descrição do evento 2' },
  { id: 3, title: 'Evento 3', date: '2024-09-27', description: 'Descrição do evento 3' },
];

const Card = ({ title, date, description }) => (
  <div>
      <h3>{title}</h3>
      <p>{date}</p>
      <p>{description}</p>
  </div>
);

const Eventos = () => {
  return (
      <div>
          <h1>Página de Eventos</h1>
          <div>
              {eventosData.map(evento => (
                  <Card 
                      key={evento.id} 
                      title={evento.title} 
                      date={evento.date} 
                      description={evento.description} 
                  />
              ))}
          </div>
      </div>
  );
};

export default Eventos;