import React from "react";
import "../Styles/styles.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <a href="visitas.html">
        <button>Visitas</button>
      </a>
      <a href="bitacoras.html">
        <button>Bitacoras</button>
      </a>
      <a href="certificacion.html">
        <button>Certificación</button>
      </a>
    </div>
  );
}

export default Sidebar;

// return (
//     <div className="sidebar">
//         <button><a href="/Visitas">Visitas</a> </button>
//         <button><a href="/bitacoras">Bitácoras</a> </button>
//         <button> <a href="/certificacion">Certificación</a></button>
//     </div>
// );
