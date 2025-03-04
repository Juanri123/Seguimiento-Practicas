import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./Components/login";
import Bitacoras from "./Pages/Bitacoras";
import Certificacion from "./Pages/Certificacion";
import Inicio from "./Pages/Inicio";
import Visitas from "./Pages/Visitas";
import "./Styles/styles.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Inicio />}/>
        <Route path="/visitas" element={<Visitas />}/>
        <Route path="/bitacoras" element={<Bitacoras />}/>
        <Route path="/certificacion" element={<Certificacion />}/>
      </Routes>
    </Router>
  );
}
  

export default App;
