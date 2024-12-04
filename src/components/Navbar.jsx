import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebase-config";
import Login from "./Login";
import UsuarioMenu from "./UsuarioMenu";
import Modal from "react-modal";
import defaultProfile from "../assets/images/userphoto.jpg";

import "./../css/Navbar.css";
import Logo from "../assets/images/logo.svg";


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
    backdropFilter: 'blur(8px)',
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
  const [userData, setUserData] = useState({
    nome: "",
  });
  const [showIncompleteModal, setShowIncompleteModal] = useState(false); // Modal de cadastro incompleto
  const [incompleteEmail, setIncompleteEmail] = useState(""); // Email do cadastro incompleto
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdown = () => {
    setUserMenu(!userMenu);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleGetUsername = async (uid) => {
    try {
      // Fetch para buscar o usuário
      const userResponse = await fetch(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
      
      // Verificando se o usuário existe
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          // Não exibe erro 404 no console
          setIncompleteEmail(incompleteEmail);
          setRedirectPath("/dados_pessoal");
          setShowIncompleteModal(true);
        }
        return;
      }
  
      const userData = await userResponse.json();
      
      // Se o usuário não existir
      if (!userData) {
        setIncompleteEmail(incompleteEmail);
        setRedirectPath("/dados_pessoal");
        setShowIncompleteModal(true);
        return;
      }
  
      // Fetch para buscar o endereço
      const enderecoResponse = await fetch(`https://volun-api-eight.vercel.app/endereco/usuario/${uid}`);
      
      // Verificando se o endereço não existe
      if (!enderecoResponse.ok || enderecoResponse.status === 404) {
        // Não exibe erro 404 no console
        setRedirectPath("/dados_endereco");
        setIncompleteEmail(incompleteEmail);
        setShowIncompleteModal(true);
        return;
      }
  
      const enderecoData = await enderecoResponse.json();
  
      // Se o endereço não for encontrado, exibe a modal
      if (!enderecoData) {
        setRedirectPath("/dados_endereco");
        setIncompleteEmail(incompleteEmail);
        setShowIncompleteModal(true);
        return;
      }
  
    } catch (error) {
      // Aqui estamos tratando especificamente o erro 404, mas não exibe no console
      if (error instanceof Error && error.message.includes("404")) {
        return;
      }
    }
  };
  

  
  
  
  
  
  

  const handleProfileClick = () => {
    navigate("/usuario");
  };

  const handleUserLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  const OpenModal = () => {
    setLoginAbrir(true);
    setMenuOpen(false);
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
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleOrgPageRedirect = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      // Se o usuário não estiver logado, exibe um alerta e retorna
      alert("Você precisa estar logado para acessar esta página.");
      return;
    }
  
    try {
      // Requisição para verificar as ONGs do usuário
      const response = await axios.get(
        `https://volun-api-eight.vercel.app/organizacao/criador/${user.uid}`
      );
  
      if (response.data && response.data.length > 0) {
        // Se o usuário tiver uma ou mais ONGs criadas, navega para a página /ong
        navigate(`/ong`);
      } else {
        // Caso contrário, navega para a página /cardong
        navigate("/cardong");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Tratar 404 como ausência de organizações
        console.warn("Nenhuma organização encontrada para o usuário.");
        navigate("/cardong");
      } else {
        // Outros erros
        console.error("Erro ao verificar organizações do usuário:", error);
        alert("Ocorreu um erro ao tentar verificar suas organizações.");
      }
    }
  };
  

  return (
    <>
      <nav className="navbar-container">
        <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="navbar-menu-container">
          <Link to="/eventos" id="navbar-eventos">Eventos</Link>
          <button onClick={handleOrgPageRedirect} id="navbar-org" >Sou uma organização</button>
        
          {usuarioLogado ? (
            <div className="perfil-dropdown-container">
              {fotoPerfilUrl && (
                <div className="perfil-detalhes">
                  <div className="perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                    <img src={fotoPerfilUrl || defaultProfile} alt="Foto de perfil" className="foto-usuario" />
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
              {userMenu && <UsuarioMenu />}
            </div>
          ) : (
            <button
              className="navbar-entrar"
              type="button"
              onClick={() => setLoginAbrir(true)}
            >
              👤 Entrar
            </button>
          )}
        </div>
        <button className="menu-button" onClick={toggleMenu}>
          {menuOpen ? <IoCloseSharp /> : <IoMdMenu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="sidebar">
          {usuarioLogado ? (
            <div className="perfil-dropdown-container">
              {fotoPerfilUrl && (
                <div className="perfil-detalhes">
                  <div className="perfil-foto" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
                    <img src={fotoPerfilUrl || defaultProfile} alt="Foto de perfil" className="foto-usuario" />
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
              {userMenu && <UsuarioMenu />}
            </div>
          ) : (
            <button
              className="navbar-entrar"
              type="button"
              onClick={OpenModal}
            >
              👤 Entrar
            </button>
          )}
          <ul>
            <li><Link to="/eventos" id="navbar-eventos">Eventos</Link></li>
            <li><Link to="/cardong" id="navbar-org">Sou uma organização</Link></li>
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

      <Modal
        isOpen={showIncompleteModal}
        onRequestClose={() => {}}
        shouldCloseOnOverlayClick={false}
        style={estiloModal}
      >
        <div className="modal-container">
          <div className="modal-header">Cadastro Incompleto</div>
          <div className="modal-body">
            O cadastro para a conta {incompleteEmail} não foi concluído. Por favor, finalize seu cadastro para continuar utilizando a plataforma.
          </div>
          <div className="modal-footer">
            <button
              className="modal-button"
              onClick={() => {
                setShowIncompleteModal(false);
                navigate(redirectPath);
              }}
            >
              Finalizar Cadastro
            </button>
          </div>
        </div>
      </Modal>


    </>
  );
};

export default Navbar;
