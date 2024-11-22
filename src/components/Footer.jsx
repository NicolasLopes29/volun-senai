import React from "react";
import Logo from "../assets/logos/logo.svg";
import { IoLogoFacebook } from "react-icons/io";
import { FaYoutube, FaTwitter, FaPinterest, FaInstagram } from "react-icons/fa";
import "./../css/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  
  return (
    <footer className="footer-container">
      <div className="footer-row">
        <div className="footer-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="footer-links">
          <link href="/">Home</link>
          <link href="/">Eventos</link>
        </div>
        <div className="footer-links">
          <link href="/">Sou uma organização</link>
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