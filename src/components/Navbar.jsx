import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Logo from "../assets/images/logo.svg";
import "./../css/Navbar.css";
import Login from "./Login";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase-config";
import { Link, useNavigate } from "react-router-dom"; // Importando Link

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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  const handleLogoClick = () => {
    navigate("/");
  };

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
          <Link to="/eventos">Eventos</Link>
          <Link to="/sobre">Sobre Nós</Link>
          <Link to="/organizacao">Sou uma organização</Link>
        </div>
        {usuarioLogado ? (
          <div className="perfil-logout-container">
            {fotoPerfilUrl && (
              <div className="perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                <img src={fotoPerfilUrl} alt="Foto de perfil" className="foto-usuario" />
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="logout-button"
            >
              Deslogar
            </button>
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
            <li><Link to="/eventos">Eventos</Link></li>
            {/* <li><Link to="/sobre">Sobre Nós</Link></li> */}
            <li><Link to="/organizacao">Sou uma organização</Link></li>
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