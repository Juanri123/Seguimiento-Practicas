import React, { useState } from "react";
import "../Styles/visitas.css"; // Importa los estilos específicos para visitas

function Visitas() {
  const [showForm, setShowForm] = useState(false);
  const [visitas, setVisitas] = useState([
    {
      id: 1,
      nombre: "Visita 1",
      motivo: "Revisión de proyecto",
      fecha: "2025-03-04",
    },
    {
      id: 2,
      nombre: "Visita 2",
      motivo: "Asesoría técnica",
      fecha: "2025-03-05",
    },
  ]);

  function toggleForm() {
    setShowForm(!showForm);
  }

  function handleAddVisita(e) {
    e.preventDefault();
    const fecha = e.target.dia.value;
    const motivo = e.target.motivo.value;

    if (fecha && motivo) {
      setVisitas([
        ...visitas,
        {
          id: visitas.length + 1,
          nombre: `Visita ${visitas.length + 1}`,
          motivo,
          fecha,
        },
      ]);
      e.target.reset();
      setShowForm(false);
    }
  }

  return (
    <div className="container">
      <h2>Visitas</h2>

      <div className="visits-section">
        {visitas.map(function (visita) {
          return (
            <div className="visit-row" key={visita.id}>
              <span>
                {visita.nombre} - {visita.motivo} ({visita.fecha})
              </span>
              <button>Ver</button>
            </div>
          );
        })}
      </div>

      <button className="new-visit-button" onClick={toggleForm}>
        {showForm ? "Cancelar" : "Solicitar visita"}
      </button>

      {showForm && (
        <form
          className="visita-form"
          id="visitaForm"
          onSubmit={handleAddVisita}
        >
          <h2>Solicitud de visita</h2>
          <input
            type="date"
            name="dia"
            placeholder="Día de la visita"
            required
          />
          <input
            type="text"
            name="motivo"
            placeholder="Motivo de la visita"
            required
          />
          <button type="submit">Solicitar</button>
        </form>
      )}
    </div>
  );
}

export default Visitas;
