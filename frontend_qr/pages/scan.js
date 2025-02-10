import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Scan() {
  const router = useRouter();
  const { id } = router.query;
  const [mensaje, setMensaje] = useState("Verificando...");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [solicitarNombre, setSolicitarNombre] = useState(false);

  useEffect(() => {
    if (id) {
      let dispositivoId = localStorage.getItem("dispositivoId");
      if (!dispositivoId) {
        dispositivoId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem("dispositivoId", dispositivoId);
      }

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scan`, {
          id,
          dispositivoId,
        })
        .then((res) => {
          setMensaje(res.data.message + ` - Llevas ${res.data.puntos} puntos`);
          setSolicitarNombre(res.data.solicitarNombre);
        })
        .catch(() => setMensaje("Error al procesar el escaneo."));
    }
  }, [id]);

  const enviarNombre = () => {
    let dispositivoId = localStorage.getItem("dispositivoId");

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scan`, {
        id,
        dispositivoId,
        nombre,
        apellido,
      })
      .then((res) => {
        setMensaje(res.data.message + ` - Llevas ${res.data.puntos} puntos`);
        setSolicitarNombre(false); // Ya ingresó su nombre
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700">
        {mensaje}
      </h1>

      {solicitarNombre && (
        <div className="mt-4 flex flex-col items-center">
          <p className="mb-2">
            Por favor, introduce tu nombre y apellido para participar:
          </p>
          <input
            type="text"
            placeholder="Nombre"
            className="border p-2 mb-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido"
            className="border p-2 mb-2 rounded"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
          <button
            onClick={enviarNombre}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Guardar Nombre
          </button>
        </div>
      )}
    </div>
  );
}
