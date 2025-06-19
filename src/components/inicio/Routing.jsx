import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { lazy, Suspense } from "react";
const Login = lazy(() => import("../login/Login"));
const Register = lazy(() => import("../login/Register"));
const Bitacoras = lazy(() => import("../bitacoras/MainContent"));
const Inicio = lazy(() => import("../inicio/Inicio"));
const Usuarios = lazy(() => import("../usuarios/Usuarios"));
const Visitas = lazy(() => import("../visitas/Visitas"));
const Reportes = lazy(() => import("../reportes/Reportes"));
const Fichas = lazy(() => import("../ficha/fichas"));
const ForgotPassword = lazy(() => import("../login/ForgotPassword"));
const ResetPassword = lazy(() => import("../login/ResetPassword"));
const NotFound = lazy(() => import("../inicio/NotFound"));
const Content = lazy(() => import("../generales/Content"));
const RutasProtegidas = lazy(() => import("../utils/RutasProtegidas"));
const AjustesUsuario = lazy(() => import("../usuarios/AjustesUsuario"));

function Routing() {
  const [user] = useLocalStorage("usuario");

  return (
    <Router>
      <Suspense fallback={<div>Cargando página ...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<RutasProtegidas acceso={user} />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/id" element={<Content />} />
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/fichas" element={<Fichas />} />
            <Route path="/bitacoras" element={<Bitacoras />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/ajustes" element={<AjustesUsuario />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default Routing;