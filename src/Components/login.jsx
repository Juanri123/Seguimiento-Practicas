import React from "react";
function login() {
  return (
    <div class="login-section">
      <div class="login">
        <form
          style="transition: opacity 0.2s ease-in-out 0s, transform 0.2s ease-in-out 0s; transform: scale(1);"
          id="login-form"
          className="login-form"
        />
        <p>Ingreso Seguimiento</p>
        <label className="login-label">Tipo de Cuenta</label>
        <select className="login-input" name="typeDocument">
          <option disabled>Seleccione su tipo de cuenta</option>
          <option>Instructor</option>
          <option>Aprendiz</option>
        </select>
        <label for="document-input" className="login-label">
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
        <label for="password-input" className="login-label">
          Contraseña
        </label>
        <input
          id="password-input"
          type="password"
          class="login-input"
          title="Contraseña"
          placeholder="Ingrese su contraseña"
          required
          autocomplete="nop"
        />
        <div className="recovery-block">
          <a className="new-password" href="#">
            Olvidé mi contraseña
          </a>
          <a className="new-password" href="#">
            Mi cuenta está inactiva
          </a>
        </div>
        <button type="submit" id="login-button" className="login-button">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
export default login;
