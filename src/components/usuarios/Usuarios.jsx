import { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Navbar from '../generales/NavBar'
import Sidebar from '../generales/Sidebar'
import { API_URL } from '../../api/globalVars'

const Usuarios = () => {
	const [usuarios, setUsuarios] = useState([])
	const [pagina, setPagina] = useState(1)
	const [totalPaginas, setTotalPaginas] = useState(1)
	const [totalRegistros, setTotalRegistros] = useState(0)
	const [cargando, setCargando] = useState(false)

	const obtenerUsuarios = async () => {
		try {
			setCargando(true)
			const response = await axios.get(`${API_URL}/api/usuarios/listarUsuarios`, {
				params: {
					page: pagina,
					limit: 10
				}
			})

			const data = response.data
			setUsuarios(data.usuarios || [])
			setTotalRegistros(data.totalUsuarios || 0)
			setTotalPaginas(data.totalPages || 1)
			setCargando(false)
		} catch (error) {
			console.error('Error al obtener los usuarios:', error.message)
			setCargando(false)
		}
	}

	useEffect(() => {
		obtenerUsuarios()
	}, [pagina])

	const handlePageChange = (page) => {
		setPagina(page)
	}

	const columnas = [
		{
			id: 'nombre',
			name: 'Nombre',
			selector: (usuario) => usuario.nombres + ' ' + usuario.apellidos,
			grow: 2
		},
		{
			id: 'correo',
			name: 'Correo',
			selector: (usuario) => usuario.correo,
			grow: 2
		},
		{
			id: 'identificacion',
			name: 'Identificación',
			selector: (usuario) => usuario.identificacion
		},
		{
			id: 'rol',
			name: 'Rol',
			selector: (usuario) => usuario.rol
		}
	]

	return (
		<div className='container'>
			<Navbar />
			<Sidebar />
			<div className='content'>
				<DataTable
					columns={columnas}
					data={usuarios}
					pagination
					paginationServer
					paginationTotalRows={totalRegistros}
					paginationPerPage={10}
					paginationDefaultPage={pagina}
					onChangePage={handlePageChange}
					progressPending={cargando}
					responsive
				/>
			</div>
		</div>
	)
}

export default Usuarios
