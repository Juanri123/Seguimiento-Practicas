import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'

const RegisterForm = () => {
	const [fichas, setFichas] = useState([])
	const [error, setError] = useState('')

	const [formData, setFormData] = useState({
		nombres: '',
		apellidos: '',
		identificacion: '',
		correo: '',
		rol: 'aprendiz',
		clave: '',
		ficha: ''
	})

	const getFichas = async () => {
		try {
			const url = `${API_URL}/api/fichas`
			const response = await axios.get(url)
			const data = response.data
			setFichas(data.fichas || [])
		} catch (error) {
			console.log(error.message)
		}
	}

	useEffect(() => {
		getFichas()
	}, [])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!formData.identificacion.match(/^\d+$/))
			return setError('El número de documento solo debe contener números.')

		if (!/\S+@\S+\.\S+/.test(formData.correo))
			return setError('El correo introducido no es válido.')

		if (formData.clave.length < 6)
			return setError('La contraseña debe tener al menos 6 caracteres.')

		if (formData.rol === 'aprendiz' && !formData.ficha)
			return setError('Debe seleccionar una ficha para el rol aprendiz.')

		try {
			await axios.post(`${API_URL}/api/usuarios`, {
				...formData
			})

			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Usuario registrado con éxito',
				showConfirmButton: false,
				timer: 1200
			})

			setFormData({
				nombres: '',
				apellidos: '',
				identificacion: '',
				correo: '',
				rol: 'aprendiz',
				clave: '',
				ficha: ''
			})
		} catch (err) {
			const message =
				err.response?.data?.message || 'Error al registrar usuario'
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: message,
				toast: true,
				position: 'center'
			})
		}
	}

	return (
		<div className='form-container'>
			<form className='register-form' onSubmit={handleSubmit}>
				<label className='label register-label'>Nombres</label>
				<input
					type='text'
					className='input register-input'
					name='nombres'
					value={formData.nombres}
					onChange={handleChange}
					required
					minLength={3}
					maxLength={45}
					pattern='[A-Za-z\s]+'
					placeholder='Ingrese sus nombres'
				/>

				<label className='label register-label'>Apellidos</label>
				<input
					type='text'
					className='input register-input'
					name='apellidos'
					value={formData.apellidos}
					onChange={handleChange}
					required
					placeholder='Ingrese sus apellidos'
				/>

				<label className='label register-label'>Rol</label>
				<select
					className='input register-input'
					name='rol'
					value={formData.rol}
					onChange={handleChange}
					required>
					<option value='aprendiz'>Aprendiz</option>
					<option value='instructor'>Instructor</option>
				</select>

				{formData.rol === 'aprendiz' && (
					<>
						<label className='label register-label'>Número de ficha</label>
						<select
							className='input register-input'
							name='ficha'
							value={formData.ficha}
							onChange={handleChange}
							required>
							<option value=''>Seleccione una ficha</option>
							{fichas.map((ficha) => (
								<option key={ficha.id} value={ficha.codigo}>
									{ficha.codigo}
								</option>
							))}
						</select>
					</>
				)}

				<label className='label register-label'>Número de documento</label>
				<input
					type='text'
					className='input register-input'
					name='identificacion'
					value={formData.identificacion}
					onChange={handleChange}
					required
					placeholder='Ingrese su documento'
				/>

				<label className='label register-label'>Correo electrónico</label>
				<input
					type='email'
					className='input register-input'
					name='correo'
					value={formData.correo}
					onChange={handleChange}
					required
					placeholder='Ingrese su correo electrónico'
				/>

				<label className='label register-label'>Contraseña</label>
				<input
					type='password'
					className='input register-input'
					name='clave'
					value={formData.clave}
					onChange={handleChange}
					required
					placeholder='Ingrese su contraseña'
				/>

				{error && (
					<p className='error-message' role='alert'>
						⚠️ {error}
						<button onClick={() => setError('')} className='close-button'>
							✖
						</button>
					</p>
				)}

				<div className='log-in'>
					<button type='submit' className='button register-button'>
						Registrarse
					</button>
					<Link to='/'>
						<p className='log-in-link'>Iniciar Sesión</p>
					</Link>
				</div>
			</form>
		</div>
	)
}

export default RegisterForm
