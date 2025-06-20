	import axios from 'axios'
	import { useState, useEffect } from 'react'
	import { Link, useNavigate } from 'react-router-dom'
	import Swal from 'sweetalert2'
	import { API_URL } from '../../api/globalVars'

	const LoginForm = () => {
		const [formData, setFormData] = useState({
			tipoCuenta: '',
			documento: '',
			clave: ''
		})
		const [error, setError] = useState('')
		const navigate = useNavigate()

		useEffect(() => {
			if (error) {
				const timeout = setTimeout(() => {
					setError(null)
				}, 2200)

				return () => clearTimeout(timeout)
			}
		}, [error])

		const handleChange = (e) => {
			setFormData({
				...formData,
				[e.target.name]: e.target.value
			})
		}

		const handleSubmit = async (e) => {
			e.preventDefault()
			setError('')

			try {
				const url = `${API_URL}/api/auth/login`;
				
				const res = await axios.post(url, formData, {
					withCredentials: true
				});

				const usuario = res.data.usuario

				localStorage.setItem('rol', usuario.rol)
				localStorage.setItem('usuarioId', usuario.id)
				localStorage.setItem(
					'usuario',
					JSON.stringify({
						tipoCuenta: formData.tipoCuenta,
						documento: formData.documento
					})
				)

				Swal.fire({
					position: 'top',
					icon: 'success',
					title: 'Inicio exitoso',
					showConfirmButton: false,
					timer: 1200,
					toast: true
				})

				navigate('/inicio')
			} catch (err) {
				console.error('Error al iniciar sesión:', err)
				const message = err.response?.data?.message || 'Error al iniciar sesión'
				setError(message)
			}
		}

		return (
				<div className='login'>
					<form className='login-form' onSubmit={handleSubmit}>
						<label className='label login-label' htmlFor='login-select'>
							Tipo de Cuenta
						</label>
						<select
							className='input login-input'
							id='login-select'
							name='tipoCuenta'
							value={formData.tipoCuenta}
							onChange={handleChange}
							required>
							<option disabled value=''>
								Seleccione su tipo de cuenta
							</option>
							<option value='instructor'>Instructor</option>
							<option value='aprendiz'>Aprendiz</option>
						</select>

						<label className='label login-label' htmlFor='login-document'>
							Número de Documento
						</label>
						<input
							className='input login-input'
							id='login-document'
							type='text'
							name='documento'
							placeholder='Ingrese su documento'
							value={formData.documento}
							onChange={handleChange}
							autoComplete='off'
							required
						/>

						<label className='label login-label' htmlFor='login-password'>
							Contraseña
						</label>
						<input
							type='password'
							className='input login-input'
							id='login-password'
							name='clave'
							placeholder='Ingrese su contraseña'
							value={formData.clave}
							onChange={handleChange}
							autoComplete='off'
							required
						/>

						{error && (
							<p className='error-message' role='alert'>
								<span role='img' aria-label='error'>
									⚠️
								</span>
								{error}
								<button
									onClick={() => setError(null)}
									className='close-button'
									aria-label='cerrar alerta'>
									✖
								</button>
							</p>
						)}

						<div className='recovery-block'>
							<Link to='/forgot-password'>Olvidé mi contraseña</Link>
							<Link to='/registro'>Registrarme</Link>
						</div>

						<button type='submit' className='button login-button'>
							Iniciar Sesión
						</button>
					</form>
				</div>
		)
	}

	export default LoginForm