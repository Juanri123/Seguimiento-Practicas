import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/globalVars";

const ReportForm = ({ onAddReporte, onClose }) => {
  const navigate = useNavigate();
  const [reporte, setReporte] = useState({
    nombre: "",
    motivo: "",
    fecha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReporte({ ...reporte, [name]: value });
  };

  const uploadReport = async () => {
    const { nombre, motivo, fecha } = reporte;
    if (!nombre || !motivo || !fecha){
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
        toast: true,
        backdrop: true,
      });
      return;
    }

    try {
      const url = `${API_URL}/api/reportes`;
      const { data } = await axios.post(url, reporte);
      if (data.nuevoReporte) {
        onAddReporte(data.nuevoReporte);
        setReporte({ nombre: "", motivo: "", fecha: "" });
        onClose();
        console.log(data.nuevoReporte);
        
        await Swal.fire({
          title: "Reporte subido.",
          text: "El reporte fue subido exitosamente.",
          toast: true,
          position: "bottom-left",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
        });
      }
      navigate(0);
    } catch (error) {
      console.error("Error al subir el reporte:", error.response.data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadReport();
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h2 className="report-form__title">Agregar Reporte</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del reporte"
        className="report-form__input"
        value={reporte.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="motivo"
        placeholder="Motivo del reporte"
        className="report-form__input"
        value={reporte.motivo}
        onChange={handleChange}
      />
      <input
        type="date"
        name="fecha"
        className="report-form__input"
        value={reporte.fecha}
        onChange={handleChange}
      />
      <button type="submit" className="report-form__button">
        Subir Reporte
      </button>
    </form>
  );
};

export default ReportForm;