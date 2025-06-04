import { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Navbar from '../generales/NavBar'
import Sidebar from '../generales/Sidebar'
import { API_URL } from '../../api/globalVars'

const Usuarios = () => {
	const [usuarios, setUsuarios] = useState([])
	const [pagina, setPagina] = useState(1)
	const [totalPaginas, seTtotalPaginas] = useState(1)

	const obtenerUsuarios = async (page) => {
		try {
			const response = await axios.get(
				`${API_URL}/api/usuarios/listarUsuarios`,
				{
					params: {
						page: page,
						limit: 10
					}
				}
			)

			const data = response.data
			setUsuarios(data.usuarios || [])
			seTtotalPaginas(data.totalPages || 1)
		} catch (error) {
			console.log(error.response)
		}
	}

	useEffect(() => {
		obtenerUsuarios(pagina)
	}, [pagina])

	return (
		<div className='container'>
			<Navbar />
			<Sidebar />
			<div className='content'>
				<DataTable
					columns={[
						{
							id: 'nombre',
							name: 'Nombre',
							selector: (usuario) => usuario.nombres + ' ' + usuario.apellidos,
							grow: '2'
						},
						{
							id: 'correo',
							name: 'Correo',
							selector: (usuario) => usuario.correo,
							grow: '2'
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
					]}
					data={usuarios}
					pagination
					paginationPerPage={10}
					responsive
					progressPending={!usuarios.length}
				/>
			</div>
		</div>
	)
}

export default Usuarios