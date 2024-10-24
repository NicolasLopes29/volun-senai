import React, { useState, useEffect} from "react";
import Modal from "react-modal";
import Logo from "../assets/images/logo.svg";
import "./../css/Navbar.css";
import Login from "./Login";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase-config";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import UsuarioMenu from "./UsuarioMenu";
import { MdOutlineArrowDropDown } from "react-icons/md";
import axios from "axios";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [LoginAbrir, setLoginAbrir] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false); 
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(""); 
  const [botaoEstilo, setBotaoEstilo] = useState({}); 
  const [userData, setUserData] = useState({
    nome : "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializando o useNavigate
  
  const auth = getAuth(app); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdown = () => {
    setUserMenu(!userMenu);
  };

  // Retorna à página inicial
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleGetUsername = async (uid) => {
    setError(false);
    
    try {
      const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
      setUserData(response.data, userData.nome);
    } 
    catch (error) {
      setError("Erro ao buscar dados do usuário.");
    }
  }
  // Redireciona para a página de perfil ao clicar na imagem
  const handleProfileClick = () => {
    navigate("/usuario"); 
  };

  const handleUserLogOut = () => {
    const auth = getAuth(); 
    signOut(auth)
        .then(() => {
            console.log("Usuário deslogado com sucesso!");
            navigate("/"); 
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erro ao deslogar: ", error);
        });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(true); 

        if (user.photoURL) {
          handleGetUsername(user.uid);
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
            <Link to="/">Sobre Nós</Link>
            <Link to="/cardong">Sou uma organização</Link>
        </div>
        {usuarioLogado ? (
          <div className="perfil-dropdown-container">
            {fotoPerfilUrl && (
              <div className="perfil-detalhes">
                <div className="perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                  <img src={fotoPerfilUrl} alt="Foto de perfil" className="foto-usuario" />
                </div>
                <div className="perfil-saudacao">
                  <p>Bem-Vindo</p>
                  <p>{userData.nome}</p>
                </div>
              </div>
            )}
            <button
              className="perfil-dropdown-button"
              onClick={handleDropdown}
            >
              <MdOutlineArrowDropDown className="perfil-dropdown" />
            </button>
            { userMenu &&(
                <UsuarioMenu/>
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
          <div className="sidebar-perfil-detalhes">
              <div className="sidebar-perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                <img src={fotoPerfilUrl} alt="Foto de perfil" className="foto-usuario" />
              </div>
              <div className="sidebar-perfil-saudacao">
                <p>Bem-Vindo</p>
              <p>{userData.nome}</p>
            </div>
          </div>
          <ul>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/">Sobre Nós</Link></li>
            <li><Link to="/cardong">Sou uma organização</Link></li>
          </ul>
          <button
              className="sidebar-button-logout"
              onClick={handleUserLogOut}
          >
            Deslogar
          </button>
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


