import React from "react";
import { Link } from "react-router-dom";
import "../Styles/login.css";
import logoColombia from "../assets/colombia-potencia-de-vida-logo.png";
import logoSena from "../assets/sena-logo-s.png";

function Header(){
    return (
        <header className="header">
            <nav>
        <Link to="/">Inicio</Link>
        <Link to="/login">Iniciar Sesión</Link> 
      </nav>
            <div className="cbz1"></div>
            <div className="cbz2">
                <img src= {logoColombia} alt="Colombia Potencia de Vida" className="logo"/>
                <img src={logoSena} alt="SENA" className="logo" />
            </div>
        </header>
    );
}

export default Header;