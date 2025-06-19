import axios from 'axios'
import {useEffect, useState} from 'react'
import {API_URL} from '../../api/globalVars'

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
					<p>
						<b>Nombre: </b>
						{usuario?.nombres}
					</p>
					<p>
						<b>Apellidos: </b>
						{usuario?.apellidos}
					</p>
					<p>
						<b>Correo: </b>
						{usuario?.correo}
					</p>
					<p>
						<b>Identificación: </b>
						{usuario?.identificacion}
					</p>
				</div>
			</section>
			{usuario.rol === 'aprendiz' ? (
				<section className='info-section'>
					<div>
					<h2>
						Actividades Pendientes
					</h2>
						<h4>
							Bitacóras Subidas: <span>{0}/12</span>
						</h4>
						<h4>
							Reportes Recibidos: <span>{3}</span>
						</h4>
						<h4>
							Visitas Realizadas: <span>{1}/3</span>
						</h4>
					</div>
				</section>
			) : null}
		</>
	)
}

export default Content