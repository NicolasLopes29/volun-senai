import React from "react";
import Logo from "../assets/images/logo.svg";
import { IoLogoFacebook } from "react-icons/io";
import { FaYoutube, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
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
          <div><IoLogoFacebook /></div>
          <div><FaInstagram /></div>
          <div><FaTwitter /></div>
          <div><FaPinterest /></div>
        </div>
      </div>
      <div className="footer-rights">
        <p>&copy; Volun. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
