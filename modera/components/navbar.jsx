import React from 'react';
import '../components/css/Navmod.css';

const NavBar = ({ setActiveTab }) => {
  return (
    <div className="navbar-container-mod">
      <button className='button-mod' onClick={() => setActiveTab('usuarios')}>usuarios</button>
      <button className='button-mod' onClick={() => setActiveTab('historico')}>historico</button>
      <button className='button-mod' onClick={() => setActiveTab('denuncias')}>denuncias</button>
      <button className='button-mod' onClick={() => setActiveTab('eventos')}>eventos</button>
    </div>
  );
};

export default NavBar;
