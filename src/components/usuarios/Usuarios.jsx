import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Navbar from "../generales/NavBar";
import Sidebar from "../generales/Sidebar";
import { API_URL } from "../../api/globalVars";
import Swal from "sweetalert2";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      const response = await axios.get(
        `${API_URL}/api/usuarios/listarUsuarios`,
        {
          params: {
            page: pagina,
            limit: 10,
          },
        }
      );

      const data = response.data.usuarios;
      setUsuarios(data || []);
      setTodosLosUsuarios(data || []);
      setTotalRegistros(data.totalUsuarios || 0);
      setTotalPaginas(data.totalPages || 1);
      setCargando(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los usuarios. Inténtalo de nuevo más tarde.",
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
      });
      setCargando(false);
    }
  };

  const filtrarUsuario = (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    if (valorBusqueda === "") {
      setUsuarios(todosLosUsuarios);
      return;
    } else {
      const usuariosFiltrados = todosLosUsuarios.filter(
        (usuario) =>
          usuario.identificacion.toLowerCase().includes(valorBusqueda) ||
          usuario.nombres.toLowerCase().includes(valorBusqueda) ||
          usuario.apellidos.toLowerCase().includes(valorBusqueda)
      );
      setUsuarios(usuariosFiltrados);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, [pagina]);

  const handlePageChange = (page) => {
    setPagina(page);
  };

  const handleChange = (e) => {
    filtrarUsuario(e);
  };

  const columnas = [
    {
      id: "nombre",
      name: "Nombre",
      selector: (usuario) => usuario.nombres + " " + usuario.apellidos,
      grow: 2,
    },
    {
      id: "correo",
      name: "Correo",
      selector: (usuario) => usuario.correo,
      grow: 2,
    },
    {
      id: "identificacion",
      name: "Identificación",
      selector: (usuario) => usuario.identificacion,
    },
    {
      id: "rol",
      name: "Rol",
      selector: (usuario) => usuario.rol,
    },
  ];

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="content">
        <input
          type="search"
          className="input register-input"
          placeholder="Realice su búsqueda ..."
          onChange={handleChange}
        />
        <DataTable
          columns={columnas}
          data={usuarios}
          noDataComponent={<div>No hay usuarios registrados.</div>}
          onChangePage={handlePageChange}
          pagination
          paginationDefaultPage={pagina}
          paginationPerPage={10}
          paginationServer
          paginationTotalRows={totalRegistros}
          progressPending={cargando}
          responsive
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default Usuarios;