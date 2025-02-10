import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al Treasure Hunt QR</h1>
      <Link href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded">
        Ir al Generador de QR
      </Link>
    </div>
  );
}
