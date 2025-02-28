import React from "react";
import Navbar from "../Components/Navbar";
import VisitaForm from "../Components/VisitaForm";
import "../Styles/visitas.css";

function Visitas(){
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="visits-section">
                    <h2>Visitas </h2>
                    <div className="visits-row">
                        <input type="text" placeholder="Visita 1" />
                        <button>Ver</button>
                    </div>
                </div>
                <VisitaForm/>
            </div>
        </div>
    );
}

export default Visitas;