import { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import NavBar from '../generales/NavBar'
import ReportForm from './ReportForm'
import Sidebar from '../generales/Sidebar'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'
import { ReactComponent as ArrowLeft } from '../../icons/ArrowLeft.svg'
import { ReactComponent as ArrowRight } from '../../icons/ArrowRight.svg'

const Reportes = () => {
	const [reportes, setReportes] = useState([])
	const [pagina, setPagina] = useState(1)
	const [totalPaginas, setTotalPaginas] = useState(1)
	const [rol, setRol] = useState('')
	const [mostrarFormulario, setMostrarFormulario] = useState(false)

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		if (rolGuardado) {
			setRol(rolGuardado.toLowerCase())
		}
	}, [])

	useEffect(() => {
		obtenerReportes(pagina)
	}, [pagina])

	const obtenerReportes = async (pagina = 1) => {
		try {
			const { data } = await axios.get(`${API_URL}/api/reportes/verReportes`, {
				params: {
					pagina,
					limite: 6
				}
			})

			setReportes(data.reportes || [])
			setTotalPaginas(data.totalPaginas)
		} catch (error) {
			if (error.response && error.response.status === 404) {
				setReportes([])
				setTotalPaginas(1)
			} else {
				Swal.fire({
					title: 'Error en reportes',
					toast: true,
					position: 'bottom-left',
					text: error.message,
					icon: 'error'
				})
				console.error('Error al obtener reportes:', error.message)
			}
		}
	}

	const toggleForm = () => setMostrarFormulario(!mostrarFormulario)

	const agregarReporte = (nuevoReporte) => {
		setReportes((prev) => [...prev, nuevoReporte])
	}

	const deleteReport = async (e) => {
		const id = e.target.id
		const url = `${API_URL}/api/reportes/${id}`
		
		try {
			await axios.delete(url)

			await Swal.fire({
				title: 'Reporte eliminado.',
				text: 'El reporte fue eliminado correctamente.',
				toast: true,
				position: 'bottom-left',
				icon: 'success',
				showConfirmButton: false,
				timer: 1200
			})
			const updatedReports = reportes.filter((reporte) => reporte.id !== id)
			setReportes(updatedReports)
			obtenerReportes()
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
						id: 'id',
						name: 'ID',
						selector: (reporte) => reporte.id,
						sortable: true
					},
					{
						id: 'nombre',
						name: 'Nombre',
						selector: (reporte) => reporte.nombre,
						sortable: true,
						grow: 2,
					},
					{
						id: 'archivo',
						name: 'Archivo',
						selector: (reporte) => reporte.archivo,
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
						cell: (reporte) => (
							<button
								id={reporte.id}
								className='report-list__button delete-button'
								onClick={() => deleteReport(reporte.id)}>
								<img
									src='../assets/img/trash.png'
									alt='Eliminar'
									id='delete-img'
								/>
							</button>
						)
					}
				]}
				data={reportes}
				pagination
				paginationPerPage={6}
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