import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { API_URL } from '../../../api/globalVars'
import { ReactComponent as BellIcon } from '../../icons/Bell.svg'

const Navbar = () => {
	const [notificaciones, setNotificaciones] = useState([])
	const [mostrarPopup, setMostrarPopup] = useState(false)
	const navigate = useNavigate()

	const cargarNotificaciones = async () => {
		const usuarioId = localStorage.getItem('usuarioId')
		if (!usuarioId) return

		try {
			const response = await axios.get(`${API_URL}/api/notificaciones/usuario/${usuarioId}`)
			setNotificaciones(response.data)
		} catch (error) {
			console.error('Error al cargar notificaciones:', error)
		}
	}

	useEffect(() => {
		cargarNotificaciones()

		const handler = () => {
			cargarNotificaciones()
		}

		window.addEventListener('notificacionesActualizadas', handler)

		return () => {
			window.removeEventListener('notificacionesActualizadas', handler)
		}
	}, [])

	const handleLogout = () => {
		localStorage.removeItem('rol')
		localStorage.removeItem('usuarioId')
		localStorage.removeItem('notificaciones')
		localStorage.removeItem('usuario')

		navigate('/', { replace: true })

		Swal.fire({
			position: 'top',
			icon: 'success',
			title: 'Sesión cerrada',
			showConfirmButton: false,
			toast: true,
			timer: 1200
		})
	}

	const handleNotificacionLeida = async (id) => {
		try {
			await axios.put(`${API_URL}/api/notificaciones/${id}`)
			const nuevas = notificaciones.map((n) =>
				n.id === id ? { ...n, estado: 'leida' } : n
			)
			setNotificaciones(nuevas)
			window.dispatchEvent(new Event('notificacionesActualizadas'))
		} catch (error) {
			console.error('Error al marcar notificación como leída:', error)
		}
	}

	const handleEliminarNotificacion = async (id) => {
		try {
			await axios.delete(`${API_URL}/api/notificaciones/${id}`)
			setNotificaciones(notificaciones.filter(n => n.id !== id))
			window.dispatchEvent(new Event('notificacionesActualizadas'))
		} catch (error) {
			console.error('Error al eliminar notificación:', error)
		}
	}

	const handleEliminarTodas = async () => {
		const usuarioId = localStorage.getItem('usuarioId')
		if (!usuarioId) return

		const confirm = await Swal.fire({
			title: '¿Eliminar todas las notificaciones?',
			text: 'Esta acción no se puede deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar todas',
			cancelButtonText: 'Cancelar'
		})

		if (confirm.isConfirmed) {
			try {
				await axios.delete(`${API_URL}/api/notificaciones/usuario/${usuarioId}`)
				setNotificaciones([])
				window.dispatchEvent(new Event('notificacionesActualizadas'))

				Swal.fire({
					icon: 'success',
					title: 'Notificaciones eliminadas',
					timer: 1500,
					showConfirmButton: false,
					toast: true,
					position: 'top'
				})
			} catch (error) {
				console.error('Error al eliminar todas las notificaciones:', error)
			}
		}
	}

	const notificacionesPendientes = notificaciones.filter(
		(n) => n.estado === 'pendiente'
	)

	return (
		<nav className='navbar'>
			<img
				src='../assets/img/sena-logo-verde.png'
				alt='Inicio'
				className='navbar-logo'
				draggable='false'
			/>
			<div className='navbar-items'>
				<div
					className='navbar-notifications'
					onClick={() => setMostrarPopup(!mostrarPopup)}>
					<BellIcon className='navbar-icon' />
					{notificacionesPendientes.length > 0 && (
						<span style={{ cursor: 'default' }} className='notification-count'>
							{notificacionesPendientes.length}
						</span>
					)}
				</div>

				<input
					type='button'
					value='Cerrar sesión'
					className='navbar-logout'
					onClick={handleLogout}
				/>

				<Link to={'/ajustes'} draggable='false'>
					<img
						src='../assets/img/user.png'
						alt='Usuario'
						className='navbar-icon'
						draggable='false'
					/>
				</Link>

				<Link to={'/inicio'} draggable='false'>
					<img
						src='../assets/img/home.png'
						alt='Home'
						className='navbar-icon'
						draggable='false'
					/>
				</Link>
			</div>

			{mostrarPopup && (
				<div className='notification-popup'>
					<h3>Notificaciones</h3>
					{notificaciones.length === 0 ? (
						<p>No tienes notificaciones.</p>
					) : (
						notificaciones.map((notificacion) => (
							<div
								key={notificacion.id}
								className={`notification-item ${
									notificacion.estado === 'pendiente' ? 'pendiente' : 'leida'
								}`}>
								<p>{notificacion.mensaje}</p>

								{notificacion.estado === 'pendiente' && (
									<button className='marcar-leida' onClick={() => handleNotificacionLeida(notificacion.id)}>
										Marcar como leída
									</button>
								)}
								<button
									className='eliminar-id'
									onClick={() => handleEliminarNotificacion(notificacion.id)}>
									Eliminar
								</button>
							</div>
						))
					)}

					{notificaciones.length > 0 && (
						<button
							className='eliminar-todas-btn'
							onClick={handleEliminarTodas}>
							Eliminar todas
						</button>
					)}

					<button
						onClick={() => setMostrarPopup(false)}
						className='cerrar-popup'>
						Cerrar
					</button>
				</div>
			)}
		</nav>
	)
}

export default Navbar
