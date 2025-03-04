import React from 'react';
import "../Login/Login.css"

function login() {
  return (
    <div className="login-section">
      <div className="login">
        <form
          style={{
            transition: "opacity 0.2s ease-in-out 0s, transform 0.2s ease-in-out 0s",
            transform: "scale(1)"
          }}
          id="login-form"
          className="login-form"
        >
          <p>Ingreso Seguimiento</p>
          <label className="login-label">Tipo de Cuenta</label>
          <select className="login-input" name="typeDocument">
            <option disabled>Seleccione su tipo de cuenta</option>
            <option>Instructor</option>
            <option>Aprendiz</option>
          </select>
          <label htmlFor="document-input" className="login-label">
            Número de Documento
          </label>
          <input
            id="document-input"
            type="text"
            className="login-input"
            title="Número de documento"
            placeholder="Ingrese su documento"
            pattern="[0-9]+"
            required
          />
          <label htmlFor="password-input" className="login-label">
            Contraseña
          </label>
          <input
            id="password-input"
            type="password"
            className="login-input"
            title="Contraseña"
            placeholder="Ingrese su contraseña"
            required
            autoComplete="nop"
          />
          <div className="recovery-block">
            <a
              className="new-password"
              href="/"
              onClick={(e) => e.preventDefault()}
            >
              Olvidé mi contraseña
            </a>
            <a
              className="new-password"
              href="/"
              onClick={(e) => e.preventDefault()}
            >
              Mi cuenta está inactiva
            </a>
          </div>
          <button type="submit" id="login-button" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default login;
