import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function Admin() {
  const [qrId, setQrId] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  // Obtener la leaderboard
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard`)
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Error obteniendo leaderboard:", err));
  }, []);

  // Generar QR
  const generateQR = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-qr`, {
      qrId
    });
    setQrUrl(response.data.qrUrl);
    setQrImage(response.data.qrImage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 text-white p-6">
      {/* Generador de QR */}
      <h1 className="text-3xl font-bold mb-4">Generador de Códigos QR</h1>
      <input
        type="text"
        placeholder="Nombre del QR (ej: baño)"
        className="border p-2 rounded mb-4 text-gray-900"
        value={qrId}
        onChange={(e) => setQrId(e.target.value)}
      />
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" 
        onClick={generateQR}
      >
        Generar QR
      </button>

      {qrImage && (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Código QR generado:</h2>
          <QRCodeCanvas value={qrUrl} size={256} />
          <p className="mt-2">
            <a href={qrImage} download={`QR-${qrId}.png`} className="text-blue-400 hover:underline">
              Descargar QR
            </a>
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <h2 className="text-3xl font-bold mt-8 mb-4">🏆 Leaderboard 🏆</h2>
      {usuarios.length > 0 ? (
        <table className="w-full max-w-lg table-auto border-collapse border border-gray-500">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-500 px-4 py-2">Nombre</th>
              <th className="border border-gray-500 px-4 py-2">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index} className="text-center bg-gray-800 hover:bg-gray-600">
                <td className="border border-gray-500 px-4 py-2">
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="border border-gray-500 px-4 py-2">{usuario.puntos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg mt-4 text-gray-300">No hay jugadores registrados aún.</p>
      )}
    </div>
  );
}
