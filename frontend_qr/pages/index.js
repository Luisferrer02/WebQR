import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Treasure Hunt QR</h1>
      <Link href="/admin" className="bg-green-500 text-white px-4 py-2 rounded mb-2">
        Generar Códigos QR
      </Link>
    </div>
  );
}
