import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const BitacoraForm = ({ onAddBitacora, bitacoras }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [bitacora, setBitacora] = useState({
    usuarioId: '',
    fecha: '',
    archivo: null,
  });
  const [rol, setRol] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const rolGuardado = localStorage.getItem('rol');
    const idGuardado = localStorage.getItem('usuarioId'); // Aquí capturamos el id desde localStorage
    if (rolGuardado) {
      setRol(rolGuardado.toLowerCase());
    }
    if (idGuardado) {
      setBitacora((prev) => ({ ...prev, id_usuario: idGuardado }));
    }
  }, []);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bitacora.id_usuario || !bitacora.fecha || !bitacora.archivo) {
      alert('Completa todos los campos.');
      return;
    }

    if (bitacora.fecha !== today) {
      alert('Solo puedes subir la bitácora con la fecha actual.');
      return;
    }

    if (bitacoras.length >= 6) {
      alert('Ya has subido el máximo de 6 bitácoras.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_usuario', bitacora.id_usuario);
      formData.append('fecha', bitacora.fecha);
      formData.append('archivo', bitacora.archivo);

      const res = await fetch('http://localhost:3000/api/bitacoras/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al subir la bitácora.');
      }

      const data = await res.json();

      if (data.bitacora) {
        Swal.fire({
                position: "top",
                icon: "success",
                title: "Bitacora subita exitosamente",
                showConfirmButton: false,
                timer: 1200,
                toast: true,
              });
        setIsFormVisible(false);
        setBitacora({ id_usuario: bitacora.id_usuario, fecha: '', archivo: null });
        onAddBitacora();
      } else {
        console.log('Ocurrió un error inesperado');
      }
    } catch (error) {
      console.error('Error al subir la bitácora:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBitacora({
      ...bitacora,
      [name]: name === 'archivo' ? files[0] : value,
    });
  };

  if (rol !== 'aprendiz') return null;

  return (
    <form onSubmit={handleSubmit}>
      <button className="add-bitacora" onClick={toggleForm}>Agregar Bitácora</button>
      {isFormVisible && (
        <section className="bitacora-form" id="bitacoraForm">
          <h2 className="bitacora-form__title">Agregar Bitácora</h2>

          <input
            type="file"
            name="archivo"
            className="bitacora-form__input"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="fecha"
            className="bitacora-form__input"
            value={bitacora.fecha}
            onChange={handleChange}
            max={today}
            required
          />

          <button
            type="submit"
            className="bitacora-form__button"
            disabled={bitacoras.length >= 6}
          >
            {bitacoras.length >= 6 ? 'Has alcanzado el límite de 6 bitácoras' : 'Subir Bitácora'}
          </button>
        </section>
      )}
    </form>
  );
};

export default BitacoraForm;