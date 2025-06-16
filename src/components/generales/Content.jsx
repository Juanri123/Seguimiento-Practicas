import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_URL } from '../../api/globalVars'

const Content = () => {
	const [usuario, setUsuario] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const userId = localStorage.getItem('usuarioId')

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
					<b><p>Nombre:</p></b>
					<p>{usuario?.nombres}</p>
					<b><p>Apellidos:</p></b>
					<p>{usuario?.apellidos}</p>
					<b><p>Correo:</p></b>
					<p>{usuario?.correo}</p>
					<b><p>Identificación:</p></b>
					<p>{usuario?.identificacion}</p>
				</div>
			</section>
		</>
	)
}

export default Content