import React from "react";
import Navegation from "../Components/Navegation";
import Sidebar from "../Components/Sidebar";
import UserInfo from "../Components/UserInfo";
import "../Styles/styles.css";

function Inicio() {
  return (
    <div>
      <Navegation />
      <div className="container">
        <Sidebar />
        <div className="content">
          <UserInfo />
          <div className="pending-info-section">
            <h3>Información del aprendiz</h3>
            <p>
              Aquí va la información sobre las taeas o actividades pendiente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Inicio;
