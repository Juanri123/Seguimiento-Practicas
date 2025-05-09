import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../generales/NavBar';
import Sidebar from '../generales/Sidebar';
import { API_URL } from '../../api/globalVars';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  const obtenerUsuarios = async () => {
    try {
      const url = `${API_URL}/api/usuarios/listarUsuarios`;
      const response = await axios.get(url);
      const data = response.data;
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.log(error.response);
      setError('No se pudieron obtener los usuarios.');
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="content">
        <h1>Usuarios</h1>
        {usuarios.length > 0 ?  (
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
      </div>
    </div>
  );
};

export default Usuarios;