import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='icon icon-tabler icons-tabler-outline icon-tabler-user'>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
								<path d='M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' />
							</svg>
							Usuarios
						</button>
					</Link>
					<Link className='sidebar-link' to='/fichas'>
						<button className='button sidebar-button'>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='icon icon-tabler icons-tabler-outline icon-tabler-article'>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<path d='M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z' />
								<path d='M7 8h10' />
								<path d='M7 12h10' />
								<path d='M7 16h10' />
							</svg>
							Fichas
						</button>
					</Link>
				</>
			)}

			<Link className='sidebar-link' to='/bitacoras'>
				<button className='button sidebar-button'>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='icon icon-tabler icons-tabler-outline icon-tabler-book-2'>
						<path stroke='none' d='M0 0h24v24H0z' fill='none' />
						<path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z' />
						<path d='M19 16h-12a2 2 0 0 0 -2 2' />
						<path d='M9 8h6' />
					</svg>
					Bitácoras
				</button>
			</Link>

			<Link className='sidebar-link' to='/reportes'>
				<button className='button sidebar-button'>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='icon icon-tabler icons-tabler-outline icon-tabler-article'>
						<path stroke='none' d='M0 0h24v24H0z' fill='none' />
						<path d='M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z' />
						<path d='M7 8h10' />
						<path d='M7 12h10' />
						<path d='M7 16h10' />
					</svg>
					Reportes
				</button>
			</Link>

			<Link className='sidebar-link' to='/visitas'>
				<button className='button sidebar-button'>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='icon icon-tabler icons-tabler-outline icon-tabler-calendar-week'>
						<path stroke='none' d='M0 0h24v24H0z' fill='none' />
						<path d='M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z' />
						<path d='M16 3v4' />
						<path d='M8 3v4' />
						<path d='M4 11h16' />
						<path d='M7 14h.013' />
						<path d='M10.01 14h.005' />
						<path d='M13.01 14h.005' />
						<path d='M16.015 14h.005' />
						<path d='M13.015 17h.005' />
						<path d='M7.01 17h.005' />
						<path d='M10.01 17h.005' />
					</svg>
					Visitas
				</button>
			</Link>

			<Link className='sidebar-link' to='/ajustes'>
				<button className='button sidebar-button'>
					<svg
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='icon icon-tabler icons-tabler-outline icon-tabler-settings'>
						<path stroke='none' d='M0 0h24v24H0z' fill='none' />
						<path d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z' />
						<path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' />
					</svg>
					Ajustes
				</button>
			</Link>
		</div>
	)
}

export default Sidebar