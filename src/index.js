import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Importa el componente principal
import "./Styles/styles.css";  // Importa estilos globales
import "./Styles/login.css";
import "./Styles/visitas.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
