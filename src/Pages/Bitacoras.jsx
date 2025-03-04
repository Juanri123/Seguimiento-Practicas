import React, { useState } from "react";
import Navegation from "../Components/Navegation";
import Sidebar from "../Components/Sidebar";
import "../Styles/bitacoras.css";

function Bitacoras() {
  const [showForm, setShowForm] = useState(false);
  const [bitacoras, setBitacoras] = useState([
    { id: 1, nombre: "Bitácora 1", numero: "001" },
    { id: 2, nombre: "Bitácora 2", numero: "002" },
  ]);

  function toggleForm() {
    setShowForm(!showForm);
  }

  function handleAddBitacora(e) {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const numero = e.target.numero.value;

    if (nombre && numero) {
      setBitacoras([
        ...bitacoras,
        { id: bitacoras.length + 1, nombre, numero },
      ]);
      e.target.reset();
      setShowForm(false);
    }
  }

  return (
    <div>
      <Navegation />
      <div className="container">
        <Sidebar />
        <div className="content">
          <h2>Bitácoras</h2>
          <div className="bitacora-list">
            {bitacoras.map((bitacora) => (
              <div className="bitacora-item" key={bitacora.id}>
                <span>{bitacora.nombre}</span>
                <button>Ver</button>
              </div>
            ))}
          </div>
          <button className="add-bitacora" onClick={toggleForm}>
            {showForm ? "Cancelar" : "Agregar Bitácora"}
          </button>

          {showForm && (
            <form className="bitacora-form" onSubmit={handleAddBitacora}>
              <h2>Agregar Bitácora</h2>
              <input type="file" name="archivo" placeholder="Cargar Archivo" />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la bitácora"
                required
              />
              <input
                type="text"
                name="numero"
                placeholder="Número de la bitácora"
                required
              />
              <button type="submit">Subir Bitácora</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bitacoras;
