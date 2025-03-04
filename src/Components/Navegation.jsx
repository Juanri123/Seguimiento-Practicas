import React from "react";

function Navegation() {
  return (
    <>
      <nav className="navigation">
        <div className="menu-icon">
          <img
            src="./css/img/colombia-potencia-de-vida-logo (1).png"
            alt="Menu image"
          />
        </div>
        <div className="nav-buttons">
          <input
            id="search"
            type="text"
            placeholder="Buscar..."
            autocomplete="off"
          />
          <img src="./css/img/foto-persona.png" alt="User" />
          <img src="./css/img/sena-logo (1).png" alt="SENA logo" />
        </div>
      </nav>
    </>
  );
}

export default Navegation;
