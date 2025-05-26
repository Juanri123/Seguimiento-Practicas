import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { API_URL } from '../../api/globalVars'
import {ReactComponent as BellIcon} from '../../icons/Bell.svg'

const Navbar = () => {
	const [notificaciones, setNotificaciones] = useState([])
	const [mostrarPopup, setMostrarPopup] = useState(false)
	const navigate = useNavigate()

	const cargarNotificaciones = async () => {
		const usuarioId = localStorage.getItem('usuarioId')
		if (usuarioId) {
			try {
				const response = await axios.get(
					`http://localhost:3000/api/notificaciones/usuario/${usuarioId}`
				)
				setNotificaciones(response.data)
				localStorage.setItem('notificaciones', JSON.stringify(response.data))
			} catch (error) {
				console.error('Error al cargar notificaciones:', error)
			}
		} else {
			const notificacionesGuardadas =
				JSON.parse(localStorage.getItem('notificaciones')) || []
			setNotificaciones(notificacionesGuardadas)
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
	}, []) // Dependencias vacías para cargar las notificaciones al inicio

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
		const nuevas = notificaciones.map((n) =>
			n.id === id ? { ...n, estado: 'leida' } : n
		)
		setNotificaciones(nuevas)
		localStorage.setItem('notificaciones', JSON.stringify(nuevas))

		try {
			await axios.patch(`${API_URL}/api/notificaciones/${id}`)
			window.dispatchEvent(new Event('notificacionesActualizadas'))
		} catch (error) {
			console.error('Error al marcar notificación como leída:', error)
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
				{/* Botón de notificaciones */}
				<div
					className='navbar-notifications'
					onClick={() => setMostrarPopup(!mostrarPopup)}>
					<BellIcon className='navbar-icon' />
					{notificacionesPendientes.length > 0 && (
						<span style={{cursor: 'default'}} className='notification-count'>
							{notificacionesPendientes.length}
						</span>
					)}
				</div>

				{/* Botón de cerrar sesión */}
				<input
					type='button'
					value='Cerrar sesión'
					className='navbar-logout'
					onClick={handleLogout}
				/>

				{/* Icono de usuario */}
				<Link to={'/ajustes'} draggable='false'>
					<img
						src='../assets/img/user.png'
						alt='Usuario'
						className='navbar-icon'
						draggable='false'
					/>
				</Link>

				{/* Icono de inicio */}
				<Link to={'/inicio'} draggable='false'>
					<img
						src='../assets/img/home.png'
						alt='Home'
						className='navbar-icon'
						draggable='false'
					/>
				</Link>
			</div>

			{/* Popup de notificaciones */}
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
									<button
										onClick={() => handleNotificacionLeida(notificacion.id)}>
										Marcar como leída
									</button>
								)}
							</div>
						))
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