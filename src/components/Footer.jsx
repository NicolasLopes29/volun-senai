import React from "react";
import Logo from "../assets/logos/logo.svg";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { app } from "../services/firebase-config";
import { IoLogoFacebook } from "react-icons/io";
import { FaYoutube, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import "./../css/Footer.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

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
    <footer className="footer-container">
      <div className="footer-row">
        <div className="footer-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/eventos" id="navbar-eventos">Eventos</Link>
        </div>
        <div className="footer-links">
        <button onClick={handleOrgPageRedirect} id="navbar-org" >Sou uma organização</button>
        </div>

        <div className="footer-social-icons">
          <div className="footer-icons"><IoLogoFacebook /></div>
          <div className="footer-icons"><FaInstagram /></div>
          <div className="footer-icons"><FaTwitter /></div>
          <div className="footer-icons"><FaPinterest /></div>
        </div>
      </div>
      <div className="footer-rights">
        <p>&copy; Volun. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;