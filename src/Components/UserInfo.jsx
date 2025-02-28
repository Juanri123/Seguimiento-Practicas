import React from "react";
import "../Styles/styles.css";
import userIcon from "../assets/foto-persona.png";

function UserInfo(){
    return(
    <div classsName="info-section">
            <img src={userIcon} alt="perfil" />
        <div>
            <h2>Información del Aprendiz</h2>
            <p>Nombre del aprendiz, detalles del perfil, etc.</p>
        </div>
    </div>

    );
}
export default UserInfo;