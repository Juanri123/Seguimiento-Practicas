import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../../api/globalVars";
import axios from "axios";

const BitacoraForm = ({ onAddBitacora, bitacoras }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState("");
  const [bitacora, setBitacora] = useState({
    aprendiz_id: "",
    fecha: "",
    archivo: null,
  });
  const [rol, setRol] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    const idGuardado = localStorage.getItem("usuarioId");
    if (rolGuardado) {
      setRol(rolGuardado.toLowerCase());
    }
    if (idGuardado) {
      setBitacora((prev) => ({ ...prev, aprendiz_id: idGuardado }));
    }
  }, []);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bitacora.aprendiz_id || !bitacora.fecha || !bitacora.archivo) {
      return setError("Todos los campos son necesarios.");
    }

    if (bitacora.fecha !== today) {
      return setError("Sólo puede subir una bitácora en la fecha actual.");
    }

    if (bitacoras.length >= 6) {
      return setError("La cantidad máxima de bitáoras es 6.");
    }

    try {
      const formData = new FormData();
      formData.append("aprendiz_id", bitacora.aprendiz_id);
      formData.append("fecha", bitacora.fecha);
      formData.append("archivo", bitacora.archivo);

      const { data } = await axios.post(`${API_URL}/api/bitacoras`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.bitacora) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Bitácora subida exitosamente",
          showConfirmButton: false,
          timer: 1200,
          toast: true,
        });

        setIsFormVisible(false);
        setBitacora({
          aprendiz_id: bitacora.aprendiz_id,
          fecha: "",
          archivo: null,
        });
        onAddBitacora();

        // Notificar al Navbar
        window.dispatchEvent(new Event("notificacionesActualizadas"));
      } else {
        console.log("Error desconocido al subir la bitácora");
      }
    } catch (error) {
      console.error("Error al subir la bitácora:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBitacora({
      ...bitacora,
      [name]: name === "archivo" ? files[0] : value,
    });
  };

  if (rol !== "aprendiz") return null;

  return (
    <form onSubmit={handleSubmit}>
      <button className="button register-button" onClick={toggleForm}>
        Agregar Bitácora
      </button>
      {isFormVisible && (
        <section className="bitacora-form">
          <h2 className="bitacora-form__title">Agregar Bitácora</h2>

          <input
            type="file"
            name="archivo"
            className="input report-input"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="fecha"
            className="input visit-input"
            value={bitacora.fecha}
            onChange={handleChange}
            max={today}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              <span role="img" aria-label="error">
                ⚠️
              </span>
              {error}
              <button
                onClick={() => setError(null)}
                className="close-button"
                aria-label="cerrar alerta">
                ✖
              </button>
            </p>
          )}

          <button
            type="submit"
            className="button register-button"
            disabled={bitacoras.length >= 6}>
            {bitacoras.length >= 6
              ? "Has alcanzado el límite de 6 bitácoras"
              : "Subir Bitácora"}
          </button>
        </section>
      )}
    </form>
  );
};

export default BitacoraForm;