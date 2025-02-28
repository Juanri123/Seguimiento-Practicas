import React, {useState} from "react";

function VisitaForm(){
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const toggleForm = () =>{
        setMostrarFormulario(!mostrarFormulario);
    };

    return(
        <div className="visitas-container">
            <button className="new-visit-button" onClick={toggleForm}>
                {mostrarFormulario ? "Cancelar solicitud" : "Solicitar visita"}
            </button>
            {mostrarFormulario && (
                <div className="visita-form">
                    <h2> Solicitud de visita </h2>
                    <input type="date" name="dia" placeholder="Dia de la visita" />
                    <input type="text" name="motivo" placeholder="Motivo de la visita" />
                    <button>Solicita </button>
                 </div>
            )}
        </div>
    );
}

export default VisitaForm;
