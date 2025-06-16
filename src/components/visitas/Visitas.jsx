import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import NavBar from '../generales/NavBar'
import Sidebar from '../generales/Sidebar'
import { API_URL } from '../../api/globalVars'

function Visitas() {
	const [showForm, setShowForm] = useState(false)
	const [modoEdicion, setModoEdicion] = useState(false)
	const [visitas, setVisitas] = useState([])
	const [todasLasVisitas, setTodasLasVisitas] = useState([])
	const [visitaEditando, setVisitaEditando] = useState(null)
	const [rol, setRol] = useState('')
	const [usuarioId, setUsuarioId] = useState('')

	const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false)
	const [motivoRechazo, setMotivoRechazo] = useState('')
	const [visitaRechazar, setVisitaRechazar] = useState(null)

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		const idGuardado = localStorage.getItem('usuarioId')
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
		if (idGuardado) setUsuarioId(Number(idGuardado))
	}, [])

	const obtenerVisitas = useCallback(async () => {
		try {
			const url = `${API_URL}/api/visitas/verVisitas`
			const response = await axios.get(url)
			let todas = response.data.visitas || []

			if (rol === 'aprendiz') {
				todas = todas.filter((v) => v.aprendiz_id === Number(usuarioId))
			}
			setVisitas(todas)
			setTodasLasVisitas(todas)
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error al cargar visitas',
				text: 'Intenta de nuevo más tarde.',
				toast: true,
				position: 'center',
				showConfirmButton: false,
				timer: 2500
			})
			console.error('Error al obtener visitas:', error.message)
		}
	}, [rol, usuarioId])

	useEffect(() => {
		if (rol && usuarioId) {
			obtenerVisitas()
		}
	}, [rol, usuarioId, obtenerVisitas])

	const toggleForm = () => {
		setShowForm(!showForm)
		setModoEdicion(false)
		setVisitaEditando(null)
	}

	const handleAddOrUpdateVisita = async (e) => {
		e.preventDefault()

		const nuevaVisita = {
			direccion: e.target['direccion-visita'].value,
			tipo: e.target['tipo-visita'].value,
			fecha: e.target['dia'].value,
			hora: e.target['hora'].value,
			aprendiz_id: usuarioId
		}

		if (!nuevaVisita.direccion || !nuevaVisita.tipo || !nuevaVisita.fecha || !nuevaVisita.hora) {
			alert('Completa todos los campos.')
			return
		}

		try {
			const url = modoEdicion
				? `${API_URL}/api/visitas/${visitaEditando.id}`
				: `${API_URL}/api/visitas`
			const method = modoEdicion ? 'put' : 'post'

			await axios({
				method,
				url,
				headers: { 'Content-Type': 'application/json' },
				data: nuevaVisita
			})

			await obtenerVisitas()
			e.target.reset()
			setShowForm(false)
			setModoEdicion(false)
			setVisitaEditando(null)
		} catch (error) {
			console.error('Error al crear o actualizar visita:', error.response?.data || error.message)
		}
	}

	const handleEditar = (visita) => {
		setModoEdicion(true)
		setVisitaEditando(visita)
		setShowForm(true)
	}

	const handleAceptar = async (id) => {

		try {
			const url = `${API_URL}/api/visitas/aceptar/${id}`
			await axios.put(url)

			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Visita aceptada correctamente',
				showConfirmButton: false,
				timer: 1200,
				toast: true
			})

			await obtenerVisitas()
		} catch (error) {
			console.error('Error al aceptar visita:', error.response?.data || error.message)
		}
	}

	const handleRechazar = (visita) => {
		setVisitaRechazar(visita)
		setMostrarMotivoPopup(true)
	}

	const confirmarRechazo = async () => {
		try {
			const url = `${API_URL}/api/visitas/rechazar/${visitaRechazar.id}`
			await axios.put(url, { motivo: motivoRechazo }, {
				headers: { 'Content-Type': 'application/json' }
			})

			if (rol === 'instructor') {
				const notificaciones = JSON.parse(localStorage.getItem('notificaciones')) || []
				const nuevaNotificacion = {
					id: Date.now(),
					mensaje: `Tu visita del ${visitaRechazar.fecha.split('T')[0]} fue rechazada. Motivo: ${motivoRechazo}`,
					estado: 'pendiente'
				}
				localStorage.setItem('notificaciones', JSON.stringify([...notificaciones, nuevaNotificacion]))
				window.dispatchEvent(new Event('nuevaNotificacion'))
			}

			setMostrarMotivoPopup(false)
			setMotivoRechazo('')
			setVisitaRechazar(null)
			await obtenerVisitas()
		} catch (error) {
			console.error('Error al rechazar visita:', error)
		}
	}

	const filtrarVisitas = (e) => {
		const valor = e.target.value.toLowerCase()
		if (!valor) {
			setVisitas(todasLasVisitas)
			return
		}
		const filtradas = todasLasVisitas.filter((visita) => {
			const nombreCompleto = visita.aprendiz
				? `${visita.aprendiz.nombres} ${visita.aprendiz.apellidos}`.toLowerCase()
				: ''
			return (
				visita.tipo.toLowerCase().includes(valor) ||
				visita.direccion.toLowerCase().includes(valor) ||
				visita.estado?.toLowerCase().includes(valor) ||
				nombreCompleto.includes(valor)
			)
		})
		setVisitas(filtradas)
	}

	return (
		<div className='container'>
			<NavBar />
			<Sidebar />
			<div className='content'>
				<div className='visits-section'>
					{rol === 'instructor' && (
						<input
							type='search'
							className='input register-input'
							placeholder='Buscar visita...'
							onChange={filtrarVisitas}
						/>
					)}
					<DataTable
						columns={[
							{
								id: 'aprendiz',
								name: 'Aprendiz',
								selector: (v) => v.aprendiz ? `${v.aprendiz.nombres} ${v.aprendiz.apellidos}` : 'N/A',
								sortable: true
							},
							{
								name: 'Dirección',
								selector: (row) => row.direccion,
								cell: (v) => (
									<div title={v.direccion} style={{
										maxWidth: '200px',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}>
										{v.direccion}
									</div>
								),
								sortable: true,
								grow: 2
							},
							{ name: 'Tipo', selector: (v) => v.tipo, sortable: true },
							{ name: 'Fecha', selector: (v) => v.fecha.split('T')[0], sortable: true },
							{ name: 'Hora', selector: (v) => v.hora, sortable: true },
							{ name: 'Estado', selector: (v) => v.estado || 'Pendiente', sortable: true },
							{
								name: 'Acciones',
								cell: (row) => {
									if (rol === 'instructor') {
										return (
											<div className='visit-buttons'>
												<button className='visit-button accept' onClick={() => handleAceptar(row.id)}>✔️</button>
												<button className='visit-button reject' onClick={() => handleRechazar(row)}>❌</button>
											</div>
										)
									}
									if (rol === 'aprendiz' && row.aprendiz_id === usuarioId) {
										return <button className='edit-button' onClick={() => handleEditar(row)}>Editar</button>
									}
									return null
								}
							}
						]}
						data={visitas}
						pagination
						paginationPerPage={10}
						paginationRowsPerPageOptions={[8, 10, 16, 24]}
						paginationComponentOptions={{
							rowsPerPageText: 'Filas por página',
							rangeSeparatorText: 'de',
							noRowsPerPage: false
						}}
						responsive
						highlightOnHover
						noDataComponent={<div>No hay visitas registradas.</div>}
					/>

					{showForm && (
						<form className='visit-form' onSubmit={handleAddOrUpdateVisita}>
							<h3>{modoEdicion ? 'Editar Visita' : 'Solicitud de Visita'}</h3>
							<input type='date' name='dia' className='input visit-input' required defaultValue={modoEdicion ? visitaEditando.fecha.split('T')[0] : ''} />
							<input type='time' name='hora' className='input visit-input' required defaultValue={modoEdicion ? visitaEditando.hora : ''} />
							<input type='text' name='direccion-visita' placeholder='Dirección' className='input visit-input' required defaultValue={modoEdicion ? visitaEditando.direccion : ''} />
							<select name='tipo-visita' className='input visit-input' required defaultValue={modoEdicion ? visitaEditando.tipo : ''}>
								<option value=''>Selecciona tipo</option>
								<option value='Presencial'>Presencial</option>
								<option value='Virtual'>Virtual</option>
							</select>
							<button type='submit' className='button register-button'>
								{modoEdicion ? 'Actualizar' : 'Solicitar'}
							</button>
						</form>
					)}

					{rol === 'aprendiz' && (
						<button className='button register-button' onClick={toggleForm}>
							{showForm ? 'Cancelar' : 'Solicitar visita'}
						</button>
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
									<button onClick={confirmarRechazo} className='popup-confirm'>Confirmar</button>
									<button onClick={() => setMostrarMotivoPopup(false)} className='popup-cancel'>Cancelar</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Visitas
