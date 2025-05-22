import {useState, useEffect} from "react";
import axios from "axios";
import NavBar from "../generales/NavBar";
import ReportForm from "./ReportForm";
import Sidebar from "../generales/Sidebar";
import Swal from "sweetalert2";
import {API_URL} from "../../api/globalVars";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [rol, setRol] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    if (rolGuardado) {
      setRol(rolGuardado.toLocaleLowerCase());
    }
  }, []);

  useEffect(() => {
    obtenerReportes(pagina);
  }, [pagina]);

  const obtenerReportes = async (pagina = 1) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/reportes/verReportes`, {
        params: {
          pagina,
          limite: 6
        }
      });

      setReportes(data.reportes || []);
      setTotalPaginas(data.totalPaginas);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setReportes([]);
        setTotalPaginas(1);
      } else {
				Swal({
					title: 'Error en reportes',
					toast: true,
					position: 'bottom-left',
					text: error.message,
          icon: 'error'
				})
        console.error("Error al obtener reportes:", error.message);
      }
    }
  };

  const toggleForm = () => setMostrarFormulario(!mostrarFormulario);

  const agregarReporte = (nuevoReporte) => {
    setReportes((prev) => [...prev, nuevoReporte]);
  };

  const deleteReport = async (e) => {
    const id = e.target.id;
    const url = `${API_URL}/api/reportes/${id}`;
    try {
      await axios.delete(url);

      await Swal.fire({
        title: "Reporte eliminado.",
        text: "El reporte fue eliminado correctamente.",
        toast: true,
        position: "bottom-left",
        icon: "success",
        showConfirmButton: false,
        timer: 1200
      });
      const updatedReports = reportes.filter((reporte) => reporte.id !== id);
      setReportes(updatedReports);
      obtenerReportes();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar reporte",
        text: "No se pudo eliminar el reporte.",
        toast: true,
        timer: 1200,
        showConfirmButton: false,
        position: "bottom-left",
				icon: 'error',
				timer: 1200
      });
    }
  };

  return (
    <div className="container">
      <NavBar />
      <Sidebar />
      <div className="content">
        <h3 className="report-list__title">Reportes</h3>

        {reportes.length === 0 ? (
          <p>No existen reportes</p>
        ) : (
          reportes.map((reporte) => (
            <div className="report-list__item" key={reporte.id}>
              <p>{reporte.nombre}</p>
              <p>{reporte.motivo}</p>
              <p>{reporte.fecha}</p>
              <button
                id={reporte.id}
                onClick={deleteReport}
                className="report-list__button delete-button">
                <img
                  id="delete-img"
                  src="../assets/img/trash.png"
                  alt="Eliminar"
                />
              </button>
            </div>
          ))
        )}

        <div className="pagination-block">
          <button
            className="pagination-button"
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina <= 1}>
            Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            className="pagination-button"
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina >= totalPaginas}>
            Siguiente
          </button>
        </div>

        {rol === "instructor" && (
          <>
            <button className="button register-button" onClick={toggleForm}>
              {mostrarFormulario ? "Cerrar Formulario" : "Agregar Reporte"}
            </button>

            {mostrarFormulario && (
              <ReportForm onAddReporte={agregarReporte} onClose={toggleForm} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reportes;