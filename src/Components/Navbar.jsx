import React from "react";
import "../Styles/styles.css";
import logoColombia from "../assets/colombia-potencia-de-vida-logo (1).png";
import userIcon from "../assets/foto-persona.png";
import senaLogo from "../assets/sena-logo (1).png";

function Navbar(){
    return( 
    <nav className="navbar">
        <div className="menu-icon">
            <img src={logoColombia} alt="Menú" width="30" />
        </div>
        <div clasName="nav-buttons">
            <input type="text" placeholder="Buscar..."/>
            <img src={userIcon} alt="Usuario" width="30" />
            <img src={senaLogo} alt="Inicio" width="30" />
        </div>
    </nav>
    );
}
export default Navbar;