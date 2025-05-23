import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../../api/globalVars'

const Content = () => {
	const { id } = useParams() // Si el id viene de la URL
	const [usuario, setUsuario] = useState(null) // Guardamos la información del usuario
	const [loading, setLoading] = useState(true) // Estado de carga
	const [error, setError] = useState(null) // Estado para errores

	// En lugar de 'id' en useParams, intenta obtenerlo de localStorage
	const userId = id || localStorage.getItem('usuarioId')

	const obtenerUsuario = async () => {
		try {
			const url = `${API_URL}/api/usuarios/${userId}`
			const response = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			setUsuario(response.data)
			setLoading(false)
		} catch (error) {
			setError('Error al obtener los datos del usuario.')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (userId) {
			obtenerUsuario()
		} else {
			setError('No se ha encontrado el id del usuario.')
		}
	}, [userId])

	if (loading) {
		return <p>Cargando...</p>
	}

	if (error) {
		return <p>{error}</p>
	}

	return (
		<>
			<section className='info-section'>
				<img src='../assets/img/user.png' alt='Profile' />
				<div>
					<h2>Información del {usuario?.rol}</h2>
					<p>{usuario?.nombres}</p>
					<p>{usuario?.apellidos}</p>
					<p>{usuario?.correo}</p>
					<p>{usuario?.identificacion}</p>
				</div>
			</section>
			<section className='pending-info-section'>
				<h3>Información pendiente del aprendiz</h3>
				<p>
					Aquí va la información sobre las tareas o actividades pendientes del
					aprendiz.
				</p>
			</section>
		</>
	)
}

export default Content