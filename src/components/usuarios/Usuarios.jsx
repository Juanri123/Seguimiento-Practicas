import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../generales/NavBar";
import Sidebar from "../generales/Sidebar";
import { API_URL } from "../../api/globalVars";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, seTtotalPaginas] = useState(1);

  const obtenerUsuarios = async (page) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/usuarios/listarUsuarios`,
        {
          params: {
            page: page,
            limit: 6,
          },
        }
      );

      const data = response.data;
      setUsuarios(data.usuarios || []);
      seTtotalPaginas(data.totalPages || 1);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    obtenerUsuarios(pagina);
  }, [pagina]);

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="content">
        {usuarios.length > 0 ? (
          usuarios.map((user) => (
            <div className="report-list__item" key={user.id}>
              <p>{user.nombres + user.apellidos}</p>
              <p>{user.correo}</p>
              <p>{user.identificacion}</p>
              <p>{user.rol}</p>
            </div>
          ))
        ) : (
          <p>No hay usuarios registrados.</p>
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
      </div>
    </div>
  );
};

export default Usuarios;