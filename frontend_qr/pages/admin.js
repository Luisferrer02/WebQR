import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function Admin() {
  const [qrId, setQrId] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-qr/${qrId}`);
    setQrUrl(response.data.qrUrl);
    setQrImage(response.data.qrImage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Generador de Códigos QR</h1>
      <input
        type="text"
        placeholder="Nombre del QR (ej: baño)"
        className="border p-2 rounded mb-4"
        value={qrId}
        onChange={(e) => setQrId(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={generateQR}>
        Generar QR
      </button>

      {qrImage && (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Código QR generado:</h2>
          <QRCodeCanvas value={qrUrl} size={256} />
          <p className="mt-2">
            <a href={qrImage} download={`QR-${qrId}.png`} className="text-blue-500">
              Descargar QR
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
