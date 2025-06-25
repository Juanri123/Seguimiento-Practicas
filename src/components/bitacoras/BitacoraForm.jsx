import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'
import axios from 'axios'

const BitacoraForm = ({ onAddBitacora, bitacoras }) => {
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [error, setError] = useState('')
	const [bitacora, setBitacora] = useState({ aprendiz_id: '', archivo: null })
	const [rol, setRol] = useState('')
	const fileInputRef = useRef(null)

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		const idGuardado = localStorage.getItem('usuarioId')
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
		if (idGuardado) setBitacora((prev) => ({ ...prev, aprendiz_id: idGuardado }))
	}, [])

	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => setError(null), 2000)
			return () => clearTimeout(timeout)
		}
	}, [error])

	const toggleForm = (e) => {
		e.preventDefault()
		setIsFormVisible(!isFormVisible)
	}

	const handleChange = (e) => {
		const { name, files } = e.target
		setBitacora({
			...bitacora,
			[name]: files[0]
		})
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

			console.log('Archivo seleccionado:', bitacora.archivo)

			await axios.post(`${API_URL}/api/bitacoras`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			})

			Swal.fire({
				position: 'top',
				icon: 'success',
				title: 'Bitácora subida exitosamente',
				showConfirmButton: false,
				timer: 1200,
				toast: true
			})

			setBitacora({ aprendiz_id: bitacora.aprendiz_id, archivo: null })
			if (fileInputRef.current) fileInputRef.current.value = ''
			setIsFormVisible(false)
			onAddBitacora()
			window.dispatchEvent(new Event('notificacionesActualizadas'))
		} catch (error) {
			console.error('Error al subir bitácora:', error)
			setError(
				error.response?.data?.error || 'Ocurrió un error al subir la bitácora.'
			)
		}
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
						ref={fileInputRef}
						accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
						required
					/>

					{error && (
						<p className='error-message' role='alert'>
							⚠️ {error}
							<button onClick={() => setError(null)} className='close-button'>
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
