import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Inicio from "./Pages/Inicio";
import Header from "./Components/Header";
import Login from "./Components/Login";
import "./Styles/styles.css";
import "./Styles/login.css";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />}/>
        <Route path="/login" elementt={<Login />} />
      </Routes>
    </Router>
  );
}
  

export default App;
