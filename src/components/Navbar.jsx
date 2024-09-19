import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Logo from "../assets/images/logo.svg";
import "./../css/Navbar.css";
import Login from "./Login";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase-config";

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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [LoginAbrir, setLoginAbrir] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false); // Novo estado para acompanhar o login
  const [botaoEstilo, setBotaoEstilo] = useState({}); // Estado para o estilo do botão

  const auth = getAuth(app); // Autenticação Firebase

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Monitorando o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(true); // Usuário logado
        setBotaoEstilo({
          backgroundColor: "red"
        });
      } else {
        setUsuarioLogado(false); // Usuário deslogado
        setBotaoEstilo({}); // Reseta o estilo do botão ao estado inicial
      }
    });

    return () => unsubscribe(); // Cleanup no unmount
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
        window.location.reload(); // Recarrega a página ao deslogar
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  return (
    <>
      <nav className="navbar-container">
        <img src={Logo} alt="Logo" className="logo" />
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
          <button
            type="button"
            onClick={handleLogout}
            style={botaoEstilo} // Estilo inline condicional para "Deslogar"
          >
            Deslogar
          </button>
        ) : (
          <button
            className="navbar-entrar"
            type="button"
            onClick={() => setLoginAbrir(true)}
            style={botaoEstilo} // Estilo inline condicional para "Entrar / Registre-se"
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

