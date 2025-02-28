import React from "react";
import "../Styles/styles.css";

function Sidebar(){
    return (
        <div className="sidebar">
            <button><a href="/Visitas">Visitas</a> </button>
            <button><a href="/bitacoras">Bitácoras</a> </button>
            <button> <a href="/certificacion">Certificación</a></button>
        </div>
    );
}

export default Sidebar;