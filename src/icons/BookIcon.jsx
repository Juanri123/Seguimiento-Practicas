const BookIcon = (props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		{...props}>
		<path stroke='none' d='M0 0h24v24H0z' fill='none' />
		<path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z' />
		<path d='M19 16h-12a2 2 0 0 0 -2 2' />
		<path d='M9 8h6' />
	</svg>
)

export default BookIcon