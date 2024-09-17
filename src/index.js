import React from 'react';
import ReactDOM from 'react-dom/client';
import Ap from './App'; // Certifique-se de que o caminho está correto
import './index.css'; // Importa o CSS global, se necessário

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Ap />
  </React.StrictMode>
);