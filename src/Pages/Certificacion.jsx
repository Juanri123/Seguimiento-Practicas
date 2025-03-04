import { useState } from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200">
      <img
        src="./css/img/colombia-potencia-de-vida-logo (1).png"
        alt="Logo"
        width="30"
      />
      <div className="flex gap-4">
        <input type="text" placeholder="Buscar..." className="border p-1" />
        <img src="./css/img/foto-persona.png" alt="Usuario" width="30" />
        <img src="./css/img/sena-logo (1).png" alt="Inicio" width="30" />
      </div>
    </nav>
  );
};

const Certifications = ({ certifications, addCertification }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Certificaciones</h2>
      <div className="mt-2 space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="flex justify-between p-2 border rounded">
            <span>{cert}</span>
            <button className="bg-blue-500 text-white px-2 py-1 rounded">
              Ver
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addCertification}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Solicitar certificación
      </button>
    </div>
  );
};

const RequestCertification = ({ handleRequest }) => {
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [archivo, setArchivo] = useState(null);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Solicitud de certificación</h2>
      <input
        type="text"
        placeholder="Tipo de certificación"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="w-full border p-2 mt-2"
      />
      <input
        type="text"
        placeholder="Motivo de la solicitud"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        className="w-full border p-2 mt-2"
      />
      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="w-full border p-2 mt-2"
      />
      <button
        onClick={() => handleRequest(tipo, motivo, archivo)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Solicitar
      </button>
    </div>
  );
};
function App() {
  const [certifications, setCertifications] = useState(["Certificación 1"]);

  const addCertification = () => {
    setCertifications([...certifications, "Certificación Nueva"]);
  };

  const handleRequest = (tipo, motivo, archivo) => {
    if (!tipo || !motivo || !archivo) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    alert(
      `Solicitud enviada:\nTipo: ${tipo}\nMotivo: ${motivo}\nArchivo: ${archivo.name}`
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Certifications
          certifications={certifications}
          addCertification={addCertification}
        />
        <RequestCertification handleRequest={handleRequest} />
      </div>
    </div>
  );
}
export default App;
