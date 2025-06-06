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

	return (
		<div className='container'>
			<NavBar />
			<Sidebar />
			<div className='content'>
				<DataTable
					columns={[
						{
							id: 'nombre',
							name: 'Nombre',
							selector: (reporte) => reporte.nombre,
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
					pagination
					paginationServer // importante para paginación controlada
					paginationTotalRows={totalRegistros} // total de registros del backend
					paginationPerPage={limite} // 10 elementos por página
					paginationDefaultPage={pagina} // página actual
					onChangePage={(page) => setPagina(page)} // cambia página
					responsive
					progressPending={!reportes.length}
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
