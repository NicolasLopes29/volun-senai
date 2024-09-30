import React, { useState } from 'react';
import Logo from "./assets/img/logo-big.svg";
 import "./../css/Header.css";

 function Header() {
    return <div className="header">
        <img src={Logo} alt="logo" className="logo"></img>
        <h1>Central</h1>
    </div>;
}
 export default Header;