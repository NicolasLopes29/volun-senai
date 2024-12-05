import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ errorCode }) => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  };

  const contentStyle = {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '90%',
  };

  const headingStyle = {
    fontSize: '6rem',
    margin: '0',
    color: '#e74c3c',
  };

  const messageStyle = {
    fontSize: '1.2rem',
    marginTop: '1rem',
    color: '#333',
  };

  const buttonStyle = {
    marginTop: '2rem',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>{errorCode}</h1>
        <p style={messageStyle}>Oops! Algo deu errado. Por favor, tente novamente mais tarde.</p>
        <button 
          style={buttonStyle} 
          onClick={() => navigate('/')}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;

