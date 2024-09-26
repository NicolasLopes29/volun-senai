import React from "react";
import Logo from "../assets/logos/logo.svg";
import { IoLogoFacebook } from "react-icons/io";
import { FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import "./../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-row">
        <div className="footer-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/">Eventos</a>
          <a href="/">Sobre Nós</a>
        </div>
        <div className="footer-links">
          <a href="/">Contato</a>
          <a href="/">Sou uma organização</a>
          <a href="/">Enviar Feedback</a>
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
