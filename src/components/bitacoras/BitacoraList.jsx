import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import BitacoraForm from './BitacoraForm'
import { API_URL } from '../../api/globalVars'

const BitacoraList = () => {
	const [bitacoras, setBitacoras] = useState([])
	const [todasLasBitacoras, setTodasLasBitacoras] = useState([])
	const [error, setError] = useState('')
	const [rol, setRol] = useState('')
	const [idUsuario, setIdUsuario] = useState('')
	const [pagina, setPagina] = useState(1)
	const [totalPaginas, setTotalPaginas] = useState(1)
	const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false)
	const [motivoRechazo, setMotivoRechazo] = useState('')
	const [bitacoraRechazar, setBitacoraRechazar] = useState(null)

	const obtenerBitacoras = useCallback(async () => {
		try {
			const params = { pagina, limite: 10 }
			if (rol === 'aprendiz') {
				params.usuarioId = idUsuario
			}
			const res = await axios.get(`${API_URL}/api/bitacoras/verBitacoras`, {
				params
			})
			setBitacoras(res.data.bitacoras)
			setTodasLasBitacoras(res.data.bitacoras)
			setTotalPaginas(res.data.totalPaginas)
		} catch (error) {
			console.error('Error al obtener las bitácoras:', error.response || error)
			setError(
				'Error al obtener bitácoras. Consulta la consola para más detalles.'
			)
		}
	}, [pagina, rol, idUsuario])

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		const idGuardado = localStorage.getItem('usuarioId')
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
		if (idGuardado) setIdUsuario(idGuardado)
	}, [])

	useEffect(() => {
		if (rol && idUsuario) {
			obtenerBitacoras()
		}
	}, [obtenerBitacoras, rol, idUsuario])

	const handleAceptar = async (id) => {
		try {
			await axios.put(`${API_URL}/api/bitacoras/aceptar/${id}`)
			obtenerBitacoras()
		} catch (error) {
			console.error('Error al aceptar bitácora:', error)
		}
	}

	const handleRechazar = (bitacora) => {
		setBitacoraRechazar(bitacora)
		setMostrarMotivoPopup(true)
	}

	const confirmarRechazo = async () => {
		try {
			await axios.put(
				`${API_URL}/api/bitacoras/rechazar/${bitacoraRechazar.id}`,
				{ motivo: motivoRechazo },
				{ headers: { 'Content-Type': 'application/json' } }
			)

			const idAprendiz = bitacoraRechazar.aprendiz_id
			const claveNotificaciones = `notificaciones_${idAprendiz}`
			const notificaciones =
				JSON.parse(localStorage.getItem(claveNotificaciones)) || []

			const nuevaNotificacion = {
				id: Date.now(),
				mensaje: `Tu bitácora fue rechazada.\nMotivo: ${motivoRechazo}`,
				estado: 'pendiente'
			}

			localStorage.setItem(
				claveNotificaciones,
				JSON.stringify([...notificaciones, nuevaNotificacion])
			)
			window.dispatchEvent(new Event('notificacionesActualizadas'))

			setMostrarMotivoPopup(false)
			setMotivoRechazo('')
			setBitacoraRechazar(null)
			obtenerBitacoras()
		} catch (error) {
			console.error(
				'Error al rechazar bitácora:',
				error.response?.data || error
			)
			setMostrarMotivoPopup(false)
			setMotivoRechazo('')
			setBitacoraRechazar(null)
		}
	}

	const filtrarBitacoras = (e) => {
		const valorBusqueda = e.target.value.toLowerCase()
		if (valorBusqueda === '') {
			setBitacoras(todasLasBitacoras)
			return
		} else {
			const bitacorasFiltradas = todasLasBitacoras.filter((bitacora) =>
				bitacora.estado.toLowerCase().includes(valorBusqueda)
			)
			setBitacoras(bitacorasFiltradas)
		}
	}

	const handleChange = (e) => {
		filtrarBitacoras(e)
	}

	return (
		<section className='bitacora-list'>
			{error && <p className='error-message'>{error}</p>}
			<input
				type='search'
				className='input register-input'
				placeholder='Realice su búsqueda ...'
				onChange={handleChange}
			/>
			<DataTable
				columns={[
					{
						id: 'fecha',
						name: 'Fecha',
						selector: (bitacora) => bitacora.fecha || 'N/A',
						sortable: true
					},
					{
						id: 'estado',
						name: 'Estado',
						selector: (bitacora) => bitacora.estado || 'N/A',
						sortable: true
					},
					{
						id: 'archivo',
						name: 'Archivo',
						selector: (bitacora) => bitacora.archivo || 'N/A',
						cell: (bitacora) =>
							bitacora.archivo ? (
								<a
									href={`${API_URL}/uploads/${bitacora.archivo}`}
									target='_blank'
									rel='noopener noreferrer'>
									Ver archivo
								</a>
							) : (
								<span>Sin archivo</span>
							),
						sortable: true
					},
					{
						id: 'acciones',
						name: 'Acciones',
						cell: (bitacora) =>
							rol === 'instructor' ? (
								<div className='bitacora-buttons'>
									<button
										className='button accept'
										onClick={() => handleAceptar(bitacora.id)}>
										✔️
									</button>
									<button
										className='button reject'
										onClick={() => handleRechazar(bitacora)}>
										❌
									</button>
								</div>
							) : (
								<span>N/A</span>
							)
					}
				]}
				data={bitacoras}
				pagination
				paginationServer
				paginationTotalRows={totalPaginas * 10}
				paginationComponentOptions={{
					rowsPerPageText: 'Filas por página',
					rangeSeparatorText: 'de',
					noRowsPerPage: false,
					selectAllRowsItem: true,
					selectAllRowsItemText: 'Todos'
				}}
				paginationPerPage={10}
				onChangePage={(page) => setPagina(page)}
			/>

			{rol === 'aprendiz' && (
				<BitacoraForm bitacoras={bitacoras} onAddBitacora={obtenerBitacoras} />
			)}

			{mostrarMotivoPopup && (
				<div className='popup-overlay'>
					<div className='popup-content'>
						<h3>Motivo del rechazo</h3>
						<textarea
							value={motivoRechazo}
							onChange={(e) => setMotivoRechazo(e.target.value)}
							placeholder='Escribe el motivo del rechazo...'
							className='popup-textarea'
						/>
						<div className='popup-buttons'>
							<button onClick={confirmarRechazo} className='popup-confirm'>
								Confirmar
							</button>
							<button
								onClick={() => setMostrarMotivoPopup(false)}
								className='popup-cancel'>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}

export default BitacoraList