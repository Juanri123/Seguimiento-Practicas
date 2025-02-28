import React from "react";
import "../Styles/login.css";


function Login (){
    return (
        <div className="login-container">
            <h2>Ingreso Seguimiento</h2>
            <form>
                <label> Tipo de Cuenta </label>
                <slect name="typeDocument">
                    <option> Seleccione su tipo de cuenta</option>
                    <option> Instructor </option>
                    <optiom> Aprendiz </optiom>
                </slect>
                <label>Número de Documento </label>
                <input type="text" placeholder="Ingrese su Documento" required />

                <label>Contraseña </label>
                <input type="password" placeholder="Ingrese su Contraseña" required />

                <a href="https://outlook.office.com/mail/">Olvide mi contraseña </a>
                <button type="submit">Iniciar Sesión </button>
            </form>
        </div>
    );
}

export default Login;