import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Scan() {
  const router = useRouter();
  const { id } = router.query;
  const [mensaje, setMensaje] = useState("Verificando...");

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
          dispositivoId
        })
        .then((res) => setMensaje(res.data.message + ` - Llevas ${res.data.puntos} puntos`))
        .catch(() => setMensaje("Error al procesar el escaneo."));
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700">{mensaje}</h1>
    </div>
  );
}
