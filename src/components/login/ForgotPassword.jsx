import { useState } from "react";
import { forgotPassword } from "../../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      alert("Revisa tu correo para restablecer tu contraseña.");
      setEmail("");
    } catch (err) {
      setError("No se pudo enviar la solicitud. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Restablecer Contraseña</h2>
        <p style={styles.subtitle}>
          Ingrese su correo para recibir instrucciones.
        </p>

        <label htmlFor="email" style={styles.label}>
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: "20px",
    height: "330px",
    width: "370px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "10px",
    marginTop: "30px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    marginTop: "10px",
    outline: "none",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default ForgotPassword;
