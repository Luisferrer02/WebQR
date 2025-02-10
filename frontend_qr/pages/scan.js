import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Scan() {
  const router = useRouter();
  const { id, token } = router.query;
  const [mensaje, setMensaje] = useState("Verificando...");

  useEffect(() => {
    if (id && token) {
      let dispositivoId = localStorage.getItem("dispositivoId");
      if (!dispositivoId) {
        dispositivoId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem("dispositivoId", dispositivoId);
      }

      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scan`, {
          id: id,
          token: token,
          dispositivoId: dispositivoId
        })
        .then((res) => setMensaje(res.data.message + ` - Llevas ${res.data.puntos} puntos`))
        .catch(() => setMensaje("Error al procesar el escaneo."));
    }
  }, [id, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">{mensaje}</h1>
    </div>
  );
}
