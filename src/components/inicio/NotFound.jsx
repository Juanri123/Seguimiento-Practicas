import { Link } from "react-router-dom";
import HomeIcon from "../../icons/HomeIcon";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found-title">404 - Página no encontrada</h1>
      <p className="not-found-message">Inicie sesión para continuar...</p>
      <Link draggable="false" to="/" className="button not-found-link">
        <HomeIcon width={20} heigth={20} />
        Volver a inicio
      </Link>
    </div>
  );
};

export default NotFound;