import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'

const RegisterForm = () => {
	const [fichas, setFichas] = useState([])

	const getFichas = async () => {
		try {
			const url = `${API_URL}/api/fichas`
			const response = await axios.get(url)
			const data = response.data
			setFichas(data || [])
		} catch (error) {
			console.log(error.message)
		}
	}

	useEffect(() => {
		getFichas()
	}, [fichas])

	const [formData, setFormData] = useState({
		nombres: '',
		apellidos: '',
		id_empresa: '',
		identificacion: '',
		ficha: null,
		correo: '',
		rol: 'aprendiz'
	})

	const [password, setPassword] = useState('') // Contraseña por separado

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!formData.identificacion.match(/^\d+$/)) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'El número de documento solo debe contener números.',
				toast: true
			})
			return
		}
		if (password.length < 6) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'La contraseña debe tener al menos 6 caracteres.',
				toast: true
			})
			return
		}

		try {
			await axios.post(`${API_URL}/api/usuarios`, {
				...formData,
				contraseña: password
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
				id_empresa: '',
				identificacion: '',
				ficha: '',
				correo: '',
				rol: 'aprendiz'
			})
			setPassword('')
		} catch (err) {
			const message =
				err.response?.data?.message || 'Error al registrar usuario'
			console.log(err.response)

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
				<label htmlFor='names-input' className='label register-label'>
					Nombres
				</label>
				<input
					type='text'
					id='names-input'
					className='input register-input'
					name='nombres'
					value={formData.nombres}
					onChange={(e) => {
						setFormData({ ...formData, nombres: e.target.value })
					}}
					placeholder='Ingrese sus nombres'
					// required
					minLength={3}
					maxLength={45}
					pattern='[A-Za-z\s]+'
				/>

				<label htmlFor='lastnames-input' className='label register-label'>
					Apellidos
				</label>
				<input
					type='text'
					id='lastnames-input'
					className='input register-input'
					name='apellidos'
					value={formData.apellidos}
					onChange={handleChange}
					placeholder='Ingrese sus apellidos'
					required
				/>

				<label htmlFor='code-input' className='label register-label'>
					Número de ficha
				</label>
				<select
					className='input register-input'
					id='code-input'
					name='ficha'
					onChange={handleChange}
					required>
					{fichas.length > 0 ? (
						fichas.map((ficha) => (
							<option key={ficha.id} value={ficha.codigo}>
								{ficha.codigo}
							</option>
						))
					) : (
						<option disabled>No hay fichas disponibles</option>
					)}
				</select>

				<label htmlFor='document-input' className='label register-label'>
					Número de documento
				</label>
				<input
					type='text'
					id='document-input'
					className='input register-input'
					name='identificacion'
					value={formData.identificacion}
					onChange={handleChange}
					placeholder='Ingrese su documento'
					required
				/>

				<label htmlFor='email-input' className='label register-label'>
					Correo electrónico
				</label>
				<input
					type='email'
					id='email-input'
					className='input register-input'
					name='correo'
					value={formData.correo}
					onChange={handleChange}
					placeholder='Ingrese su correo electrónico'
					required
				/>

				<label htmlFor='password-input' className='label register-label'>
					Contraseña
				</label>
				<input
					type='password'
					id='password-input'
					className='input register-input'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Ingrese su contraseña'
					required
				/>

				<div className='log-in'>
					<button type='submit' className='button register-button'>
						Registrarse
					</button>
					<Link to={'/'}>
						<p className='log-in-link'>Iniciar Sesión</p>
					</Link>
				</div>
			</form>
		</div>
	)
}

export default RegisterForm