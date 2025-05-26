import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import NavBar from "../generales/NavBar"
import Sidebar from "../generales/Sidebar"
import { API_URL } from "../../api/globalVars"

function Visitas() {
	const [showForm, setShowForm] = useState(false)
	const [modoEdicion, setModoEdicion] = useState(false)
	const [visitas, setVisitas] = useState([])
	const [visitaEditando, setVisitaEditando] = useState(null)
	const [rol, setRol] = useState("")
	const [usuarioId, setUsuarioId] = useState("")

	const [mostrarMotivoPopup, setMostrarMotivoPopup] = useState(false)
	const [motivoRechazo, setMotivoRechazo] = useState("")
	const [visitaRechazar, setVisitaRechazar] = useState(null)

	useEffect(() => {
		const rolGuardado = localStorage.getItem("rol")
		const idGuardado = localStorage.getItem("usuarioId")
		if (rolGuardado) setRol(rolGuardado.toLowerCase())
		if (idGuardado) setUsuarioId(Number(idGuardado))
	}, [])

	// ✅ Con useCallback ya no da warning
	const obtenerVisitas = useCallback(async () => {
		try {
			const url = `${API_URL}/api/visitas/verVisitas`
			const response = await axios.get(url)
			let todasLasVisitas = response.data.visitas || []

			if (rol === "aprendiz") {
				todasLasVisitas = todasLasVisitas.filter(
					(v) => v.aprendiz_id === Number(usuarioId)
				)
			}

			setVisitas(todasLasVisitas)
		} catch (error) {
			console.error("Error al obtener visitas:", error.message)
		}
	}, [rol, usuarioId])

	useEffect(() => {
		if (rol && usuarioId) {
			obtenerVisitas()
		}
	}, [rol, usuarioId, obtenerVisitas])

	const toggleForm = () => {
		setShowForm(!showForm)
		setModoEdicion(false)
		setVisitaEditando(null)
	}

	const handleAddOrUpdateVisita = async (e) => {
		e.preventDefault()

		const usuarioId = localStorage.getItem("usuarioId")

		const nuevaVisita = {
			direccion: e.target["direccion-visita"].value,
			tipo: e.target["tipo-visita"].value,
			fecha: e.target["dia"].value,
			aprendiz_id: usuarioId, // 👈🏽 correcto
		}

		if (!nuevaVisita.direccion || !nuevaVisita.tipo || !nuevaVisita.fecha) {
			alert("Completa todos los campos.")
			return
		}

		try {
			const url = modoEdicion
				? `${API_URL}/api/visitas/${visitaEditando.id}`
				: `${API_URL}/api/visitas`
			const method = modoEdicion ? "put" : "post"

			await axios({
				method,
				url,
				headers: { "Content-Type": "application/json" },
				data: nuevaVisita,
			})

			await obtenerVisitas()
			e.target.reset()
			setShowForm(false)
			setModoEdicion(false)
			setVisitaEditando(null)
		} catch (error) {
			console.error("Error al crear o actualizar visita:", error.message)
		}
	}

	const handleEditar = (visita) => {
		setModoEdicion(true)
		setVisitaEditando(visita)
		setShowForm(true)
	}

	const handleAceptar = async (id) => {
		try {
			const url = `${API_URL}/api/visitas/aceptar/${id}`
			await axios.put(url)
			await obtenerVisitas()
		} catch (error) {
			console.error("Error al aceptar visita:", error)
		}
	}

	const handleRechazar = (visita) => {
		setVisitaRechazar(visita)
		setMostrarMotivoPopup(true)
	}

	const confirmarRechazo = async () => {
		try {
			const url = `${API_URL}/api/visitas/rechazar/${visitaRechazar.id}`
			await axios.put(
				url,
				{ motivo: motivoRechazo },
				{ headers: { "Content-Type": "application/json" } }
			)

			const notificaciones =
				JSON.parse(localStorage.getItem("notificaciones")) || []
			const nuevaNotificacion = {
				id: Date.now(),
				mensaje: `Tu visita del ${visitaRechazar.fecha.split("T")[0]
					} fue rechazada. Motivo: ${motivoRechazo}`,
				estado: "pendiente",
			}
			localStorage.setItem(
				"notificaciones",
				JSON.stringify([...notificaciones, nuevaNotificacion])
			)

			setMostrarMotivoPopup(false)
			setMotivoRechazo("")
			setVisitaRechazar(null)
			await obtenerVisitas()
		} catch (error) {
			console.error("Error al rechazar visita:", error)
		}
	}

	return (
		<div className="container">
			<NavBar />
			<Sidebar />
			<div className="content">
				<div className="visits-section">
					<div className="visit-list">
						{visitas.length === 0 ? (
							<p>No hay visitas registradas</p>
						) : (
							visitas.map((visita) => (
								<div
									key={visita.id}
									className={`visit-item estado${visita.estado}`}
								>
									<p>{visita.direccion}</p>
									<p>{visita.tipo}</p>
									<p>{visita.fecha.split("T")[0]}</p>

									{rol === "aprendiz" && (
										<button
											className="button register-button"
											onClick={() => handleEditar(visita)}
										>
											Editar
										</button>
									)}

									{rol === "instructor" && (
										<div className="visit-buttons">
											<button
												className="visit-button accept"
												onClick={() => handleAceptar(visita.id)}
											>
												✔️
											</button>
											<button
												className="visit-button reject"
												onClick={() => handleRechazar(visita)}
											>
												❌
											</button>
										</div>
									)}
								</div>
							))
						)}
					</div>

					{showForm && (
						<form className="visit-form" onSubmit={handleAddOrUpdateVisita}>
							<h3>{modoEdicion ? "Editar Visita" : "Solicitud de Visita"}</h3>
							<input
								type="date"
								name="dia"
								className="input visit-input"
								required
								defaultValue={
									modoEdicion ? visitaEditando.fecha.split("T")[0] : ""
								}
							/>
							<input
								type="text"
								name="direccion-visita"
								placeholder="Dirección de la visita"
								className="input visit-input"
								required
								defaultValue={modoEdicion ? visitaEditando.direccion : ""}
							/>
							<select
								name="tipo-visita"
								className="input visit-input"
								required
								defaultValue={modoEdicion ? visitaEditando.tipo : ""}
							>
								<option value="">Selecciona tipo de visita</option>
								<option value="Presencial">Presencial</option>
								<option value="Virtual">Virtual</option>
							</select>
							<button type="submit" className="button register-button">
								{modoEdicion ? "Actualizar" : "Solicitar"}
							</button>
						</form>
					)}

					{rol === "aprendiz" && (
						<button className="button register-button" onClick={toggleForm}>
							{showForm ? "Cancelar" : "Solicitar visita"}
						</button>
					)}

					{mostrarMotivoPopup && (
						<div className="popup-overlay">
							<div className="popup-content">
								<h3>Motivo del rechazo</h3>
								<textarea
									value={motivoRechazo}
									onChange={(e) => setMotivoRechazo(e.target.value)}
									placeholder="Escribe el motivo del rechazo..."
									className="popup-textarea"
								/>
								<div className="popup-buttons">
									<button onClick={confirmarRechazo} className="popup-confirm">
										Confirmar
									</button>
									<button
										onClick={() => setMostrarMotivoPopup(false)}
										className="popup-cancel"
									>
										Cancelar
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Visitas