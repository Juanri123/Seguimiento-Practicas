import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Sidebar from '../generales/Sidebar'
import Navbar from '../generales/NavBar'
import { API_URL } from '../../api/globalVars'

const Fichas = () => {
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const toggleForm = () => {
		if (mostrarFormulario) {
			setFormData({
				codigo: '',
				programa: ''
			})
		}
		setMostrarFormulario(!mostrarFormulario)
	}
	const [formData, setFormData] = useState({
		codigo: '',
		programa: ''
	})

	const [fichas, setFichas] = useState([])

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const obtenerFichas = async () => {
		try {
			const url = `${API_URL}/api/fichas`
			const response = await axios.get(url)
			const data = response.data
			setFichas(data)
		} catch (error) {
			console.error('Error al obtener las fichas:', error.message)
		}
	}

	useEffect(() => {
		obtenerFichas()
	}, [])

	const subirFicha = async (e) => {
		e.preventDefault()

		if (!formData.codigo || !formData.programa) {
			Swal.fire({
				icon: 'error',
				title: 'Campos incompletos',
				text: 'Por favor, complete todos los campos.',
				toast: true
			})
			return
		}

		try {
			const url = `${API_URL}/api/fichas`
			await axios.post(url, formData)

			await Swal.fire({
				icon: 'success',
				timer: 1200,
				text: 'Ficha creada exitosamente.',
				toast: true,
				position: 'bottom-left',
				showConfirmButton: false
			})

			await obtenerFichas()
			setFormData({
				codigo: '',
				programa: ''
			})
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error al crear ficha',
				text: error.response?.data?.message || 'Error creando la ficha',
				toast: true,
				position: 'bottom-left',
				timer: 1200,
				showConfirmButton: false
			})
		}
	}

	const eliminarFicha = async (e) => {
		const id = e.target.id
		const url = `${API_URL}/api/fichas/${id}`
		try {
			await axios.delete(url)
			await Swal.fire({
				icon: 'success',
				title: 'Ficha eliminada',
				text: 'La ficha fue eliminada exitosamente.',
				toast: true,
				position: 'bottom-left',
				timer: 1200,
				showConfirmButton: false
			})
			obtenerFichas()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error al eliminar ficha',
				text: error.response?.data?.message || 'Error eliminando la ficha',
				toast: true,
				position: 'bottom-left',
				timer: 1200,
				showConfirmButton: false
			})
		}
	}

	return (
		<div className='container'>
			<Navbar />
			<Sidebar />
			<div className='content'>
				<div className='seccion-fichas'>
					<h3>Listado de Fichas</h3>
					{fichas?.length > 0 ? (
						fichas.map((ficha) => (
							<div key={ficha.codigo} className='fichas-item'>
								<p>Ficha: {ficha.codigo}</p>
								<p>Programa: {ficha.programa}</p>
								<button
									id={ficha.id}
									onClick={eliminarFicha}
									className='button delete-button'>
									<img
										id='delete-img'
										src='../assets/img/trash.png'
										alt='Eliminar'
									/>
								</button>
							</div>
						))
					) : (
						<p>No hay fichas registradas.</p>
					)}
				</div>

				<>
					<button className='button register-button' onClick={toggleForm}>
						{mostrarFormulario ? 'Cerrar Formulario' : 'Agregar Ficha'}
					</button>
				</>

				{mostrarFormulario && (
					<div className='report-form'>
						<h2 className='register-title'>Crear Nueva Ficha</h2>
						<form onSubmit={subirFicha} className='register-form'>
							<input
								type='text'
								className='input report-input'
								id='codigo'
								name='codigo'
								placeholder='Ingrese el código de la ficha'
								pattern='[0-9]*'
								value={formData.codigo}
								onChange={handleChange}
								required
							/>
							<input
								type='text'
								className='input report-input'
								id='programa'
								name='programa'
								placeholder='Ingrese el nombre del programa'
								value={formData.programa}
								onChange={handleChange}
								required
							/>
							<button type='submit' className='button register-button'>
								Crear Ficha
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	)
}

export default Fichas