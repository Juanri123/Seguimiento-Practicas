import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Inicio from "./Pages/Inicio";
import "./Styles/styles.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />}/>
      </Routes>
    </Router>
  );
}
  

export default App;
