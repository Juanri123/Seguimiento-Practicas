import {useState, useEffect} from 'react'
import Swal from 'sweetalert2'
import {API_URL} from '../../../api/globalVars'
import axios from 'axios'

const BitacoraForm = ({onAddBitacora, bitacoras}) => {
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [error, setError] = useState('')
	const [bitacora, setBitacora] = useState({
		aprendiz_id: '',
		archivo: null
	})
	const [rol, setRol] = useState('')

	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => {
				setError(null)
			}, 2000)
			return () => clearTimeout(timeout)
		}
	}, [error])

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		const idGuardado = localStorage.getItem('usuarioId')
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
		if (idGuardado) {
			setBitacora((prev) => ({...prev, aprendiz_id: idGuardado}))
		}
	}, [])

	const toggleForm = (e) => {
		e.preventDefault()
		setIsFormVisible(!isFormVisible)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!bitacora.aprendiz_id || !bitacora.archivo)
			return setError('Todos los campos son necesarios.')
		if (bitacoras.length >= 12)
			return setError('La cantidad máxima de bitácoras es 12.')

		try {
			const formData = new FormData()
			formData.append('aprendiz_id', bitacora.aprendiz_id)
			formData.append('archivo', bitacora.archivo)

			const {data} = await axios.post(`${API_URL}/api/bitacoras`, formData, {
				headers: {'Content-Type': 'multipart/form-data'}
			})

			if (data && !error) {
				Swal.fire({
					position: 'top',
					icon: 'success',
					title: 'Bitácora subida exitosamente',
					showConfirmButton: false,
					timer: 1200,
					toast: true
				})

				setIsFormVisible(false)
				setBitacora({
					aprendiz_id: bitacora.aprendiz_id,
					archivo: null
				})
				onAddBitacora()
				window.dispatchEvent(new Event('notificacionesActualizadas'))
			} else {
				setError('Error desconocido al subir la bitácora.')
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				'Ocurrió un error al subir la bitácora.'
			setError(errorMessage)
		}
	}

	const handleChange = (e) => {
		const {name, value, files} = e.target
		setBitacora({
			...bitacora,
			[name]: name === 'archivo' ? files[0] : value
		})
	}

	if (rol !== 'aprendiz') return null

	return (
		<form onSubmit={handleSubmit}>
			<button className='button register-button' onClick={toggleForm}>
				Agregar Bitácora
			</button>
			{isFormVisible && (
				<section className='bitacora-form'>
					<h2 className='bitacora-form__title'>Agregar Bitácora</h2>

					<input
						type='file'
						name='archivo'
						className='input report-input'
						onChange={handleChange}
						required
					/>

					{error && (
						<p className='error-message' role='alert'>
							<span role='img' aria-label='error'>
								⚠️
							</span>{' '}
							{error}
							<button
								onClick={() => setError(null)}
								className='close-button'
								aria-label='cerrar alerta'>
								✖
							</button>
						</p>
					)}

					<button
						type='submit'
						className='button register-button'
						disabled={bitacoras.length >= 12}>
						{bitacoras.length >= 12
							? 'Has alcanzado el límite de 12 bitácoras'
							: 'Subir Bitácora'}
					</button>
				</section>
			)}
		</form>
	)
}

export default BitacoraForm