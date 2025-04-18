import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../generales/NavBar";
import Sidebar from "../generales/Sidebar";

function Visitas() {
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [visitas, setVisitas] = useState([]);
  const [visitaEditando, setVisitaEditando] = useState(null);
  const [rol, setRol] = useState("");

  const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [visitaRechazar, setVisitaRechazar] = useState(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    if (rolGuardado) {
      setRol(rolGuardado.toLowerCase());
    }
    obtenerVisitas();
  }, []);

  const obtenerVisitas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/visitas/verVisitas");
      setVisitas(response.data.visitas || []);
    } catch (error) {
      console.error("Error al obtener visitas:", error.message);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setModoEdicion(false);
    setVisitaEditando(null);
  };

  const handleAddOrUpdateVisita = async (e) => {
    e.preventDefault();

    const nuevaVisita = {
      fecha: e.target["dia"].value,
      tipo: e.target["tipo-visita"].value,
      direccion: e.target["direccion-visita"].value,
    };

    try {
      const url = modoEdicion
        ? `http://localhost:3000/api/visitas/${visitaEditando.id}`
        : "http://localhost:3000/api/visitas";
      const method = modoEdicion ? "put" : "post";

      const response = await axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: nuevaVisita,
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message || "Error en la solicitud");
      }

      await obtenerVisitas();
      e.target.reset();
      setShowForm(false);
      setModoEdicion(false);
      setVisitaEditando(null);
    } catch (error) {
      console.error("Error al crear o actualizar visita:", error.message);
    }
  };

  const handleEditar = (visita) => {
    setModoEdicion(true);
    setVisitaEditando(visita);
    setShowForm(true);
  };

  const handleAceptar = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/visitas/aceptar/${id}`);
      await obtenerVisitas();
    } catch (error) {
      console.error("Error al aceptar visita:", error);
    }
  };

  const handleRechazar = (visita) => {
    setVisitaRechazar(visita);
    setMostrarMotivoPopup(true);
  };

  const confirmarRechazo = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/visitas/rechazar/${visitaRechazar.id}`,
        { motivo: motivoRechazo },
        { headers: { "Content-Type": "application/json" } }
      );

      // Guardar notificación en localStorage
      const notificaciones = JSON.parse(localStorage.getItem("notificaciones")) || [];
      const nuevaNotificacion = {
        id: Date.now(),
        mensaje: `Tu visita del ${visitaRechazar.fecha.split("T")[0]} fue rechazada. Motivo: ${motivoRechazo}`,
        estado: "pendiente",
      };
      localStorage.setItem("notificaciones", JSON.stringify([...notificaciones, nuevaNotificacion]));

      setMostrarMotivoPopup(false);
      setMotivoRechazo("");
      setVisitaRechazar(null);
      await obtenerVisitas();
    } catch (error) {
      console.error("Error al rechazar visita:", error);
    }
  };

  return (
    <div className="container">
      <NavBar />
      <Sidebar />
      <div className="visits-section">
        <h2 className="visit-list__title">Visitas</h2>

        <div className="visit-list">
          {visitas.length === 0 ? (
            <p>No hay visitas registradas</p>
          ) : (
            visitas.map((visita) => (
              <div key={visita.id} className={`report-list__item estado-${visita.estado}`}>
                <p><strong>Dirección:</strong> {visita.direccion}</p>
                <p><strong>Tipo:</strong> {visita.tipo}</p>
                <p><strong>Fecha:</strong> {visita.fecha.split("T")[0]}</p>

                {rol === "aprendiz" && (
                  <button className="visit-list__buttone" onClick={() => handleEditar(visita)}>
                    Editar
                  </button>
                )}

                {rol === "instructor" && (
                  <div className="visit-buttons">
                    <button
                      className="visit-list__button accept"
                      onClick={() => handleAceptar(visita.id)}
                    >
                      ✔️
                    </button>
                    <button
                      className="visit-list__button reject"
                      onClick={() => handleRechazar(visita)}
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {showForm && (
          <form className="visit-form" onSubmit={handleAddOrUpdateVisita}>
            <h2>{modoEdicion ? "Editar Visita" : "Solicitud de Visita"}</h2>
            <input
              type="date"
              name="dia"
              className="visit-form__input"
              required
              defaultValue={modoEdicion ? visitaEditando.fecha.split("T")[0] : ""}
            />
            <input
              type="text"
              name="direccion-visita"
              placeholder="Dirección de la visita"
              className="visit-form__input"
              required
              defaultValue={modoEdicion ? visitaEditando.direccion : ""}
            />
            <select
              name="tipo-visita"
              className="login-input"
              required
              defaultValue={modoEdicion ? visitaEditando.tipo : ""}
            >
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
            </select>
            <button type="submit" className="visit-form__button">
              {modoEdicion ? "Actualizar" : "Solicitar"}
            </button>
          </form>
        )}

        {rol === "aprendiz" && (
          <button className="new-visit-button" onClick={toggleForm}>
            {showForm ? "Cancelar" : "Solicitar visita"}
          </button>
        )}

        {mostrarMotivoPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Motivo del rechazo</h3>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Escribe el motivo del rechazo..."
                className="popup-textarea"
              />
              <div className="popup-buttons">
                <button onClick={confirmarRechazo} className="popup-confirm">Confirmar</button>
                <button onClick={() => setMostrarMotivoPopup(false)} className="popup-cancel">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Visitas;