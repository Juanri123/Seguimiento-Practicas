import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../../api/globalVars";
import BitacoraForm from "./BitacoraForm";
import {ReactComponent as ArrowLeft} from "../../icons/ArrowLeft.svg";
import {ReactComponent as ArrowRight} from "../../icons/ArrowRight.svg";

const BitacoraList = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [error, setError] = useState("");
  const [rol, setRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [bitacoraRechazar, setBitacoraRechazar] = useState(null);

  const obtenerBitacoras = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bitacoras/verBitacoras`, {
        params: { pagina, limite: 6 },
      });
      setBitacoras(res.data.bitacoras);
      setTotalPaginas(res.data.totalPaginas);
    } catch (error) {
      console.error("Error al obtener las bitácoras:", error.response || error);
      setError("Error al obtener bitácoras. Consulta la consola para más detalles.");
    }
  }, [pagina]);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    const idGuardado = localStorage.getItem("usuarioId");
    if (rolGuardado) setRol(rolGuardado.toLowerCase());
    if (idGuardado) setIdUsuario(idGuardado);
    obtenerBitacoras();
  }, [obtenerBitacoras]);

  const handleAceptar = async (id) => {
    try {
      await axios.put(`${API_URL}/api/bitacoras/aceptar/${id}`);
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
        `${API_URL}/api/bitacoras/rechazar/${bitacoraRechazar.id}`,
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

  return (
    <section className="bitacora-list">
      {error && <p className="error-message">{error}</p>}

      {bitacoras.length > 0 ? (
        bitacoras.map((b, index) => (
          <div className={`bitacora-item estado${b.estado}`} key={b.id}>
            <p>
              <strong>Bitácora {index + 1 + (pagina - 1) * 6}</strong>
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

      {/* Paginación */}
      <div className="pagination-block">
        <button
          className="pagination-button"
          onClick={() => setPagina((p) => Math.max(p - 1, 1))}
          disabled={pagina <= 1}
        >
          <ArrowLeft />
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          className="pagination-button"
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina >= totalPaginas}
        >
          <ArrowRight />
        </button>
      </div>

      {rol === "aprendiz" && (
        <BitacoraForm bitacoras={bitacoras} onAddBitacora={obtenerBitacoras} />
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
