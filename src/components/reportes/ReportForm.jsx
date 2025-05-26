import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { API_URL } from '../../api/globalVars'

const ReportForm = ({ onAddReporte, onClose }) => {
  const [reporte, setReporte] = useState({
    nombre: '',
    motivo: '',
    id_usuario: '' // Aquí guardamos el id del instructor
  })
  const [archivo, setArchivo] = useState(null)
  const [rol, setRol] = useState('')

  useEffect(() => {
    const rolGuardado = localStorage.getItem('rol')
    const idGuardado = localStorage.getItem('usuarioId')
    if (rolGuardado) {
      setRol(rolGuardado.toLowerCase())
    }
    if (idGuardado) {
      setReporte((prev) => ({ ...prev, id_usuario: idGuardado }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReporte({ ...reporte, [name]: value })
  }

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0])
  }

  const uploadReport = async () => {
    const { nombre, motivo, id_usuario } = reporte
    if (!nombre || !motivo) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos.',
        toast: true,
        backdrop: true
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('motivo', motivo)
      formData.append('id_usuario', id_usuario)
      if (archivo) {
        formData.append('archivo', archivo)
      }

      const url = `${API_URL}/api/reportes`
      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.nuevoReporte) {
        onAddReporte(data.nuevoReporte)
        setReporte({ nombre: '', motivo: '', id_usuario }) // Mantener id_usuario
        setArchivo(null)
        onClose()

        await Swal.fire({
          title: 'Reporte subido.',
          text: 'El reporte fue subido exitosamente.',
          toast: true,
          position: 'bottom-left',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
      }
    } catch (error) {
      console.error('Error al subir el reporte:', error.response?.data || error.message)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al subir el reporte.',
        toast: true,
        position: 'bottom-left'
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    uploadReport()
  }

  return (
    <form className='report-form' onSubmit={handleSubmit} encType='multipart/form-data'>
      <h2 className='report-form__title'>Agregar Reporte</h2>
      <input
        type='text'
        name='nombre'
        placeholder='Nombre del reporte'
        className='input report-input'
        value={reporte.nombre}
        onChange={handleChange}
      />
      <input
        type='text'
        name='motivo'
        placeholder='Motivo del reporte'
        className='input report-input'
        value={reporte.motivo}
        onChange={handleChange}
      />
      <input
        type='file'
        name='archivo'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleArchivoChange}
        className='input report-input'
      />
      <button type='submit' className='button register-button'>
        Subir Reporte
      </button>
    </form>
  )
}

export default ReportForm
