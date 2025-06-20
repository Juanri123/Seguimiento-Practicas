import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserIcon from '../../icons/UserIcon'
import ArticleIcon from '../../icons/ArticleIcon'
import BookIcon from '../../icons/BookIcon'
import CalendarIcon from '../../icons/CalendarIcon'
import SettingsIcon from '../../icons/SettingsIcon'

const Sidebar = () => {
	const [rol, setRol] = useState(null)

	useEffect(() => {
		const rolGuardado = localStorage.getItem('rol')
		if (rolGuardado) {
			setRol(rolGuardado.toLowerCase().trim())
		}
	}, [])

	if (!rol) return null

	return (
		<div className='sidebar'>
			{rol === 'instructor' && (
				<>
					<Link className='sidebar-link' to='/usuarios'>
						<button className='button sidebar-button'>
							<UserIcon width={24} height={24} />
							Usuarios
						</button>
					</Link>
					<Link className='sidebar-link' to='/fichas'>
						<button className='button sidebar-button'>
							<ArticleIcon width={24} height={24} />
							Fichas
						</button>
					</Link>
				</>
			)}

			<Link className='sidebar-link' to='/bitacoras'>
				<button className='button sidebar-button'>
					<BookIcon width={24} height={24} />
					Bitácoras
				</button>
			</Link>

			<Link className='sidebar-link' to='/reportes'>
				<button className='button sidebar-button'>
					<ArticleIcon width={24} height={24} />
					Reportes
				</button>
			</Link>

			<Link className='sidebar-link' to='/visitas'>
				<button className='button sidebar-button'>
					<CalendarIcon width={24} height={24} />
					Visitas
				</button>
			</Link>

			<Link className='sidebar-link' to='/ajustes'>
				<button className='button sidebar-button'>
					<SettingsIcon width={24} height={24} />
					Ajustes
				</button>
			</Link>
		</div>
	)
}

export default Sidebar