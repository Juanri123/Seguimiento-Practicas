import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../../api/globalVars";
import BitacoraForm from "./BitacoraForm";

const BitacoraList = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [error, setError] = useState("");
  const [rol, setRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [bitacoraRechazar, setBitacoraRechazar] = useState(null);

  const urlBitacoras = `${API_URL}/api/bitacoras/verBitacoras`;
  const urlAceptar = `${API_URL}/api/bitacoras/aceptar`;
  const urlRechazar = `${API_URL}/api/bitacoras/rechazar`;

  const obtenerBitacoras = useCallback(async () => {
    try {
      const res = await axios.get(urlBitacoras);
      setBitacoras(res.data);
    } catch (error) {
      console.error("Error al obtener las bitácoras:", error.response || error);
      setError("Error al obtener bitácoras. Consulta la consola para más detalles.");
    }
  }, []);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    const idGuardado = localStorage.getItem("usuarioId");
    if (rolGuardado) setRol(rolGuardado.toLowerCase());
    if (idGuardado) setIdUsuario(idGuardado);
    obtenerBitacoras();
  }, [obtenerBitacoras]);

  const handleAceptar = async (id) => {
    try {
      await axios.put(`${urlAceptar}/${id}`);
      obtenerBitacoras();
    } catch (error) {
      console.error("Error al aceptar bitácora:", error);
    }
  };

  const handleRechazar = (bitacora) => {
    setBitacoraRechazar(bitacora);
    setMostrarMotivoPopup(true);
  };

  const confirmarRechazo = async () => {
    try {
      await axios.put(
        `${urlRechazar}/${bitacoraRechazar.id}`,
        { motivo: motivoRechazo },
        { headers: { "Content-Type": "application/json" } }
      );

      const idAprendiz = bitacoraRechazar.aprendiz_id;
      const claveNotificaciones = `notificaciones_${idAprendiz}`;
      const notificaciones = JSON.parse(localStorage.getItem(claveNotificaciones)) || [];

      const nuevaNotificacion = {
        id: Date.now(),
        mensaje: `Tu bitácora fue rechazada. Motivo: ${motivoRechazo}`,
        estado: "pendiente",
      };

      localStorage.setItem(
        claveNotificaciones,
        JSON.stringify([...notificaciones, nuevaNotificacion])
      );
      window.dispatchEvent(new Event("notificacionesActualizadas"));

      setMostrarMotivoPopup(false);
      setMotivoRechazo("");
      setBitacoraRechazar(null);
      obtenerBitacoras();
    } catch (error) {
      console.error("Error al rechazar bitácora:", error.response?.data || error);
      setMostrarMotivoPopup(false);
      setMotivoRechazo("");
      setBitacoraRechazar(null);
    }
  };

  const renderArchivo = (archivo) => {
    if (!archivo) return <p>Sin archivo</p>;
    const fileUrl = `http://localhost:3000/uploads/${archivo}`;
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        Ver archivo
      </a>
    );
  };

  const bitacorasFiltradas =
    rol === "aprendiz"
      ? bitacoras.filter((b) => String(b.aprendiz_id) === String(idUsuario))
      : bitacoras;

  return (
    <section className="bitacora-list">
      {error && <p className="error-message">{error}</p>}

      {bitacorasFiltradas.length > 0 ? (
        bitacorasFiltradas.map((b, index) => (
          <div className={`bitacora-item estado${b.estado}`} key={b.id}>
            <p>
              <strong>Bitácora {index + 1}</strong>
            </p>
            {renderArchivo(b.archivo)}
            <p>Fecha: {b.fecha}</p>
            {rol === "instructor" && (
              <div className="bitacora-buttons">
                <button className="button accept" onClick={() => handleAceptar(b.id)}>
                  ✔️
                </button>
                <button className="button reject" onClick={() => handleRechazar(b)}>
                  ❌
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay bitácoras</p>
      )}

      {rol === "aprendiz" && (
        <BitacoraForm bitacoras={bitacorasFiltradas} onAddBitacora={obtenerBitacoras} />
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
              <button onClick={confirmarRechazo} className="popup-confirm">
                Confirmar
              </button>
              <button onClick={() => setMostrarMotivoPopup(false)} className="popup-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BitacoraList;
