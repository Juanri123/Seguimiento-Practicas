import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import Sidebar from '../generales/Sidebar';
import Navbar from '../generales/NavBar';
import { API_URL } from '../../api/globalVars';

const Fichas = () => {
    const [fichas, setFichas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [aprendices, setAprendices] = useState([]);
    const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
    const [codigoFichaSeleccionada, setCodigoFichaSeleccionada] = useState(null);
    const [mostrarAprendices, setMostrarAprendices] = useState(false);
    const [loading, setLoading] = useState(false);
    const [todasLasFichas, setTodasLasFichas] = useState([]);
    const [editandoFicha, setEditandoFicha] = useState(null);
    const [formData, setFormData] = useState({ codigo: '', programa: '' });

    const obtenerFichas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/fichas`, {
                params: { page: pagina, limit: 10 },
            });
            setFichas(response.data.fichas || []);
            setTodasLasFichas(response.data.fichas || []);
        } catch (error) {
            console.error('Error al obtener las fichas:', error.message);
        }
        setLoading(false);
    }, [pagina]);

    useEffect(() => {
        obtenerFichas();
    }, [obtenerFichas]);

    const obtenerAprendices = async (fichaId, codigoFicha) => {
        try {
            const response = await axios.get(`${API_URL}/api/fichas/${fichaId}/aprendices`);
            setAprendices(response.data.length ? response.data : []);
            setFichaSeleccionada(fichaId);
            setCodigoFichaSeleccionada(codigoFicha);
            setMostrarAprendices(true);
        } catch (error) {
            console.error('Error al obtener aprendices:', error.message);
            setAprendices([]);
        }
    };

    const cerrarListaAprendices = () => {
        setMostrarAprendices(false);
        setFichaSeleccionada(null);
        setCodigoFichaSeleccionada(null);
    };

    const iniciarEdicionFicha = (ficha) => {
        setEditandoFicha(ficha.id);
        setFormData({ codigo: ficha.codigo, programa: ficha.programa });
    };

    const cancelarEdicionFicha = () => {
        setEditandoFicha(null);
        setFormData({ codigo: '', programa: '' });
    };

    const actualizarFicha = async () => {
        try {
            await axios.put(`${API_URL}/api/fichas/${editandoFicha}`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Ficha actualizada',
                text: 'Los cambios se guardaron correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            setEditandoFicha(null);
            obtenerFichas();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar ficha',
                text: error.response?.data?.message || 'No se pudo actualizar la ficha',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className='container'>
            <Navbar />
            <Sidebar />
            <div className='content'>
                {!mostrarAprendices ? (
                    <>
                        <input
                            type='search'
                            className='input register-input'
                            placeholder='Realice su búsqueda ...'
                            onChange={(e) => {
                                const valorBusqueda = e.target.value.toLowerCase();
                                setFichas(
                                    valorBusqueda
                                        ? todasLasFichas.filter(
                                              (f) =>
                                                  f.codigo.toString().toLowerCase().includes(valorBusqueda) ||
                                                  f.programa.toString().toLowerCase().includes(valorBusqueda)
                                          )
                                        : todasLasFichas
                                );
                            }}
                        />

                        {editandoFicha ? (
                            <div className="edit-form">
                                <h2>Editar Ficha</h2>
                                <input
                                    type='text'
                                    name='codigo'
                                    placeholder='Código de la ficha'
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                />
                                <input
                                    type='text'
                                    name='programa'
                                    placeholder='Programa de la ficha'
                                    value={formData.programa}
                                    onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                                />
                                <button className="save-button" onClick={actualizarFicha}>Guardar cambios</button>
                                <button className="cancel-button" onClick={cancelarEdicionFicha}>Cancelar</button>
                            </div>
                        ) : (
                            <DataTable
                                columns={[
                                    { id: 'codigo', name: 'Código', selector: (ficha) => ficha.codigo || 'N/A', sortable: true },
                                    { id: 'programa', name: 'Programa', selector: (ficha) => ficha.programa || 'N/A', sortable: true },
                                    {
                                        id: 'acciones',
                                        name: 'Acciones',
                                        cell: (ficha) => (
                                            <button className='edit-button' onClick={() => iniciarEdicionFicha(ficha)}>
                                                Editar
                                            </button>
                                        ),
                                    },
                                ]}
                                data={fichas}
                                pagination
                                onRowClicked={(row) => obtenerAprendices(row.id, row.codigo)}
                                progressPending={loading}
                                noDataComponent={<div>No hay fichas registradas.</div>}
                                highlightOnHover
                            />
                        )}
                    </>
                ) : (
                    <>
                        <h3 className='tittle-ficha'>Ficha {codigoFichaSeleccionada}</h3>
                        <button className="close-button" onClick={cerrarListaAprendices}>Volver</button>
                        <DataTable
                            columns={[
                                { id: 'nombre', name: 'Nombre', selector: (aprendiz) => aprendiz.nombres || 'N/A', sortable: true },
                                { id: 'apellido', name: 'Apellido', selector: (aprendiz) => aprendiz.apellidos || 'N/A', sortable: true },
                                { id: 'identificacion', name: 'Identificación', selector: (aprendiz) => aprendiz.identificacion || 'N/A', sortable: true },
                                { id: 'correo', name: 'Correo', selector: (aprendiz) => aprendiz.correo || 'N/A', sortable: true },
                            ]}
                            data={aprendices}
                            pagination
                            progressPending={loading}
                            noDataComponent={<div>No hay aprendices registrados.</div>}
                            highlightOnHover
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Fichas;
