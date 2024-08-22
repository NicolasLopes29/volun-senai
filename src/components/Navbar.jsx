import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import Logo from "../assets/images/logo.svg";
import "./../css/Navbar.css";
import Login from "./Login";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";

const Navbar = () => {
  const [AbrirMenu, setAbrirMenu] = useState(false);
  const [AbrirLogin, setAbrirLogin] = useState(false);

  const toggleMenu = () => {
    setAbrirMenu(!AbrirMenu);
  };
  
  return (
    <>
      <nav className="navbar-container">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="navbar-input-pesquisa">
          <input type="text" placeholder="busque aqui" />
        </div>
        <div className="navbar-menu-container">
          <a href="./../pages/Eventos.jsx">Eventos</a>
          <a href="./../pages/Sobre.jsx">Sobre Nós</a>
          <a href="./../pages/Organizacao.jsx">Sou uma organização</a>
        </div>
        <button type="button" onClick={() => setAbrirLogin(true)}>Entrar</button>
        <button className="navbar-menu-button" onClick={toggleMenu}>
          {AbrirMenu ? <IoCloseSharp /> : <IoMdMenu />}
        </button>
      </nav>
      {AbrirMenu && (
        <div className="navbar-sidebar">
          <ul>
            <li><a href="./../pages/Eventos.jsx">Eventos</a></li>
            <li><a href="./../pages/Sobre.jsx">Sobre Nós</a></li>
            <li><a href="./../pages/Organizacao.jsx">Sou uma organização</a></li>
          </ul>
        </div>
      )}
      <Modal
        isOpen = {AbrirLogin}
        onRequestClose={() => setAbrirLogin(false)}
        style={{
          overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            inset: 'auto',
            position: 'relative',
            top: 50,
            borderRadius: 32,
            textAlign: 'center',
            backgroundColor: '#FBFBFE', 
            width: 500,
          }
        }}
      >
        <Login fecharLogin = {() => setAbrirLogin(false)}></Login>
      </Modal>
    </>
  );
};

export default Navbar;


