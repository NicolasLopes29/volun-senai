import React from 'react';
import './css/Navbar.css';

const NavBar = ({ setActiveTab }) => {
  return (
    <div className="navbar-container">
      <button onClick={() => setActiveTab('usuarios')}>usuarios</button>
      <button onClick={() => setActiveTab('historico')}>historico</button>
      <button onClick={() => setActiveTab('denuncias')}>denuncias</button>
      <button onClick={() => setActiveTab('eventos')}>eventos</button>
    </div>
  );
};

export default NavBar;
