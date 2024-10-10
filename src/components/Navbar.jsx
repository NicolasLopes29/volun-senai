import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Logo from "../assets/images/logo.svg";
import "./../css/Navbar.css";
import Login from "./Login";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase-config";
import { useNavigate } from "react-router"; // Importando o useNavigate
import { Hamburger } from "../assets/images/icon-hamburger.svg";
import UsuarioMenu from "./UsuarioMenu";

const estiloModal = {
  overlay: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: -50,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 'auto',
  },
  content: {
    top: 20,
    right: 40,
    bottom: 20,
    left: 40,
    borderRadius: 32,
    position: 'relative',
    textAlign: 'center',
    backgroundColor: '#FBFBFE',
    width: 500,
  }
};

Modal.setAppElement('#root');

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [LoginAbrir, setLoginAbrir] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false); 
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(""); 
  const [botaoEstilo, setBotaoEstilo] = useState({}); 
  const navigate = useNavigate(); // Inicializando o useNavigate

  const auth = getAuth(app); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(true); 

        if (user.photoURL) {
          setFotoPerfilUrl(user.photoURL);
        } else {
          setFotoPerfilUrl(""); 
        }
      } else {
        setUsuarioLogado(false); 
        setFotoPerfilUrl(""); 
        setBotaoEstilo({}); 
      }
    });

    return () => unsubscribe(); 
  }, [auth]);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Retorna à página inicial
  const handleLogoClick = () => {
    navigate("/");
  };

  // Redireciona para a página de perfil ao clicar na imagem
  const handleProfileClick = () => {
    navigate("/usuario"); 
  };

  return (
    <>
      <nav className="navbar-container">
        <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="search-navbar">
          <img id="search-icon" src="src/assets/images/lupa.png" alt="" />
          <input type="text" placeholder="Busque aqui" />
        </div>
        <div className="navbar-menu-container">
          <a href="./../pages/Eventos.jsx">Eventos</a>
          <a href="./../pages/Sobre.jsx">Sobre Nós</a>
          <a href="./../pages/Organizacao.jsx">Sou uma organização</a>
        </div>
        {usuarioLogado ? (
          <div className="perfil-logout-container">
            {fotoPerfilUrl && (
              <div className="perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                <img src={fotoPerfilUrl} alt="Foto de perfil" className="foto-usuario" />
                <p>Olá</p>
              </div>
            )}
            <button
              onMouseOver={handleDropdown}
              className="logout-dpdw"
            >
              { Hamburger }
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content" >
                <UsuarioMenu />
              </div>
            )}
          </div>
        ) : (
          <button
            className="navbar-entrar"
            type="button"
            onClick={() => setLoginAbrir(true)}
          >
            Entrar / Registre-se
          </button>
        )}
        <button className="menu-button" onClick={toggleMenu}>
          {menuOpen ? <IoCloseSharp /> : <IoMdMenu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="sidebar">
          <ul>
            <li><a href="./../pages/Eventos.jsx">Eventos</a></li>
            <li><a href="./../pages/Sobre.jsx">Sobre Nós</a></li>
            <li><a href="./../pages/Organizacao.jsx">Sou uma organização</a></li>
          </ul>
        </div>
      )}
      <Modal
        isOpen={LoginAbrir}
        onRequestClose={() => setLoginAbrir(false)}
        style={estiloModal}
      >
        <Login fecharLogin={() => setLoginAbrir(false)} />
      </Modal>
    </>
  );
};

export default Navbar;


