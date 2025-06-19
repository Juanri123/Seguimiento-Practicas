import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../api/globalVars";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    if (!token) {
      setError("Token inválido o expirado.");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [token, navigate]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(password))
      errors.push("Debe incluir al menos una letra mayúscula.");
    if (!/\d/.test(password)) errors.push("Debe incluir al menos un número.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Debe incluir al menos un carácter especial.");

    setPasswordErrors(errors);

    if (errors.length === 0) {
      setPasswordStrength("Fuerte");
    } else if (errors.length <= 2) {
      setPasswordStrength("Media");
    } else {
      setPasswordStrength("Débil");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (passwordErrors.length > 0) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Contraseña restablecida correctamente.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.message || "Error al restablecer la contraseña.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          Restablecer Contraseña
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <ul
            style={{
              textAlign: "left",
              paddingLeft: "15px",
              fontSize: "14px",
              color: "red",
            }}
          >
            {passwordErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <label
            style={{
              fontSize: "14px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />{" "}
            Mostrar Contraseña
          </label>
          <button
            type="submit"
            disabled={passwordStrength !== "Fuerte"}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor:
                passwordStrength !== "Fuerte" ? "gray" : "#007BFF",
            }}
          >
            Restablecer
          </button>
        </form>
        {message && (
          <p style={{ color: "green", fontSize: "14px", marginTop: "10px" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
