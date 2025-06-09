import { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import NavBar from '../generales/NavBar'
import ReportForm from './ReportForm'
import Sidebar from '../generales/Sidebar'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'

const Reportes = () => {
	const [reportes, setReportes] = useState([])
	const [todosLosReportes, setTodosLosReportes] = useState([])
	const [pagina, setPagina] = useState(1)
	const [totalRegistros, setTotalRegistros] = useState(0)
	const [rol, setRol] = useState('')
	const [mostrarFormulario, setMostrarFormulario] = useState(false)

	const limite = 10 // número de elementos por página

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
	}, [])

	useEffect(() => {
		obtenerReportes(pagina)
	}, [pagina])

	const obtenerReportes = async (pagina = 1) => {
		try {
			const { data } = await axios.get(`${API_URL}/api/reportes/verReportes`, {
				params: { pagina, limite }
			})
			setReportes(data.reportes || [])
			setTodosLosReportes(data.reportes || [])
			setTotalRegistros(data.totalRegistros || 0) // total de elementos del backend
		} catch (error) {
			if (error.response?.status === 404) {
				setReportes([])
				setTotalRegistros(0)
			} else {
				Swal.fire({
					title: 'Error en reportes',
					toast: true,
					position: 'bottom-left',
					text: error.message,
					icon: 'error'
				})
			}
		}
	}

	const toggleForm = () => setMostrarFormulario(!mostrarFormulario)

	const agregarReporte = (nuevoReporte) => {
		setReportes((prev) => [...prev, nuevoReporte])
	}

	const deleteReport = async (id) => {
		try {
			await axios.delete(`${API_URL}/api/reportes/${id}`)
			Swal.fire({
				title: 'Reporte eliminado.',
				text: 'El reporte fue eliminado correctamente.',
				toast: true,
				position: 'bottom-left',
				icon: 'success',
				showConfirmButton: false,
				timer: 1200
			})
			obtenerReportes(pagina)
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error al eliminar reporte',
				text: 'No se pudo eliminar el reporte.',
				toast: true,
				timer: 1200,
				showConfirmButton: false,
				position: 'bottom-left'
			})
		}
	}

	const urlUploads = `${API_URL}/uploads`

	const filtrarReporte = (e) => {
		const valorBusqueda = e.target.value.toLowerCase()
		if (valorBusqueda === '') {
			setReportes(todosLosReportes)
		} else {
			const reportesFiltrados = todosLosReportes.filter((reporte) =>
				reporte.nombre.toLowerCase().includes(valorBusqueda)
			)
			setReportes(reportesFiltrados)
		}
	}

	const handleChange = (e) => {
		filtrarReporte(e)
	}

	return (
		<div className='container'>
			<NavBar />
			<Sidebar />
			<div className='content'>
				<input
					type='search'
					className='input register-input'
					placeholder='Realice su búsqueda ...'
					onChange={handleChange}
				/>
				<DataTable
					columns={[
						{
							id: 'nombre',
							name: 'Nombre',
							selector: (reporte) => reporte.nombre,
							cell: (reporte) => (
								<div
									title={reporte.nombre}
									style={{
										maxWidth: '200px',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}>
									{reporte.nombre}
								</div>
							),
							sortable: true,
							grow: 2
						},
						{
							id: 'archivo',
							name: 'Archivo',
							cell: (reporte) => (
								<a
									href={`${urlUploads}/${reporte.archivo}`}
									target='_blank'
									rel='noopener noreferrer'>
									Ver archivo
								</a>
							)
						},
						{
							id: 'fecha',
							name: 'Fecha',
							selector: (reporte) => reporte.fecha,
							sortable: true
						},
						{
							id: 'opciones',
							name: 'Opciones',
							cell: (reporte) =>
								rol === 'instructor' ? (
									<div className='report-options'>
										<button
											className='report-list__button delete-button'
											onClick={() => deleteReport(reporte.id)}>
											<img
												src='../assets/img/trash.png'
												alt='Eliminar'
												id='delete-img'
											/>
										</button>
									</div>
								) : (
									<span>N/A</span>
								)
						}
					]}
					data={reportes}
					onChangePage={(page) => setPagina(page)} // cambia página
					pagination
					paginationDefaultPage={pagina} // página actual
					paginationPerPage={limite} // 10 elementos por página
					paginationServer // importante para paginación controlada
					paginationTotalRows={totalRegistros} // total de registros del backend
					progressPending={!reportes.length}
					responsive
					noDataComponent={<div>No hay reportes disponibles</div>}
					highlightOnHover
				/>

				{rol === 'instructor' && (
					<>
						<button className='button register-button' onClick={toggleForm}>
							{mostrarFormulario ? 'Cerrar Formulario' : 'Agregar Reporte'}
						</button>
						{mostrarFormulario && (
							<ReportForm onAddReporte={agregarReporte} onClose={toggleForm} />
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Reportes